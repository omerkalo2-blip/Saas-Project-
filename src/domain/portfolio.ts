export type TransactionType = 'buy' | 'sell' | 'reward' | 'opening';

export interface Transaction {
  id: string;
  date: string;
  asset: string;
  type: TransactionType;
  quantity: number;
  priceUsd: number | null;
  feeUsd: number;
  account: string;
  note: string;
}

export interface Quote { asset: string; priceUsd: number; updatedAt: string; }
export interface PortfolioData { transactions: Transaction[]; quotes: Record<string, Quote>; }
export interface Issue { key: string; asset: string; transactionId?: string; message: string; }
export interface Holding {
  asset: string;
  quantity: number;
  costBasis: number | null;
  priceUsd: number | null;
  valueUsd: number | null;
  unrealizedPnl: number | null;
}
export interface Disposal {
  transactionId: string;
  date: string;
  asset: string;
  quantity: number;
  proceeds: number;
  costBasis: number | null;
  fee: number;
  pnl: number | null;
  account: string;
}
export interface PortfolioSnapshot {
  holdings: Holding[];
  disposals: Disposal[];
  totalValue: number | null;
  unrealizedPnl: number | null;
  realizedPnl: number | null;
  rewardIncome: number;
  fees: number;
  issues: Issue[];
}

const TYPES: TransactionType[] = ['buy', 'sell', 'reward', 'opening'];
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function normalizeTransaction(value: unknown): Transaction {
  if (!value || typeof value !== 'object') throw new Error('Transaction must be an object.');
  const t = value as Record<string, unknown>;
  const asset = String(t.asset ?? '').trim().toUpperCase();
  const date = new Date(String(t.date ?? ''));
  if (!/^[A-Z0-9][A-Z0-9._-]{0,14}$/.test(asset)) throw new Error('Enter an asset symbol, for example BTC.');
  if (!Number.isFinite(date.getTime())) throw new Error('Enter a valid transaction date.');
  if (!TYPES.includes(t.type as TransactionType)) throw new Error('Choose buy, sell, reward or opening.');
  if (!finite(t.quantity) || t.quantity <= 0) throw new Error('Quantity must be greater than zero.');
  if (!finite(t.feeUsd) || t.feeUsd < 0) throw new Error('Fee must be a non-negative USD amount.');
  if (t.priceUsd !== null && (!finite(t.priceUsd) || t.priceUsd < 0)) throw new Error('Price must be a non-negative USD amount.');
  if (t.type !== 'opening' && t.priceUsd === null) throw new Error('A transaction price is required.');
  if (t.priceUsd !== null && !Number.isFinite(t.quantity * t.priceUsd + t.feeUsd)) throw new Error('Transaction amount is too large.');
  const id = String(t.id ?? '').trim();
  if (!id || id.length > 2000) throw new Error('Transaction needs a unique ID.');
  const account = String(t.account ?? 'Manual account').trim().slice(0, 120) || 'Manual account';
  const note = String(t.note ?? '').slice(0, 1000);
  return { id, asset, date: date.toISOString(), type: t.type as TransactionType,
    quantity: t.quantity, priceUsd: t.priceUsd as number | null, feeUsd: t.feeUsd, account, note };
}

export function normalizePortfolio(value: unknown): PortfolioData {
  if (!value || typeof value !== 'object') throw new Error('Portfolio must be an object.');
  const p = value as Record<string, unknown>;
  if (!Array.isArray(p.transactions) || p.transactions.length > 100000) throw new Error('Invalid transaction list.');
  const transactions = p.transactions.map(normalizeTransaction);
  if (new Set(transactions.map(t => t.id)).size !== transactions.length) throw new Error('Duplicate transaction IDs.');
  const quotes: Record<string, Quote> = Object.create(null);
  if (p.quotes && typeof p.quotes === 'object') {
    for (const [asset, input] of Object.entries(p.quotes)) {
      const q = input as Partial<Quote>;
      if (!/^[A-Z0-9][A-Z0-9._-]{0,14}$/.test(asset) || !q || !finite(q.priceUsd) || q.priceUsd < 0 || !Number.isFinite(Date.parse(q.updatedAt ?? ''))) {
        throw new Error('Invalid price quote.');
      }
      quotes[asset] = { asset, priceUsd: q.priceUsd, updatedAt: new Date(q.updatedAt!).toISOString() };
    }
  }
  return { transactions, quotes };
}

