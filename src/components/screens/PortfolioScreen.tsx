import { useRef, useState } from 'react';
import { AlertTriangle, Download, FileUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { TransactionDialog } from '../TransactionDialog';
import { useWorkspace,quantity,dateLabel } from '../../state/Workspace';
import { downloadFile, ledgerCsv, LEDGER_HEADERS, parseLedgerCsv, toCsv } from '../../domain/csv';
import type { Transaction } from '../../domain/portfolio';

export function PortfolioScreen() {
  const {data,snapshot,workspace,importTransactions,removeTransaction} = useWorkspace();
  const fileInput = useRef<HTMLInputElement>(null);
  const [adding,setAdding] = useState(false), [editing,setEditing] = useState<Transaction|undefined>();
  const [removing,setRemoving] = useState<Transaction|null>(null);
  const [search,setSearch] = useState(''), [type,setType] = useState('all');
  const [error,setError] = useState(''), [importing,setImporting] = useState(false);
  const rows = [...data.transactions].filter(t => (type === 'all' || t.type === type) && `${t.asset} ${t.account} ${t.type} ${t.note}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => Date.parse(b.date)-Date.parse(a.date));
  async function importFile(file:File) {
    setError('');setImporting(true);
    try {
      if(file.size > 5*1024*1024)throw new Error('Use a CSV smaller than 5 MB.');
      const transactions = parseLedgerCsv(await file.text());
      if (!transactions.length)throw new Error('The CSV has a header but no transactions.');
      importTransactions(transactions);
    } catch(error){setError((error as Error).message);}
    finally {setImporting(false);if(fileInput.current)fileInput.current.value='';}
  }
  return <div className="workspace-screen">
    <div className="screen-heading"><div><div className="eyebrow">The source of truth</div><h1>Portfolio Ledger</h1><p>Record, review and export the transactions behind every balance.</p></div><div className="screen-actions"><Button variant="outline" disabled={importing} onClick={() => fileInput.current?.click()}><FileUp size={16}/>{importing ? 'Importing…' : 'Import CSV'}</Button><Button onClick={() => {setEditing(undefined);setAdding(true);}}><Plus size={16}/>Add transaction</Button></div></div>
    <input className="hidden-input" aria-label="Import transaction CSV" ref={fileInput} type="file" accept=".csv,text/csv" onChange={e => {if(e.target.files?.[0])void importFile(e.target.files[0]);}}/>
    {error && <div role="alert" className="issue-banner"><AlertTriangle size={18}/><p>{error}</p></div>}
    {!!snapshot.issues.length && <Card className="panel"><h2 className="panel-title">Reconciliation queue</h2><p className="panel-subtitle">Complete the source records before relying on P/L or an accounting export.</p><div className="issue-list">{snapshot.issues.map(issue => <div className="issue-row" key={issue.key}><div><strong>{issue.asset}</strong><p>{issue.message}</p></div>{issue.transactionId && <Button size="sm" variant="outline" onClick={() => {setEditing(data.transactions.find(t => t.id === issue.transactionId));setAdding(true);}}>Edit record</Button>}</div>)}</div></Card>}
    <Card className="panel"><div className="ledger-toolbar"><div className="ledger-filters"><input className="field-input" aria-label="Search transactions" placeholder="Search asset, account or note…" value={search} onChange={e => setSearch(e.target.value)}/><select className="field-input" style={{maxWidth:135}} aria-label="Transaction type filter" value={type} onChange={e => setType(e.target.value)}><option value="all">All types</option><option value="buy">Buy</option><option value="sell">Sell</option><option value="reward">Reward</option><option value="opening">Opening</option></select></div><Button variant="outline" size="sm" disabled={!data.transactions.length} onClick={() => downloadFile('blocktax-transactions-usd.csv',ledgerCsv(data.transactions))}><Download size={15}/>Export CSV</Button></div>
      <div className="table-scroll"><table className="portfolio-table"><thead><tr><th>Date · UTC</th><th>Asset</th><th>Type</th><th className="numeric">Quantity</th><th className="numeric">Unit price · USD</th><th className="numeric">Fee · USD</th><th>Account</th><th>Actions</th></tr></thead><tbody>{rows.map(t => <tr key={t.id}><td>{dateLabel(t.date)}<div className="secondary-text">{t.date.slice(11,16)}</div></td><td><strong>{t.asset}</strong></td><td><span className="badge-manual transaction-type">{t.type}</span></td><td className="numeric">{quantity(t.quantity)}</td><td className="numeric">{t.priceUsd === null ? 'Unknown' : '$'+quantity(t.priceUsd)}</td><td className="numeric">${quantity(t.feeUsd)}</td><td>{t.account}{t.note && <div className="secondary-text" title={t.note}>{t.note.length>35 ? t.note.slice(0,35)+'…' : t.note}</div>}</td><td><button className="icon-action" aria-label={'Edit '+t.asset+' transaction'} onClick={() => {setEditing(t);setAdding(true);}}><Pencil size={15}/></button><button className="icon-action" aria-label={'Delete '+t.asset+' transaction'} onClick={() => setRemoving(t)}><Trash2 size={15}/></button></td></tr>)}</tbody></table></div>
      {!rows.length && <div className="empty-state"><Search size={28}/><h3>{data.transactions.length ? 'No matching transactions' : 'Your ledger is empty'}</h3><p>{data.transactions.length ? 'Try another asset, account or event type.' : 'Add a purchase, opening holding or reward. You can also import the standard CSV format below.'}</p>{!data.transactions.length && <Button onClick={() => {setEditing(undefined);setAdding(true);}}>Add first transaction</Button>}</div>}
      <p className="source-note">{rows.length} of {data.transactions.length} records · {workspace.mode === 'demo' ? 'Demonstration ledger' : 'Your browser-local ledger'} · Acquisition and sale values are stored in USD, independently of display currency.</p>
    </Card>
    <Card className="panel"><div className="panel-heading"><div><h2 className="panel-title">Import format</h2><p className="panel-subtitle" style={{marginBottom:0}}>Use the template for buys, sales, received rewards and opening holdings.</p></div><Button variant="outline" size="sm" onClick={() => downloadFile('blocktax-transactions-template.csv',toCsv([LEDGER_HEADERS]))}>Download template</Button></div><p className="explanation">Columns: id, date, asset, type, quantity, price_usd, fee_usd, account, note. Use an ISO date and buy / sell / reward / opening. An opening price may be blank when acquisition cost is unknown. Re-imported IDs are skipped; conflicting records stop the import. Fiat cash and internal transfers are outside this first ledger version.</p></Card>
    <TransactionDialog open={adding} transaction={editing} onClose={() => {setAdding(false);setEditing(undefined);}}/>
    <Dialog open={!!removing} onOpenChange={open => {if(!open)setRemoving(null);}}><DialogContent className="modal-box"><DialogTitle>Remove this transaction?</DialogTitle><DialogDescription>This removes the {removing?.asset} record from this portfolio and recalculates balances and P/L.</DialogDescription><div className="dialog-actions"><Button variant="outline" onClick={() => setRemoving(null)}>Keep record</Button><Button variant="destructive" onClick={() => {if(removing)removeTransaction(removing.id);setRemoving(null);}}>Remove record</Button></div></DialogContent></Dialog>
  </div>;
}
