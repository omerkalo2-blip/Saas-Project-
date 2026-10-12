/** Production contracts for the next adapter milestone, not implemented live integrations. */
export interface AssetIdentity {
  assetId: string;
  namespace: 'manual' | 'eip155' | 'solana' | 'bip122';
  chainReference: string;
  tokenReference: string;
  symbol: string;
  decimals: number;
}
export interface SourceRecord {
  sourceId: string;
  sourceEventId: string;
  accountId: string;
  observedAt: string;
  transactionHash?: string;
  blockReference?: string;
  eventIndex?: string;
  parserVersion: string;
  rawRecord: unknown;
}
export interface CanonicalMovement {
  id: string;
  eventId: string;
  accountId: string;
  assetId: string;
  quantityAtomic: string;
  direction: 'in' | 'out';
  economicRole: 'principal' | 'fee' | 'reward' | 'collateral' | 'debt';
}
export interface ValuationEvidence {
  assetId: string;
  quoteCurrency: string;
  amountDecimal: string;
  observedAt: string;
  provider: string;
  methodologyVersion: string;
  status: 'observed' | 'estimated' | 'manual' | 'missing';
}
export interface LedgerCorrection {
  id: string;
  eventId: string;
  previousRevision: number;
  createdAt: string;
  reason: string;
  replacement: unknown;
}
export interface DataAdapter {
  id: string;
  coverage: {chains:string[];protocols:string[];historicalEvents:boolean};
  readAccount(accountId:string,cursor?:string):Promise<{records:SourceRecord[];nextCursor?:string;requestUnits:number;complete:boolean}>;
}
