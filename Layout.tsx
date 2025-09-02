import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Home, 
  PieChart, 
  TrendingUp, 
  Wallet, 
  Coins, 
  FileText, 
  Crown,
  User,
  Settings,
  LogOut
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const navigation = [
  { id: 'welcome', label: 'Welcome', icon: Home },
  { id: 'overview', label: 'Overview', icon: PieChart },
  { id: 'market', label: 'Market', icon: TrendingUp },
  { id: 'onchain', label: 'On-Chain', icon: Wallet },
  { id: 'staking', label: 'Staking', icon: Coins },
  { id: 'tax', label: 'Tax Report', icon: FileText },
];

export function Layout({ children, currentScreen, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-medium text-sidebar-foreground">LevChain</h1>
              <p className="text-sm text-sidebar-foreground/70">Private Banking</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto p-6 border-t border-sidebar-border">
          <Card className="p-4 bg-sidebar-accent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground">David Sterling</p>
                <p className="text-sm text-sidebar-foreground/70">Premium Client</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="flex-1 text-sidebar-foreground hover:bg-sidebar-accent">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}