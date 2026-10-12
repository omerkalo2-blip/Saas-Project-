import type { ReactNode } from 'react';
import { useWorkspace } from '../state/Workspace';

export function DesignPreview({children,onNavigate}: {children:ReactNode;onNavigate:(screen:string)=>void}) {
  const {setNotice} = useWorkspace();
  return <div className="design-preview"><div className="preview-banner"><strong>Original design preview</strong>These sample figures do not belong to your portfolio and are not live market data. Wallet sync and protocol actions are not connected.<button onClick={() => onNavigate('overview')}>Return to my overview</button></div><div onClickCapture={e => {
    const button = (e.target as HTMLElement).closest('button');
    if(button && !button.dataset.navigation) {e.stopPropagation();e.preventDefault();setNotice('This original design action is not connected yet. Your portfolio ledger is available in Portfolio.');}
  }}>{children}</div></div>;
}
