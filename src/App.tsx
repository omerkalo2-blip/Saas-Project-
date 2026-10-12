import { lazy, Suspense, useEffect, useState } from 'react';
import { WorkspaceLayout as Layout } from './components/WorkspaceLayout';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { DesignPreview } from './components/DesignPreview';
const OverviewScreen = lazy(() => import('./components/screens/OverviewScreen').then(m => ({default:m.OverviewScreen})));
const PortfolioScreen = lazy(() => import('./components/screens/PortfolioScreen').then(m => ({default:m.PortfolioScreen})));
const TaxCenterScreen = lazy(() => import('./components/screens/TaxCenterScreen').then(m => ({default:m.TaxCenterScreen})));
const SettingsScreen = lazy(() => import('./components/screens/SettingsScreen').then(m => ({default:m.SettingsScreen})));
const MarketScreen = lazy(() => import('./components/screens/MarketScreen').then(m => ({default:m.MarketScreen})));
const OnChainScreen = lazy(() => import('./components/screens/OnChainScreen').then(m => ({default:m.OnChainScreen})));
const StakingScreen = lazy(() => import('./components/screens/StakingScreen').then(m => ({default:m.StakingScreen})));
const screens = ['welcome','overview','portfolio','market','onchain','staking','tax','settings'];

export default function App() {
  const initial = window.location.hash.slice(1);
  const [currentScreen, setCurrentScreen] = useState(screens.includes(initial) ? initial : 'welcome');
  useEffect(() => {
    const changed = () => {const next=window.location.hash.slice(1);setCurrentScreen(screens.includes(next) ? next : 'welcome');};
    window.addEventListener('hashchange',changed);
    return () => window.removeEventListener('hashchange',changed);
  },[]);

  const handleNavigate = (screen: string) => {
    if(!screens.includes(screen))return;
    setCurrentScreen(screen);
    window.location.hash=screen;
    window.scrollTo({top:0});
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case 'overview':
        return <OverviewScreen onNavigate={handleNavigate} />;
      case 'portfolio':
        return <PortfolioScreen />;
      case 'market':
        return <DesignPreview onNavigate={handleNavigate}><MarketScreen onNavigate={handleNavigate} /></DesignPreview>;
      case 'onchain':
        return <DesignPreview onNavigate={handleNavigate}><OnChainScreen onNavigate={handleNavigate} /></DesignPreview>;
      case 'staking':
        return <DesignPreview onNavigate={handleNavigate}><StakingScreen onNavigate={handleNavigate} /></DesignPreview>;
      case 'tax':
        return <TaxCenterScreen onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <WelcomeScreen onNavigate={handleNavigate} />;
    }
  };

  // Show welcome screen without sidebar initially
  if (currentScreen === 'welcome') {
    return renderScreen();
  }

  // Show other screens with sidebar layout
  return (
    <Layout currentScreen={currentScreen} onNavigate={handleNavigate}>
      <Suspense fallback={<div className="workspace-screen" role="status">Loading your workspace…</div>}>{renderScreen()}</Suspense>
    </Layout>
  );
}
