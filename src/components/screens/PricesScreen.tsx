import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { TrendingUp, TrendingDown, Search, Star, Eye, BarChart3, ExternalLink, Filter } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface PricesScreenProps {
  onNavigate: (screen: string) => void;
}

const coinData = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '₪232,100',
    change24h: -1.2,
    change7d: 3.8,
    volume: '₪1.82B',
    marketCap: '₪4.58T',
    supply: '19.75M BTC',
    sparkline: [230000, 228000, 232000, 235000, 231000, 229000, 232100],
    favorite: true,
    holding: '0.238 BTC'
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    price: '₪9,245',
    change24h: 2.1,
    change7d: 5.2,
    volume: '₪4.21B',
    marketCap: '₪1.11T',
    supply: '120.4M ETH',
    sparkline: [9100, 9200, 9180, 9250, 9300, 9280, 9245],
    favorite: true,
    holding: '8.95 ETH'
  },
  {
    rank: 3,
    name: 'Solana',
    symbol: 'SOL',
    price: '₪142.50',
    change24h: 8.2,
    change7d: 12.1,
    volume: '₪890K',
    marketCap: '₪67.2B',
    supply: '471.9M SOL',
    sparkline: [130, 135, 140, 138, 145, 144, 142.5],
    favorite: false,
    holding: '194 SOL'
  },
  {
    rank: 4,
    name: 'USD Coin',
    symbol: 'USDC',
    price: '₪3.67',
    change24h: 0.1,
    change7d: 0.2,
    volume: '₪2.1M',
    marketCap: '₪128B',
    supply: '34.9B USDC',
    sparkline: [3.66, 3.67, 3.66, 3.67, 3.68, 3.67, 3.67],
    favorite: false,
    holding: '18,400 USDC'
  },
  {
    rank: 5,
    name: 'Tether',
    symbol: 'USDT',
    price: '₪3.67',
    change24h: 0.0,
    change7d: 0.1,
    volume: '₪48.2B',
    marketCap: '₪119B',
    supply: '118.5B USDT',
    sparkline: [3.67, 3.67, 3.66, 3.67, 3.67, 3.67, 3.67],
    favorite: false,
    holding: '0 USDT'
  },
  {
    rank: 6,
    name: 'BNB',
    symbol: 'BNB',
    price: '₪2,156',
    change24h: -0.8,
    change7d: 2.1,
    volume: '₪1.2B',
    marketCap: '₪313B',
    supply: '145.4M BNB',
    sparkline: [2180, 2170, 2160, 2150, 2165, 2160, 2156],
    favorite: false,
    holding: '0 BNB'
  },
  {
    rank: 7,
    name: 'XRP',
    symbol: 'XRP',
    price: '₪2.18',
    change24h: 1.5,
    change7d: -2.1,
    volume: '₪3.8B',
    marketCap: '₪123B',
    supply: '56.5B XRP',
    sparkline: [2.15, 2.16, 2.20, 2.17, 2.19, 2.18, 2.18],
    favorite: false,
    holding: '0 XRP'
  },
  {
    rank: 8,
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: '₪0.38',
    change24h: 5.2,
    change7d: 8.9,
    volume: '₪2.1B',
    marketCap: '₪55.8B',
    supply: '146.8B DOGE',
    sparkline: [0.36, 0.37, 0.38, 0.37, 0.39, 0.38, 0.38],
    favorite: false,
    holding: '0 DOGE'
  },
  {
    rank: 45,
    name: 'Illuvium',
    symbol: 'ILV',
    price: '₪42.30',
    change24h: -15.1,
    change7d: -18.5,
    volume: '₪125K',
    marketCap: '₪423M',
    supply: '10M ILV',
    sparkline: [50, 48, 45, 44, 43, 42, 42.3],
    favorite: false,
    holding: '0 ILV'
  },
  {
    rank: 67,
    name: 'Polygon',
    symbol: 'MATIC',
    price: '₪1.45',
    change24h: -2.8,
    change7d: 1.2,
    volume: '₪890M',
    marketCap: '₪14.2B',
    supply: '9.8B MATIC',
    sparkline: [1.48, 1.46, 1.44, 1.45, 1.47, 1.46, 1.45],
    favorite: false,
    holding: '0 MATIC'
  },
];

const marketStats = [
  { label: 'Market Cap', value: '₪8.12T', change: '+2.3%' },
  { label: '24h Volume', value: '₪285B', change: '+5.1%' },
  { label: 'BTC Dominance', value: '56.4%', change: '-0.8%' },
  { label: 'ETH Dominance', value: '13.7%', change: '+0.4%' },
];

export function PricesScreen({ onNavigate }: PricesScreenProps) {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">Market Prices</h1>
          <p className="text-muted-foreground">Real-time cryptocurrency prices and market data</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => onNavigate('market')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Market Analysis
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {marketStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.change.startsWith('+') ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-2xl mb-1">{stat.value}</div>
            <div className={`text-sm ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Controls */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Watchlist Only
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Holdings Only
          </Button>
        </div>

        {/* Price Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>24h %</TableHead>
                <TableHead>7d %</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Volume (24h)</TableHead>
                <TableHead>Holdings</TableHead>
                <TableHead>Last 7 Days</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coinData.map((coin, index) => (
                <TableRow key={index} className="hover:bg-card/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          coin.favorite ? 'text-accent fill-accent' : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{coin.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">
                          {coin.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{coin.price}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${
                      coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`${
                      coin.change7d >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.change7d >= 0 ? '+' : ''}{coin.change7d}%
                    </div>
                  </TableCell>
                  <TableCell>{coin.marketCap}</TableCell>
                  <TableCell>{coin.volume}</TableCell>
                  <TableCell>
                    {coin.holding !== '0 BTC' && coin.holding !== '0 ETH' && 
                     coin.holding !== '0 SOL' && coin.holding !== '0 USDC' && 
                     coin.holding !== '0 USDT' && coin.holding !== '0 BNB' && 
                     coin.holding !== '0 XRP' && coin.holding !== '0 DOGE' && 
                     coin.holding !== '0 ILV' && coin.holding !== '0 MATIC' ? (
                      <Badge variant="secondary" className="text-xs">
                        {coin.holding}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={coin.sparkline.map((price, i) => ({ price, index: i }))}>
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke={coin.change7d >= 0 ? '#22c55e' : '#ef4444'}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Portfolio Holdings Summary */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">Your Holdings</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {coinData
            .filter(coin => coin.holding !== '0 BTC' && coin.holding !== '0 ETH' && 
                           coin.holding !== '0 SOL' && coin.holding !== '0 USDC' && 
                           coin.holding !== '0 USDT' && coin.holding !== '0 BNB' && 
                           coin.holding !== '0 XRP' && coin.holding !== '0 DOGE' && 
                           coin.holding !== '0 ILV' && coin.holding !== '0 MATIC')
            .map((coin, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">
                      {coin.symbol.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{coin.symbol}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{coin.holding}</div>
                <div className="text-lg font-medium">{coin.price}</div>
                <div className={`text-sm ${
                  coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}