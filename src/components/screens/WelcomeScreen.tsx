import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Crown, TrendingUp, Shield, Zap } from "lucide-react";
import { useWorkspace } from '../../state/Workspace';

interface WelcomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const {snapshot,money,setMode,workspace} = useWorkspace();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 pt-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-5xl mb-4 text-foreground">LevChain</h1>
          <p className="text-xl text-accent mb-4">Private Banking with a Heart, Powered by Blockchain</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your digital assets, organized in one clear statement.
            Explore the original private banking design with a working portfolio ledger and transparent calculations.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl mb-3">Portfolio Management</h3>
            <p className="text-muted-foreground leading-relaxed">
              See balances, allocation, acquisition cost and realized versus unrealized P/L from the transactions you record.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl mb-3">Accounting Readiness</h3>
            <p className="text-muted-foreground leading-relaxed">
              Review FIFO disposal calculations, recorded rewards and missing acquisition records. Export an accounting draft for review.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl mb-3">Your Data, Your Control</h3>
            <p className="text-muted-foreground leading-relaxed">
              Keep demonstration data separate from your own portfolio. Import CSV records and download a backup whenever you need one.
            </p>
          </Card>
        </div>

        {/* Stats */}
        <Card className="p-8 mb-12 bg-primary text-primary-foreground">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-2">{money(snapshot.totalValue)}</div>
              <div className="text-primary-foreground/80">Total Portfolio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-green-400">{money(snapshot.realizedPnl,true)}</div>
              <div className="text-primary-foreground/80">Realized P/L · FIFO</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{money(snapshot.fees)}</div>
              <div className="text-primary-foreground/80">Recorded Fees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">{snapshot.holdings.length}</div>
              <div className="text-primary-foreground/80">Assets Tracked</div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <div className="cta-pair"><Button 
            size="lg" 
            className="px-12 py-6 text-lg"
            onClick={() => {setMode('demo');onNavigate('overview');}}
          >
            Explore Demo Portfolio
          </Button><Button size="lg" variant="outline" className="px-12 py-6 text-lg" onClick={() => {setMode('personal');onNavigate('overview');}}>Open My Portfolio</Button></div>
          <p className="local-trust">{workspace.mode === 'demo' ? 'The figures above are demonstration records with example prices.' : 'The figures above are calculated from your recorded portfolio.'}<br/>Manual valuations · Browser-local data · No wallet permissions requested</p>
        </div>
      </div>
    </div>
  );
}
