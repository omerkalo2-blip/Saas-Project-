import { useState } from 'react';
import type { ReactNode } from 'react';
import { Home, PieChart, TrendingUp, Wallet, Coins, FileText, Crown, User, Settings, Download, Menu, X, List } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { WorkspaceBar } from './WorkspaceBar';
import { useWorkspace } from '../state/Workspace';

const navigation = [
  {id:'welcome',label:'Welcome',icon:Home},
  {id:'overview',label:'Overview',icon:PieChart},
  {id:'portfolio',label:'Portfolio Ledger',icon:List},
  {id:'tax',label:'Tax & Accounting',icon:FileText},
  {id:'market',label:'Market',icon:TrendingUp,preview:true},
  {id:'onchain',label:'On-Chain',icon:Wallet,preview:true},
  {id:'staking',label:'Staking',icon:Coins,preview:true},
];

export function WorkspaceLayout({children,currentScreen,onNavigate}: {children:ReactNode;currentScreen:string;onNavigate:(screen:string)=>void}) {
  const {workspace,backup} = useWorkspace();
  const [menu,setMenu] = useState(false);
  const navigate = (screen:string) => {onNavigate(screen);setMenu(false);};
  return <div className="min-h-screen bg-background flex">
    {menu && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMenu(false)}/>}
    <aside className={'app-sidebar '+(menu ? 'open' : '')}>
      <button className="icon-action sidebar-close" aria-label="Close menu" onClick={() => setMenu(false)}><X size={20}/></button>
      <div className="p-6"><div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center"><Crown className="w-6 h-6 text-accent-foreground"/></div><div><h1 className="font-medium text-sidebar-foreground">LevChain</h1><p className="text-sm text-sidebar-foreground/70">Private Banking</p></div></div>
        <nav className="space-y-2" aria-label="Main navigation">{navigation.map(({id,label,icon:Icon,preview}) => <Button key={id} variant={currentScreen === id ? 'secondary' : 'ghost'} aria-current={currentScreen === id ? 'page' : undefined} className={'w-full justify-start gap-3 h-11 '+(currentScreen === id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50')} onClick={() => navigate(id)}><Icon className="w-5 h-5"/><span style={{flex:1,textAlign:'left'}}>{label}</span>{preview && <span style={{fontSize:9,opacity:.6}}>PREVIEW</span>}</Button>)}</nav>
      </div>
      <div className="app-sidebar-profile p-6 border-t border-sidebar-border"><Card className="p-4 bg-sidebar-accent"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center"><User className="w-5 h-5 text-accent-foreground"/></div><div><p className="font-medium text-sidebar-foreground">{workspace.mode === 'demo' ? 'Demo workspace' : 'Personal workspace'}</p><p className="text-sm text-sidebar-foreground/70">Browser-local ledger</p></div></div><div className="flex gap-2 mt-3"><Button size="sm" variant="ghost" aria-label="Workspace settings" className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent" onClick={() => navigate('settings')}><Settings className="w-4 h-4"/>Settings</Button><Button size="sm" variant="ghost" aria-label="Download workspace backup" className="text-sidebar-foreground hover:bg-sidebar-accent" onClick={backup}><Download className="w-4 h-4"/></Button></div></Card></div>
    </aside>
    <main className="app-main"><div className="mobile-header"><span>LevChain · Private Banking</span><button aria-label="Open navigation" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={22}/></button></div><WorkspaceBar/>{children}</main>
  </div>;
}
