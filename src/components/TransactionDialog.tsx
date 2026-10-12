import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import type { Transaction } from '../domain/portfolio';
import { useWorkspace } from '../state/Workspace';

function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
}
const initialForm = (transaction?: Transaction) => ({
  date:localDate(transaction?.date ?? new Date().toISOString()),asset:transaction?.asset ?? '',
  type:transaction?.type ?? 'buy',quantity:transaction ? String(transaction.quantity) : '',
  price:transaction?.priceUsd === null || !transaction ? '' : String(transaction.priceUsd),
  fee:String(transaction?.feeUsd ?? 0),account:transaction?.account ?? 'Manual account',note:transaction?.note ?? ''
});

export function TransactionDialog({open,onClose,transaction}: {open:boolean;onClose:()=>void;transaction?:Transaction}) {
  const {addTransaction,replaceTransaction,workspace} = useWorkspace();
  const [form,setForm] = useState(initialForm(transaction));
  const [error,setError] = useState('');
  useEffect(() => { if (open) {setForm(initialForm(transaction));setError('');} },[open,transaction]);
  const field = (key:keyof typeof form,value:string) => setForm(s => ({...s,[key]:value}));
  function submit(event:FormEvent) {
    event.preventDefault();
    try {
      if (!form.asset.trim() || !form.quantity.trim() || !form.date) throw new Error('Complete the date, asset and quantity.');
      if (!form.price.trim() && form.type !== 'opening') throw new Error('Enter the recorded acquisition or sale price in USD.');
      const next = {id:transaction?.id ?? crypto.randomUUID(),date:new Date(form.date).toISOString(),asset:form.asset,
        type:form.type,quantity:Number(form.quantity),priceUsd:form.price.trim() ? Number(form.price) : null,
        feeUsd:Number(form.fee || 0),account:form.account,note:form.note};
      if(transaction) replaceTransaction(next); else addTransaction(next);
      onClose();
    } catch(error) {setError((error as Error).message);}
  }
  return <Dialog open={open} onOpenChange={value => {if(!value)onClose();}}>
    <DialogContent className="modal-box">
      <DialogTitle>{transaction ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
      <DialogDescription>Record an event in your {workspace.mode === 'demo' ? 'demo' : 'personal'} ledger. Acquisition prices and fees are in USD.</DialogDescription>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field-label">Transaction date & time<input className="field-input" type="datetime-local" required value={form.date} onChange={e => field('date',e.target.value)}/></label>
          <label className="field-label">Event type<select className="field-input" value={form.type} onChange={e => field('type',e.target.value)}><option value="buy">Buy</option><option value="sell">Sell</option><option value="reward">Reward received</option><option value="opening">Opening holding</option></select></label>
          <label className="field-label">Asset symbol<input className="field-input" placeholder="BTC, ETH, SOL…" required maxLength={15} value={form.asset} onChange={e => field('asset',e.target.value.toUpperCase())}/></label>
          <label className="field-label">Quantity<input className="field-input" type="number" min="0" step="any" required placeholder="0.25" value={form.quantity} onChange={e => field('quantity',e.target.value)}/></label>
          <label className="field-label">{form.type === 'opening' ? 'Acquisition price per token · USD' : form.type === 'reward' ? 'Value per token when received · USD' : form.type === 'sell' ? 'Sale price per token · USD' : 'Purchase price per token · USD'}<input className="field-input" type="number" min="0" step="any" required={form.type !== 'opening'} placeholder={form.type === 'opening' ? 'Leave blank if unknown' : 'Recorded USD price'} value={form.price} onChange={e => field('price',e.target.value)}/>{form.type === 'opening' && <small>An unknown acquisition cost leaves P/L incomplete.</small>}</label>
          <label className="field-label">Fee paid · USD<input className="field-input" type="number" min="0" step="any" value={form.fee} onChange={e => field('fee',e.target.value)}/></label>
          <label className="field-label wide">Account label<input className="field-input" maxLength={120} value={form.account} onChange={e => field('account',e.target.value)}/></label>
          <label className="field-label wide">Note · optional<input className="field-input" maxLength={1000} value={form.note} onChange={e => field('note',e.target.value)}/></label>
        </div>
        <p className="explanation" style={{marginTop:14}}>Use an opening holding only for assets not already represented by purchases. Internal transfers between your own wallets do not create another holding.</p>
        {error && <p role="alert" className="form-error">{error}</p>}
        <div className="dialog-actions"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{transaction ? 'Save changes' : 'Add transaction'}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
