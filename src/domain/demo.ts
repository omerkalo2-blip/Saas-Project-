import type { PortfolioData, Transaction } from './portfolio.ts';

const tx = (id: string, date: string, asset: string, type: Transaction['type'], quantity: number, priceUsd: number, feeUsd = 0): Transaction =>
  ({id, date: date+'T12:00:00.000Z',asset,type,quantity,priceUsd,feeUsd,account:'Example account',note:'Demonstration record'});

export function demoPortfolio(): PortfolioData {
  return {transactions:[
    tx('demo-1','2026-01-10','BTC','buy',0.25,60000,10),
    tx('demo-2','2026-02-15','ETH','buy',3,2200,5),
    tx('demo-3','2026-03-10','SOL','buy',80,120,2),
    tx('demo-4','2026-04-15','USDC','buy',2000,1),
    tx('demo-5','2026-06-20','SOL','buy',30,130,1),
    tx('demo-6','2026-07-10','BTC','sell',0.02,75000,3),
    tx('demo-7','2026-08-05','SOL','sell',10,140,1),
    tx('demo-8','2026-09-15','ETH','reward',0.02,2400,0.25),
  ],quotes:Object.fromEntries([['BTC',70000],['ETH',2500],['SOL',150],['USDC',1]].map(([asset,priceUsd]) =>
    [asset,{asset:asset as string,priceUsd:priceUsd as number,updatedAt:'2026-10-01T12:00:00.000Z'}]))};
}

export const emptyPortfolio = (): PortfolioData => ({transactions:[],quotes:{}});
