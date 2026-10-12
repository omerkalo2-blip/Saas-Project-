import { AlertTriangle, Database, FlaskConical, X } from 'lucide-react';
import { useWorkspace } from '../state/Workspace';
import { Button } from './ui/button';

export function WorkspaceBar() {
  const {workspace,setMode,setCurrency,storageError,notice,setNotice,backupSaved} = useWorkspace();
  return <>
    <div className="workspace-bar">
      <div className="workspace-status">
        {workspace.mode === 'demo' ? <FlaskConical size={16}/> : <Database size={16}/>}
        <strong>{workspace.mode === 'demo' ? 'Demo portfolio' : 'My portfolio'}</strong>
        <span>{workspace.mode === 'demo' ? 'Example transactions and prices' : 'Saved in this browser'}</span>
      </div>
      <div className="workspace-controls">
        <select aria-label="Portfolio workspace" value={workspace.mode} onChange={e => setMode(e.target.value as 'demo'|'personal')}>
          <option value="demo">Demo portfolio</option><option value="personal">My portfolio</option>
        </select>
        <select aria-label="Display currency" value={workspace.currency} onChange={e => setCurrency(e.target.value as 'USD'|'ILS')}>
          <option value="ILS">ILS ₪</option><option value="USD">USD $</option>
        </select>
      </div>
    </div>
    {storageError && <div role="alert" className="workspace-warning"><AlertTriangle size={18}/><span>{storageError}</span><Button size="sm" variant="outline" onClick={backupSaved}>Download saved data</Button></div>}
    {notice && <div role="status" className="workspace-notice"><span>{notice}</span><button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16}/></button></div>}
  </>;
}
