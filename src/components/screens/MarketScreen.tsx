import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Eye, Brain, Zap, Clock, ExternalLink, MessageCircle, Users, BarChart3, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from "recharts";

interface MarketScreenProps {
  onNavigate: (screen: string) => void;
}

const fearGreedData = [
  { date: '25 Aug', value: 32 },
  { date: '26 Aug', value: 28 },
  { date: '27 Aug', value: 31 },
  { date: '28 Aug', value: 35 },
  { date: '29 Aug', value: 42 },
  { date: '30 Aug', value: 38 },
  { date: '31 Aug', value: 45 },
  { date: '1 Sep', value: 52 },
  { date: '2 Sep', value: 58 },
];

const onChainStats = [
  { metric: 'TVL', value: '45.2B', change: '+1.8%', status: 'positive' },
  { metric: 'Active Addresses', value: '892K', change: '+3.2%', status: 'positive' },
  { metric: 'Transaction Volume', value: '12.4B', change: '-0.8%', status: 'negative' },
  { metric: 'Network Fees', value: '28 Gwei', change: '-12%', status: 'positive' },
];

const whaleTransactions = [
  {
    type: 'Buy',
    asset: 'ETH',
    amount: '2,500 ETH',
    value: '₪23.1M',
    wallet: '0x742d...a4b8',
    time: '2 hours ago',
    exchange: 'Binance'
  },
  {
    type: 'Sell',
    asset: 'BTC',
    amount: '150 BTC',
    value: '₪34.8M',
    wallet: '0x8a3f...2c1d',
    time: '4 hours ago',
    exchange: 'Coinbase'
  },
  {
    type: 'Transfer',
    asset: 'USDC',
    amount: '50M USDC',
    value: '₪50M',
    wallet: '0x1b2c...9e8f',
    time: '6 hours ago',
    exchange: 'Unknown'
  },
];

const optionsExpiry = [
  { date: 'Sep 6', btcVolume: '1.2B', ethVolume: '450M', putCall: '0.68' },
  { date: 'Sep 13', btcVolume: '890M', ethVolume: '320M', putCall: '0.74' },
  { date: 'Sep 20', btcVolume: '2.1B', ethVolume: '780M', putCall: '0.62' },
  { date: 'Sep 27', btcVolume: '1.8B', ethVolume: '650M', putCall: '0.71' },
];

const twitterFeed = [
  {
    user: '@CryptoAnalyst',
    handle: 'CryptoAnalyst',
    content: 'BTC showing strong support at $59K. On-chain metrics suggest accumulation phase continuing. 🚀',
    time: '2h',
    likes: 247,
    retweets: 89
  },
  {
    user: '@DeFiWhale',
    handle: 'DeFiWhale',
    content: 'Major ETH inflows to Lido detected. Staking demand remains robust despite market volatility.',
    time: '4h',
    likes: 156,
    retweets: 67
  },
  {
    user: '@BlockchainNews',
    handle: 'BlockchainNews',
    content: 'Fear & Greed Index hits 58 (Greed). Historical data shows this level often precedes 10-15% moves.',
    time: '6h',
    likes: 342,
    retweets: 128
  },
];

export function MarketScreen({ onNavigate }: MarketScreenProps) {
  const currentFearGreed = 58;
  const fearGreedLabel = currentFearGreed >= 75 ? 'Extreme Greed' :
                        currentFearGreed >= 55 ? 'Greed' :
                        currentFearGreed >= 45 ? 'Neutral' :
                        currentFearGreed >= 25 ? 'Fear' : 'Extreme Fear';

  const gaugeData = [{ value: currentFearGreed, fill: '#d4af37' }];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">Market Intelligence</h1>
          <p className="text-muted-foreground">Real-time market sentiment, whale activity, and institutional flows powered by LevChain</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts (3)
          </Button>
          <Button data-navigation="true" onClick={() => onNavigate('onchain')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View On-Chain
          </Button>
        </div>
      </div>

      {/* Top Movers */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg">Top Gainer</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-medium">USDC</div>
              <div className="text-sm text-muted-foreground">USD Coin</div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-green-600">+₪28,000</div>
              <div className="text-sm text-green-600">+28.3%</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <h3 className="text-lg">Top Loser</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-medium">ILV</div>
              <div className="text-sm text-muted-foreground">Illuvium</div>
            </div>
            <div className="text-right">
              <div className="text-2xl text-red-600">-₪12,800</div>
              <div className="text-sm text-red-600">-23.1%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Row - Fear & Greed + On-Chain Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fear & Greed Gauge */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-accent" />
            <h3 className="text-lg">Fear & Greed Index</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={gaugeData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#d4af37" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl mb-1">{currentFearGreed}</div>
                <div className="text-sm text-muted-foreground text-center">{fearGreedLabel}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-1 w-full mb-4">
              <div className="text-center">
                <div className="h-2 bg-red-500 rounded mb-1"></div>
                <div className="text-xs text-muted-foreground">Extreme Fear</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-orange-500 rounded mb-1"></div>
                <div className="text-xs text-muted-foreground">Fear</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-yellow-500 rounded mb-1"></div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-green-500 rounded mb-1"></div>
                <div className="text-xs text-muted-foreground">Greed</div>
              </div>
              <div className="text-center">
                <div className="h-2 bg-green-700 rounded mb-1"></div>
                <div className="text-xs text-muted-foreground">Extreme Greed</div>
              </div>
            </div>
          </div>
        </Card>

        {/* On-Chain Statistics */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg mb-6">On-Chain Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {onChainStats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{stat.metric}</span>
                  {stat.status === 'positive' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="text-xl mb-1">{stat.value}</div>
                <div className={`text-sm ${
                  stat.status === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Whale Transactions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Whale Activity</h3>
          <Badge variant="secondary">Live</Badge>
        </div>
        
        <div className="space-y-4">
          {whaleTransactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-card/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'Buy' ? 'bg-green-100 text-green-600' :
                  tx.type === 'Sell' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {tx.type === 'Buy' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : tx.type === 'Sell' ? (
                    <TrendingDown className="w-5 h-5" />
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tx.type} {tx.asset}</span>
                    <Badge variant="outline" className="text-xs">{tx.exchange}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tx.amount} • {tx.wallet}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg">{tx.value}</div>
                <div className="text-sm text-muted-foreground">{tx.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Options Expiry + Twitter Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Options Expiry */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg">Options Expiry Calendar</h3>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Deribit
            </Button>
          </div>
          
          <div className="space-y-4">
            {optionsExpiry.map((expiry, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="font-medium">{expiry.date}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    P/C: {expiry.putCall}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">BTC Volume:</span>
                    <div className="font-medium">${expiry.btcVolume}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ETH Volume:</span>
                    <div className="font-medium">${expiry.ethVolume}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Twitter Feed */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg">Market Sentiment</h3>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>
          
          <div className="space-y-4">
            {twitterFeed.map((tweet, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-card/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{tweet.user}</span>
                      <span className="text-sm text-muted-foreground">@{tweet.handle}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{tweet.time}</span>
                    </div>
                    <p className="text-sm mb-3">{tweet.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {tweet.retweets}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {tweet.likes}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fear & Greed Trend */}
      <Card className="p-6">
        <h3 className="text-lg mb-6">Fear & Greed Trend (7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={fearGreedData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Fear & Greed']}
              labelStyle={{ color: 'var(--foreground)' }}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--chart-1)" 
              fill="var(--chart-1)" 
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}