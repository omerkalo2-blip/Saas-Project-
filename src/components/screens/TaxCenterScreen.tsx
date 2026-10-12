import { useState } from 'react';
import { AlertTriangle, Download, FileText, Printer } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useWorkspace,quantity,dateLabel } from '../../state/Workspace';
import { accountingYear } from '../../domain/portfolio';
import { downloadFile,toCsv } from '../../domain/csv';

const usd = (value:number|null) => value === null ? 'Unknown' : new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
export function TaxCenterScreen({onNavigate}: {onNavigate:(screen:string)=>void}) {
  const {data,snapshot,workspace} = useWorkspace();
  const currentYear = new Date().getUTCFullYear();
  const years = [...new Set([currentYear,...data.transactions.map(t => new Date(t.date).getUTCFullYear())])].sort((a,b) => b-a);
  const [year,setYear] = useState(currentYear);
  const report = accountingYear(snapshot,data,year);
  function exportReport() {
    downloadFile(`blocktax-accounting-draft-${year}-usd.csv`,toCsv([
      ['report','accounting draft — USD / UTC / global FIFO'],
      ['portfolio',workspace.mode === 'demo' ? 'demonstration records' : 'personal records'],
      ['date_utc','asset','quantity','net_proceeds_usd','cost_basis_usd','sale_fee_usd','realized_pnl_usd','status','account'],
      ...report.disposals.map(d => [d.date,d.asset,d.quantity,d.proceeds,d.costBasis,d.fee,d.pnl,d.pnl === null ? 'needs reconciliation' : 'calculated',d.account]),
      [],['summary','value_usd'],['realized_pnl',report.realizedPnl],['recorded_reward_income',report.rewardIncome],['all_recorded_fees',report.fees],
      ['scope','Accounting summary only. No jurisdiction tax rules or historical FX applied.'],
      ['fee_method','Purchase fees are in acquisition cost; sale fees are deducted from proceeds. Fee totals are informational, not an additional deduction.']
    ]));
  }
  return <div className="workspace-screen print-report">
    <div className="screen-heading"><div><div className="eyebrow">From records to readiness</div><h1>Tax & Accounting Center</h1><p>Review realized disposals, received rewards and missing source records.</p></div><div className="screen-actions"><select className="field-input" aria-label="Accounting year" value={year} onChange={e => setYear(Number(e.target.value))}>{years.map(y => <option key={y} value={y}>{y}</option>)}</select><Button variant="outline" onClick={exportReport}><Download size={16}/>Export draft CSV</Button><Button variant="outline" onClick={() => window.print()}><Printer size={16}/>Print / save PDF</Button></div></div>
    <div className="print-only print-heading"><h2>LevChain · {year} Accounting Draft</h2><p>{workspace.mode === 'demo' ? 'Demonstration portfolio' : 'Personal portfolio'} · USD ledger · UTC dates · Global FIFO</p></div>
    <div className="issue-banner"><FileText size={20}/><div><strong>Accounting draft · USD · UTC · FIFO</strong><p>This summary is built from the recorded transactions. It is not a filed tax return. Jurisdiction-specific tax rules, historical FX, derivatives and complex DeFi events are not applied.</p></div></div>
    <div className="kpi-grid">{[
      ['Realized P/L',report.realizedPnl,'Disposals in the selected year'],
      ['Received rewards',report.rewardIncome,'Recorded value when received'],
      ['Recorded fees',report.fees,'Already reflected in purchase / sale P/L'],
      ['Realized disposals',report.disposals.length,'Sale events in the selected year'],
    ].map(([label,value,note],i) => <Card key={String(label)} className="kpi-card"><div className="kpi-label">{label}</div><div className="kpi-value">{i === 3 ? value : usd(value as number|null)}</div><div className="kpi-note">{note}</div></Card>)}</div>
    {!!snapshot.issues.length && <Card className="panel no-print"><div className="panel-heading"><h2 className="panel-title">Source records to review</h2><Button size="sm" variant="outline" onClick={() => onNavigate('portfolio')}>Open reconciliation queue</Button></div><p className="explanation">{snapshot.issues.length} ledger items need attention. A missing acquisition can affect later-year FIFO results. Missing current prices affect portfolio valuation rather than already-priced disposals.</p></Card>}
    <Card className="panel"><div className="panel-heading"><h2 className="panel-title">Realized disposals · {year}</h2><span className="badge-manual">USD amounts</span></div><div className="table-scroll"><table className="portfolio-table"><thead><tr><th>Date · UTC</th><th>Asset</th><th className="numeric">Quantity</th><th className="numeric">Net proceeds</th><th className="numeric">Acquisition cost</th><th className="numeric">Realized P/L</th><th>Status</th></tr></thead><tbody>{report.disposals.map(d => <tr key={d.transactionId}><td>{dateLabel(d.date)}</td><td>{d.asset}</td><td className="numeric">{quantity(d.quantity)}</td><td className="numeric">{usd(d.proceeds)}</td><td className="numeric">{usd(d.costBasis)}</td><td className={'numeric '+(d.pnl !== null && d.pnl < 0 ? 'negative' : 'positive')}>{usd(d.pnl)}</td><td>{d.pnl === null ? 'Review required' : 'Calculated'}</td></tr>)}</tbody></table></div>{!report.disposals.length && <div className="empty-state"><FileText size={28}/><h3>No disposals recorded for {year}</h3><p>Unrealized changes in your current holdings are kept separate from this disposal summary.</p><Button className="no-print" variant="outline" onClick={() => onNavigate('portfolio')}>Review transactions</Button></div>}<p className="source-note">FIFO uses acquisition lots from the full ledger, including earlier years. Purchase fees are included in acquisition cost; sale fees are removed from proceeds. The fee total above is informational and must not be subtracted again. Rewards are recorded separately.</p></Card>
  </div>;
}