/** Global FIFO across accounts. Internal wallet transfers are not purchases or sales. */
export function calculatePortfolio(data: PortfolioData): PortfolioSnapshot {
  type Lot = { quantity: number; unitCost: number | null };
  const lots = new Map<string, Lot[]>();
  const recordedBalances = new Map<string, number>();
  const disposals: Disposal[] = [];
  const issues: Issue[] = [];
  const invalidAssets = new Set<string>();
  let rewardIncome = 0;
  let fees = 0;
  const ordered = data.transactions.map((t, index) => ({t, index}))
    .sort((a, b) => Date.parse(a.t.date) - Date.parse(b.t.date) || a.index - b.index);
  for (const {t} of ordered) {
    fees += t.feeUsd;
    recordedBalances.set(t.asset,(recordedBalances.get(t.asset) ?? 0)+(t.type === 'sell' ? -t.quantity : t.quantity));
    const assetLots = lots.get(t.asset) ?? [];
    lots.set(t.asset, assetLots);
    if (t.type !== 'sell') {
      const unitCost = t.priceUsd === null ? null : t.priceUsd + t.feeUsd / t.quantity;
      assetLots.push({quantity: t.quantity, unitCost});
      if (t.type === 'reward') rewardIncome += t.quantity * t.priceUsd!;
      if (unitCost === null) issues.push({key: `basis:${t.id}`, asset: t.asset, transactionId: t.id,
        message: 'Opening balance has no acquisition cost. Add its cost before relying on P/L.'});
      continue;
    }
    let remaining = t.quantity;
    const tolerance = t.quantity * 1e-12;
    let costBasis: number | null = invalidAssets.has(t.asset) ? null : 0;
    while (remaining > tolerance && assetLots.length) {
      const lot = assetLots[0];
      const used = Math.min(lot.quantity, remaining);
      if (lot.unitCost === null) costBasis = null;
      else if (costBasis !== null) costBasis += used * lot.unitCost;
      remaining -= used;
      lot.quantity -= used;
      if (lot.quantity <= 0) assetLots.shift();
    }
    if (remaining > tolerance) {
      costBasis = null;
      invalidAssets.add(t.asset);
      issues.push({key: `balance:${t.id}`, asset: t.asset, transactionId: t.id,
        message: 'Sale exceeds the earlier recorded balance. Add the missing acquisition.'});
    }
    const proceeds = t.quantity * t.priceUsd! - t.feeUsd;
    disposals.push({transactionId: t.id, date: t.date, asset: t.asset, quantity: t.quantity,
      proceeds, costBasis, fee: t.feeUsd, pnl: costBasis === null ? null : proceeds - costBasis, account: t.account});
  }
  const holdings: Holding[] = [];
  for (const [asset, assetLots] of lots) {
    const quantity = recordedBalances.get(asset) ?? 0;
    if (quantity <= 0) continue;
    const costBasis = invalidAssets.has(asset) || assetLots.some(l => l.unitCost === null) ? null :
      assetLots.reduce((n, l) => n + l.quantity * l.unitCost!, 0);
    const priceUsd = data.quotes[asset]?.priceUsd ?? null;
    const valueUsd = priceUsd === null || invalidAssets.has(asset) ? null : quantity * priceUsd;
    if (priceUsd === null) issues.push({key: `quote:${asset}`, asset, message: 'Current valuation price is missing. Add a manual quote.'});
    holdings.push({asset, quantity, costBasis, priceUsd, valueUsd,
      unrealizedPnl: valueUsd === null || costBasis === null ? null : valueUsd - costBasis});
  }
  holdings.sort((a,b) => (b.valueUsd ?? -1) - (a.valueUsd ?? -1));
  const nullableSum = (values: (number | null)[]) => values.some(v => v === null) ? null : values.reduce<number>((n,v) => n + v!, 0);
  return { holdings, disposals, issues, rewardIncome, fees,
    totalValue: invalidAssets.size ? null : nullableSum(holdings.map(h => h.valueUsd)),
    unrealizedPnl: nullableSum(holdings.map(h => h.unrealizedPnl)),
    realizedPnl: nullableSum(disposals.map(d => d.pnl)) };
}

export const transactionFingerprint = (t: Transaction) => JSON.stringify([t.date,t.asset,t.type,t.quantity,t.priceUsd,t.feeUsd,t.account,t.note]);

export function mergeTransactions(existing: Transaction[], incoming: Transaction[]) {
  const byId = new Map(existing.map(t => [t.id, t]));
  let added = 0;
  let skipped = 0;
  for (const raw of incoming) {
    const t = normalizeTransaction(raw);
    const previous = byId.get(t.id);
    if (previous) {
      if (transactionFingerprint(previous) !== transactionFingerprint(t)) throw new Error(`ID conflict for ${t.id}. No rows were imported.`);
      skipped++;
    } else { byId.set(t.id, t); added++; }
  }
  return {transactions: [...byId.values()], added, skipped};
}

export function accountingYear(snapshot: PortfolioSnapshot, data: PortfolioData, year: number) {
  const disposals = snapshot.disposals.filter(d => new Date(d.date).getUTCFullYear() === year);
  const transactions = data.transactions.filter(t => new Date(t.date).getUTCFullYear() === year);
  return { disposals,
    realizedPnl: disposals.some(d => d.pnl === null) ? null : disposals.reduce((n,d) => n + d.pnl!, 0),
    rewardIncome: transactions.filter(t => t.type === 'reward').reduce((n,t) => n + t.quantity * t.priceUsd!, 0),
    fees: transactions.reduce((n,t) => n + t.feeUsd, 0) };
}
