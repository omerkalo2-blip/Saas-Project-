import { normalizeTransaction, transactionFingerprint } from './portfolio.ts';
import type { Transaction } from './portfolio.ts';

export const LEDGER_HEADERS = ['id','date','asset','type','quantity','price_usd','fee_usd','account','note'];

export function parseCsv(input: string): string[][] {
  const text = input.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i+1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else field += c;
    } else if (c === '"') {
      if (field || closed) throw new Error('Invalid CSV quoting.');
      quoted = true;
    } else if (c === ',') { row.push(field); field = ''; closed = false; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i+1] === '\n') i++;
      row.push(field);
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = []; field = ''; closed = false;
    } else {
      if (closed && c !== ' ' && c !== '\t') throw new Error('Unexpected characters after a quoted CSV field.');
      if (!closed) field += c;
    }
  }
  if (quoted) throw new Error('CSV contains an unclosed quote.');
  row.push(field);
  if (row.some(v => v.trim() !== '')) rows.push(row);
  return rows;
}

function csvNumber(raw: string | undefined, label: string, optional = false): number | null {
  if (raw === undefined || raw.trim() === '') {
    if (optional) return null;
    throw new Error(`${label} is required.`);
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw.trim())) throw new Error(`${label} must be numeric.`);
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`${label} must be finite.`);
  return n;
}

export function parseLedgerCsv(text: string): Transaction[] {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error('CSV is empty.');
  const headers = rows[0].map(s => s.trim().toLowerCase());
  if (new Set(headers).size !== headers.length) throw new Error('CSV contains duplicate column names.');
  const unsupported = headers.filter(h => !LEDGER_HEADERS.includes(h));
  if (unsupported.length) throw new Error(`Unsupported columns: ${unsupported.join(', ')}. Use the manual ledger template; live multi-chain source formats need a dedicated adapter.`);
  for (const key of ['date','asset','type','quantity','price_usd']) {
    if (!headers.includes(key)) throw new Error(`Missing ${key} column. Download the template.`);
  }
  return rows.slice(1).map((row, index) => {
    try {
      if (row.length !== headers.length) throw new Error('Column count does not match the header.');
      const r = Object.fromEntries(headers.map((h,i) => [h,row[i]]));
      const transaction = normalizeTransaction({
        id: r.id?.trim() || 'import-pending', date: r.date, asset: r.asset,
        type: r.type?.trim().toLowerCase(), quantity: csvNumber(r.quantity,'Quantity'),
        priceUsd: csvNumber(r.price_usd,'Price',true), feeUsd: csvNumber(r.fee_usd || '0','Fee'),
        account: r.account || 'Manual account', note: r.note || ''
      });
      if (!r.id?.trim()) transaction.id = 'csv:' + transactionFingerprint(transaction);
      return transaction;
    } catch (error) { throw new Error(`CSV row ${index+2}: ${(error as Error).message}`); }
  });
}

/** Keep spreadsheet formula strings inert; actual numeric cells remain numbers. */
export function toCsv(rows: (string | number | null)[][]): string {
  return '\uFEFF' + rows.map(row => row.map(value => {
    let s = value === null ? '' : String(value);
    if (typeof value === 'string' && /^[\s]*[=+@-]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
  }).join(',')).join('\r\n');
}

export function ledgerCsv(transactions: Transaction[]) {
  return toCsv([LEDGER_HEADERS,...transactions.map(t => [t.id,t.date,t.asset,t.type,t.quantity,t.priceUsd,t.feeUsd,t.account,t.note])]);
}

export function downloadFile(name: string, content: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content],{type}));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
