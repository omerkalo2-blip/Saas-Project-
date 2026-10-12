import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Copy, ExternalLink, Wallet, Activity, Shield, Zap, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface OnChainScreenProps {
  onNavigate: (screen: string) => void;
}

const wallets = [
  {
    chain: 'Ethereum',
    address: '0x742d...a4b8',
    balance: '₪82,800',
    nativeBalance: '8.95 ETH',
    txCount: 247,
    lastActive: '2 hours ago',
    status: 'active',
    gasSpent: '₪1,240'
  },
  {
    chain: 'Bitcoin',
    address: 'bc1q...7x9m',
    balance: '₪55,200',
    nativeBalance: '0.238 BTC',
    txCount: 89,
    lastActive: '1 day ago',
    status: 'moderate',
    gasSpent: '₪89'
  },
  {
    chain: 'Solana',
    address: '9WzD...K4mL',
    balance: '₪27,600',
    nativeBalance: '194 SOL',
    txCount: 156,
    lastActive: '3 hours ago',
    status: 'active',
    gasSpent: '₪45'
  },
];

const gasData = [
  { date: '26 Aug', eth: 25, sol: 0.003, btc: 45 },
  { date: '27 Aug', eth: 32, sol: 0.004, btc: 52 },
  { date: '28 Aug', eth: 28, sol: 0.003, btc: 48 },
  { date: '29 Aug', eth: 35, sol: 0.005, btc: 55 },
  { date: '30 Aug', eth: 42, sol: 0.004, btc: 61 },
  { date: '31 Aug', eth: 38, sol: 0.003, btc: 58 },
  { date: '1 Sep', eth: 29, sol: 0.003, btc: 49 },
  { date: '2 Sep', eth: 31, sol: 0.004, btc: 51 },
];

const recentTransactions = [
  {
    hash: '0xa1b2...c3d4',
    chain: 'ETH',
    type: 'Stake',
    amount: '12.5 ETH',
    value: '₪47,500',
    gas: '₪12.50',
    status: 'success',
    time: '2 hours ago',
    block: 18245789
  },
  {
    hash: '0xe5f6...g7h8',
    chain: 'SOL',
    type: 'Swap',
    amount: '50 SOL → 3,200 USDC',
    value: '₪3,200',
    gas: '₪0.05',
    status: 'success',
    time: '3 hours ago',
    block: 254891247
  },
  {
    hash: '0x9i8j...k7l6',
    chain: 'ETH',
    type: 'Transfer',
    amount: '2.1 ETH',
    value: '₪7,980',
    gas: '₪8.90',
    status: 'success',
    time: '1 day ago',
    block: 18244156
  },
  {
    hash: 'bc1q...m5n4',
    chain: 'BTC',
    type: 'Receive',
    amount: '0.05 BTC',
    value: '₪11,605',
    gas: '₪4.20',
    status: 'confirmed',
    time: '1 day ago',
    block: 808456
  },
];

const protocolInteractions = [
  { protocol: 'Lido', interactions: 45, tvl: '₪47,500', yield: '3.7%' },
  { protocol: 'Uniswap V3', interactions: 23, tvl: '₪12,400', yield: '0.3%' },
  { protocol: 'Marinade', interactions: 18, tvl: '₪15,600', yield: '8.0%' },
  { protocol: 'Jupiter', interactions: 12, tvl: '₪0', yield: '0%' },
];

export function OnChainScreen({ onNavigate }: OnChainScreenProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">On-Chain Analysis</h1>
          <p className="text-muted-foreground">Wallet activities, transactions, and blockchain metrics with LevChain intelligence</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button data-navigation="true" onClick={() => onNavigate('staking')}>
            <Zap className="w-4 h-4 mr-2" />
            Staking Options
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4">
        <h2 className="text-xl mb-4">Connected Wallets</h2>
        {wallets.map((wallet, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  wallet.chain === 'Ethereum' ? 'bg-blue-100 text-blue-600' :
                  wallet.chain === 'Bitcoin' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg">{wallet.chain}</h3>
                    <Badge 
                      variant={wallet.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {wallet.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{wallet.address}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(wallet.address)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl">{wallet.balance}</div>
                <div className="text-sm text-muted-foreground">{wallet.nativeBalance}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg">{wallet.txCount}</div>
                <div className="text-xs text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg">{wallet.gasSpent}</div>
                <div className="text-xs text-muted-foreground">Gas Spent</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs text-muted-foreground">{wallet.lastActive}</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xs text-muted-foreground">Secure</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Gas Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg mb-6">Gas Price Trends (Gwei)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gasData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'sol' ? ' SOL' : name === 'btc' ? ' sat/vB' : ' Gwei'}`, 
                  name.toUpperCase()
                ]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="eth" stroke="var(--chart-1)" strokeWidth={2} />
              <Line type="monotone" dataKey="sol" stroke="var(--chart-2)" strokeWidth={2} />
              <Line type="monotone" dataKey="btc" stroke="var(--chart-3)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg mb-6">Protocol Interactions</h3>
          <div className="space-y-4">
            {protocolInteractions.map((protocol, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{protocol.protocol}</div>
                    <div className="text-sm text-muted-foreground">
                      {protocol.interactions} interactions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div>{protocol.tvl}</div>
                  <div className="text-sm text-green-600">
                    {protocol.yield !== '0%' && `+${protocol.yield}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Recent Transactions</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-card/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.chain === 'ETH' ? 'bg-blue-100 text-blue-600' :
                  tx.chain === 'BTC' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {tx.type === 'Stake' ? <Shield className="w-5 h-5" /> :
                   tx.type === 'Swap' ? <Activity className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{tx.type}</span>
                    <Badge variant="outline" className="text-xs">{tx.chain}</Badge>
                    <Badge 
                      variant={tx.status === 'success' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.amount}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{tx.hash}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0"
                      onClick={() => copyToClipboard(tx.hash)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div>{tx.value}</div>
                <div className="text-sm text-muted-foreground">Gas: {tx.gas}</div>
                <div className="text-xs text-muted-foreground">{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}