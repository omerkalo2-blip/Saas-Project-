import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { calculatePortfolio, mergeTransactions, normalizePortfolio, normalizeTransaction } from '../domain/portfolio';
import type { PortfolioData, Quote, Transaction } from '../domain/portfolio';
import { demoPortfolio, emptyPortfolio } from '../domain/demo';
import { downloadFile } from '../domain/csv';

type Mode = 'demo' | 'personal';
type Currency = 'USD' | 'ILS';
interface Workspace {
  version: 1;
  mode: Mode;
  currency: Currency;
  usdIls: number;
  portfolios: Record<Mode, PortfolioData>;
}
const KEY = 'blocktax.workspace.v1';
const fresh = (): Workspace => ({version:1,mode:'demo',currency:'ILS',usdIls:3.65,
  portfolios:{demo:demoPortfolio(),personal:emptyPortfolio()}});

function validateWorkspace(input: unknown): Workspace {
  const s = input as Partial<Workspace>;
  if (!s || s.version !== 1 || !['demo','personal'].includes(s.mode!) || !['USD','ILS'].includes(s.currency!) ||
    typeof s.usdIls !== 'number' || !Number.isFinite(s.usdIls) || s.usdIls <= 0 || s.usdIls > 100 || !s.portfolios) {
    throw new Error('This file is not a valid BlockTax workspace backup.');
  }
  return {version:1,mode:s.mode!,currency:s.currency!,usdIls:s.usdIls,
    portfolios:{demo:normalizePortfolio(s.portfolios.demo),personal:normalizePortfolio(s.portfolios.personal)}};
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return {workspace:raw ? validateWorkspace(JSON.parse(raw)) : fresh(), error:''};
  } catch { return {workspace:fresh(),error:'Saved data could not be read. Automatic saving is paused; export the saved file before restoring a backup.'}; }
}

function useWorkspaceState() {
  const [initial] = useState(load);
  const [workspace,setWorkspace] = useState(initial.workspace);
  const [storageError,setStorageError] = useState(initial.error);
  const [savingEnabled,setSavingEnabled] = useState(!initial.error);
  const [notice,setNotice] = useState('');
  const data = workspace.portfolios[workspace.mode];
  const snapshot = useMemo(() => calculatePortfolio(data),[data]);
  useEffect(() => {
    if (!savingEnabled) return;
    try { localStorage.setItem(KEY,JSON.stringify(workspace)); setStorageError(''); }
    catch { setStorageError('Browser storage is unavailable or full. Changes are in memory; download a backup to keep them.'); }
  },[workspace,savingEnabled]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''),7000);
    return () => clearTimeout(timer);
  },[notice]);
  const changeData = (updater: (previous: PortfolioData) => PortfolioData) => {
    const mode = workspace.mode;
    setWorkspace(s => ({...s,portfolios:{...s.portfolios,[mode]:updater(s.portfolios[mode])}}));
  };
  const money = (usd: number | null, signed = false) => {
    if (usd === null) return '—';
    const amount = usd * (workspace.currency === 'ILS' ? workspace.usdIls : 1);
    return new Intl.NumberFormat('en-US',{style:'currency',currency:workspace.currency,
      maximumFractionDigits:2,signDisplay:signed ? 'exceptZero' : 'auto'}).format(amount);
  };
  return {workspace,data,snapshot,money,storageError,notice,setNotice,
    setMode:(mode: Mode) => setWorkspace(s => ({...s,mode})),
    setCurrency:(currency: Currency) => setWorkspace(s => ({...s,currency})),
    setFx:(usdIls: number) => {
      if (!Number.isFinite(usdIls) || usdIls <= 0 || usdIls > 100) throw new Error('Enter a USD/ILS display rate between 0 and 100.');
      setWorkspace(s => ({...s,usdIls}));
    },
    addTransaction:(raw: unknown) => {
      const transaction = normalizeTransaction(raw);
      changeData(p => ({...p,transactions:[...p.transactions,transaction]}));
      setNotice('Transaction added. Portfolio calculations updated.');
    },
    replaceTransaction:(raw: unknown) => {
      const transaction = normalizeTransaction(raw);
      changeData(p => ({...p,transactions:p.transactions.map(t => t.id === transaction.id ? transaction : t)}));
      setNotice('Transaction updated.');
    },
    removeTransaction:(id: string) => {
      const transaction = data.transactions.find(t => t.id === id);
      if (!transaction) return;
      changeData(p => ({...p,transactions:p.transactions.filter(t => t.id !== id)}));
      setNotice('Transaction removed.');
      return transaction;
    },
    importTransactions:(transactions: Transaction[]) => {
      const result = mergeTransactions(data.transactions,transactions);
      changeData(p => ({...p,transactions:result.transactions}));
      setNotice(`${result.added} transactions imported; ${result.skipped} repeated rows skipped.`);
      return result;
    },
    setQuote:(asset: string,priceUsd: number) => {
      if (!/^[A-Z0-9][A-Z0-9._-]{0,14}$/.test(asset) || !Number.isFinite(priceUsd) || priceUsd < 0) throw new Error('Enter a valid non-negative USD price.');
      const quote: Quote = {asset,priceUsd,updatedAt:new Date().toISOString()};
      changeData(p => ({...p,quotes:{...p.quotes,[asset]:quote}}));
      setNotice(`${asset} valuation updated from your manual price.`);
    },
    backup:() => downloadFile('blocktax-workspace-backup.json',JSON.stringify(workspace,null,2),'application/json'),
    backupSaved:() => {
      try { const raw = localStorage.getItem(KEY); if(raw) downloadFile('blocktax-saved-recovery.json',raw,'application/json'); }
      catch { setNotice('The browser could not read saved storage.'); }
    },
    restore:(raw: string) => {
      const restored = validateWorkspace(JSON.parse(raw));
      setWorkspace(restored); setSavingEnabled(true); setStorageError('');
      setNotice('Backup restored.');
    }
  };
}

type WorkspaceContext = ReturnType<typeof useWorkspaceState>;
const Context = createContext<WorkspaceContext | null>(null);
export function WorkspaceProvider({children}: {children: ReactNode}) {
  const state = useWorkspaceState();
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useWorkspace() {
  const value = useContext(Context);
  if (!value) throw new Error('Workspace provider is missing.');
  return value;
}

export const quantity = (value: number) => new Intl.NumberFormat('en-US',{maximumFractionDigits:10}).format(value);
export const dateLabel = (value: string) => new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value));
