import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountingYear,calculatePortfolio,mergeTransactions,normalizePortfolio,normalizeTransaction } from '../src/domain/portfolio.ts';
import type { PortfolioData,Transaction } from '../src/domain/portfolio.ts';
import { ledgerCsv,parseCsv,parseLedgerCsv,toCsv } from '../src/domain/csv.ts';
import { demoPortfolio } from '../src/domain/demo.ts';

const tx = (id:string,type:Transaction['type'],quantity:number,priceUsd:number|null,feeUsd=0,date='2026-01-01T12:00:00Z',asset='ETH'):Transaction =>
  normalizeTransaction({id,type,quantity,priceUsd,feeUsd,date,asset,account:'Manual account',note:''});
const portfolio = (transactions:Transaction[],priceUsd=300):PortfolioData => ({transactions,quotes:{ETH:{asset:'ETH',priceUsd,updatedAt:'2026-10-01T00:00:00Z'}}});
const close = (actual:number|null,expected:number) => {assert.notEqual(actual,null);assert.ok(Math.abs(actual!-expected)<1e-7,`${actual} != ${expected}`);};

test('FIFO spans lots and includes purchase fees and net sale proceeds exactly once',()=>{
  const s=calculatePortfolio(portfolio([tx('a','buy',2,100,2),tx('b','buy',2,200,4),tx('c','sell',3,300,3)]));
  close(s.disposals[0].costBasis,404);close(s.realizedPnl,493);close(s.holdings[0].costBasis,202);close(s.unrealizedPnl,98);close(s.fees,9);
});
test('recorded sale before acquisition stays unresolved and never creates zero-basis profit',()=>{
  const s=calculatePortfolio(portfolio([tx('a','sell',2,200),tx('b','buy',3,100),tx('c','sell',0.5,200)]));
  assert.equal(s.realizedPnl,null);assert.equal(s.disposals[1].pnl,null);assert.equal(s.totalValue,null);assert.ok(s.issues.some(i=>i.key==='balance:a'));
});
test('unknown opening acquisition cost remains unknown through disposal',()=>{
  const s=calculatePortfolio(portfolio([tx('a','opening',2,null),tx('b','sell',1,300)]));
  assert.equal(s.realizedPnl,null);assert.equal(s.unrealizedPnl,null);close(s.totalValue,300);assert.equal(s.holdings[0].costBasis,null);
});
test('missing current price blocks current value, not a historical realized disposal',()=>{
  const s=calculatePortfolio({transactions:[tx('a','buy',2,100),tx('b','sell',1,200)],quotes:{}});
  assert.equal(s.totalValue,null);close(s.realizedPnl,100);assert.ok(s.issues.some(i=>i.key==='quote:ETH'));
});
test('rewards use recorded receipt value for income and subsequent acquisition cost',()=>{
  const s=calculatePortfolio(portfolio([tx('a','reward',2,100,2),tx('b','sell',1,150,1)],200));
  close(s.rewardIncome,200);close(s.realizedPnl,48);close(s.holdings[0].costBasis,101);close(s.unrealizedPnl,99);
});
test('year report filters disposals after using acquisition lots from earlier years',()=>{
  const p=portfolio([tx('a','buy',2,100,0,'2025-12-20T12:00:00Z'),tx('b','sell',1,150,0,'2026-01-02T12:00:00Z')]);
  const report=accountingYear(calculatePortfolio(p),p,2026);close(report.realizedPnl,50);assert.equal(report.disposals.length,1);
});
test('very small legitimate quantities are retained and use their acquisition cost',()=>{
  const s=calculatePortfolio(portfolio([tx('a','buy',2e-12,100000),tx('b','sell',1e-12,200000)],300000));
  assert.ok(Math.abs(s.realizedPnl!-1e-7)<1e-15);assert.ok(s.holdings[0].quantity>0);assert.ok(s.holdings[0].costBasis!>0);
});
test('decimal exhaustion is not mistaken for missing acquisitions',()=>{
  const s=calculatePortfolio(portfolio([tx('a','buy',0.1,100),tx('b','buy',0.2,100),tx('c','sell',0.3,100)]));
  assert.equal(s.issues.length,0);close(s.realizedPnl,0);
});
test('chronological calculation is independent of the input order across distinct timestamps',()=>{
  const buy=tx('a','buy',1,100,0,'2026-01-01T12:00:00Z'),sell=tx('b','sell',1,200,0,'2026-02-01T12:00:00Z');
  close(calculatePortfolio(portfolio([sell,buy])).realizedPnl,100);
});
test('repeat import is idempotent and conflicting IDs fail atomically',()=>{
  const existing=[tx('a','buy',1,100)],incoming=[tx('a','buy',1,100),tx('b','buy',1,200)];
  const merged=mergeTransactions(existing,incoming);assert.equal(merged.added,1);assert.equal(merged.skipped,1);assert.equal(existing.length,1);
  assert.throws(()=>mergeTransactions(existing,[tx('b','buy',1,200),tx('a','buy',2,100)]),/ID conflict/);assert.equal(existing.length,1);
});
test('CSV round-trip preserves quantities, acquisition costs, fees and multiline quoted notes',()=>{
  const source=[{...tx('a','buy',1.25,100.5,2),note:'One, two "quotes"\nand another line',account:'Wallet, one'},tx('b','opening',3,null)];
  assert.deepEqual(parseLedgerCsv(ledgerCsv(source)),source);
});
test('CSV validates malformed columns, numeric fields and unsupported transaction types',()=>{
  assert.throws(()=>parseLedgerCsv('date,asset,type,quantity,price_usd\n2026-01-01,ETH,swap,1,200'),/row 2/);
  assert.throws(()=>parseLedgerCsv('date,asset,type,quantity,price_usd\n2026-01-01,ETH,buy,,200'),/Quantity/);
  assert.throws(()=>parseCsv('one,"unclosed'),/unclosed/);assert.throws(()=>parseCsv('"one"bad,two'),/Unexpected/);
});
test('repeated CSV without IDs produces stable IDs',()=>{
  const text='date,asset,type,quantity,price_usd\n2026-01-01,ETH,buy,1,200';
  const first=parseLedgerCsv(text),second=parseLedgerCsv(text);assert.equal(first[0].id,second[0].id);assert.equal(mergeTransactions(first,second).skipped,1);
});
test('CSV exports keep spreadsheet formula strings inert without changing numeric negatives',()=>{
  const rows=parseCsv(toCsv([['=HYPERLINK("bad")',-25,'@command']]));assert.ok(rows[0][0].startsWith("'="));assert.equal(rows[0][1],'-25');assert.equal(rows[0][2],"'@command");
});
test('invalid saved records and nonfinite quotes are rejected',()=>{
  assert.throws(()=>normalizeTransaction({...tx('a','buy',1,100),quantity:-1}),/Quantity/);
  assert.throws(()=>normalizeTransaction({...tx('a','buy',1,100),priceUsd:Infinity}),/Price/);
  assert.throws(()=>normalizePortfolio({transactions:[],quotes:{ETH:{priceUsd:NaN,updatedAt:'2026-01-01'}}}),/quote/);
  assert.throws(()=>normalizePortfolio({transactions:[tx('a','buy',1,100),tx('a','buy',1,100)],quotes:{}}),/Duplicate/);
});
test('demo totals reconcile from the same ledger rather than hard-coded summary figures',()=>{
  const s=calculatePortfolio(demoPortfolio());close(s.totalValue,40650);close(s.realizedPnl,494.95);close(s.rewardIncome,48);assert.equal(s.issues.length,0);assert.equal(s.holdings.length,4);
});
