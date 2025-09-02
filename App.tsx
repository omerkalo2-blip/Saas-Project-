import { useState } from 'react';
import { Layout } from './components/Layout';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { MarketScreen } from './components/screens/MarketScreen';
import { OnChainScreen } from './components/screens/OnChainScreen';
import { StakingScreen } from './components/screens/StakingScreen';
import { TaxReportScreen } from './components/screens/TaxReportScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case 'overview':
        return <OverviewScreen onNavigate={handleNavigate} />;
      case 'market':
        return <MarketScreen onNavigate={handleNavigate} />;
      case 'onchain':
        return <OnChainScreen onNavigate={handleNavigate} />;
      case 'staking':
        return <StakingScreen onNavigate={handleNavigate} />;
      case 'tax':
        return <TaxReportScreen onNavigate={handleNavigate} />;
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
      {renderScreen()}
    </Layout>
  );
}