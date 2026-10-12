import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Shield, Zap, Clock, TrendingUp, AlertCircle, Crown, Coins, Users, Droplets } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface StakingScreenProps {
  onNavigate: (screen: string) => void;
}

const stakingPools = [
  {
    asset: 'ETH',
    protocol: 'Lido',
    apy: '3.7%',
    staked: '12.5 ETH',
    value: '₪47,500',
    rewards: '₪146/month',
    status: 'active',
    lockPeriod: 'Liquid',
    risk: 'Low',
    minStake: '0.01 ETH',
    totalStaked: '32.8M ETH',
    validators: 245000,
    slashingRisk: '0.02%'
  },
  {
    asset: 'SOL',
    protocol: 'Marinade',
    apy: '8.0%',
    staked: '95 SOL',
    value: '₪13,538',
    rewards: '₪90/month',
    status: 'active',
    lockPeriod: '2-3 days',
    risk: 'Medium',
    minStake: '1 SOL',
    totalStaked: '18.5M SOL',
    validators: 1850,
    slashingRisk: '0.1%'
  },
  {
    asset: 'USDC',
    protocol: 'Compound',
    apy: '4.5%',
    staked: '18,400 USDC',
    value: '₪18,400',
    rewards: '₪69/month',
    status: 'active',
    lockPeriod: 'None',
    risk: 'Very Low',
    minStake: '1 USDC',
    totalStaked: '2.1B USDC',
    validators: 'N/A',
    slashingRisk: '0%'
  },
  {
    asset: 'USDT',
    protocol: 'Aave',
    apy: '4.5%',
    staked: '0 USDT',
    value: '₪0',
    rewards: '₪0/month',
    status: 'available',
    lockPeriod: 'None',
    risk: 'Very Low',
    minStake: '1 USDT',
    totalStaked: '1.8B USDT',
    validators: 'N/A',
    slashingRisk: '0%'
  },
];

const additionalPools = [
  {
    asset: 'BTC',
    protocol: 'Babylon',
    apy: '5.2%',
    status: 'coming-soon',
    lockPeriod: '21 days',
    risk: 'Medium',
    description: 'Bitcoin native staking protocol'
  },
  {
    asset: 'ATOM',
    protocol: 'Cosmos Hub',
    apy: '12.1%',
    status: 'available',
    lockPeriod: '21 days',
    risk: 'Medium',
    description: 'Cosmos ecosystem staking'
  },
  {
    asset: 'DOT',
    protocol: 'Polkadot',
    apy: '10.8%',
    status: 'available',
    lockPeriod: '28 days',
    risk: 'Medium',
    description: 'Polkadot nomination pools'
  },
  {
    asset: 'ADA',
    protocol: 'Cardano',
    apy: '4.6%',
    status: 'available',
    lockPeriod: 'None',
    risk: 'Low',
    description: 'Cardano delegation pools'
  },
];

const rewardsData = [
  { month: 'Mar', eth: 145, sol: 78, usdc: 65 },
  { month: 'Apr', eth: 152, sol: 82, usdc: 67 },
  { month: 'May', eth: 148, sol: 85, usdc: 68 },
  { month: 'Jun', eth: 156, sol: 88, usdc: 69 },
  { month: 'Jul', eth: 159, sol: 90, usdc: 69 },
  { month: 'Aug', eth: 146, sol: 90, usdc: 69 },
];

const apyTrends = [
  { date: '26 Aug', eth: 3.8, sol: 8.2, usdc: 4.6 },
  { date: '27 Aug', eth: 3.7, sol: 8.1, usdc: 4.5 },
  { date: '28 Aug', eth: 3.6, sol: 7.9, usdc: 4.4 },
  { date: '29 Aug', eth: 3.7, sol: 8.0, usdc: 4.5 },
  { date: '30 Aug', eth: 3.8, sol: 8.1, usdc: 4.6 },
  { date: '31 Aug', eth: 3.7, sol: 8.0, usdc: 4.5 },
  { date: '1 Sep', eth: 3.7, sol: 8.0, usdc: 4.5 },
];

export function StakingScreen({ onNavigate }: StakingScreenProps) {
  const totalStaked = 79438; // ₪
  const monthlyRewards = 305; // ₪
  const avgAPY = 5.1; // %

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">Staking Pools</h1>
          <p className="text-muted-foreground">Earn passive income through validator staking and liquidity provision with LevChain</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Reward History
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Auto-Compound
          </Button>
        </div>
      </div>

      {/* Staking Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Staked</p>
            <Coins className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">₪{totalStaked.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-green-600">+8.2% (30d)</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Monthly Rewards</p>
            <Crown className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl mb-1 text-green-600">+₪{monthlyRewards}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">₪{(monthlyRewards * 12).toLocaleString()}/year</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Average APY</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl mb-1">{avgAPY}%</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Weighted average</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Active Pools</p>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">3</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">1 available</span>
          </div>
        </Card>
      </div>

      {/* Active Staking Positions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Active Staking Positions</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">Live APY</Badge>
            <Badge variant="outline">Auto-compound</Badge>
          </div>
        </div>
        
        <div className="space-y-6">
          {stakingPools.map((pool, index) => (
            <div key={index} className={`p-6 border rounded-lg ${
              pool.status === 'available' ? 'border-dashed border-muted-foreground/30' : 'border-border'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pool.asset === 'ETH' ? 'bg-blue-100 text-blue-600' :
                    pool.asset === 'SOL' ? 'bg-purple-100 text-purple-600' :
                    pool.asset.includes('USD') ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl">{pool.asset}</h4>
                      <Badge variant="outline" className="text-xs">{pool.protocol}</Badge>
                      <Badge 
                        variant={pool.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {pool.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pool.status === 'active' ? pool.staked : `Min stake: ${pool.minStake}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl">{pool.value}</div>
                  <div className="text-lg text-green-600 font-medium">
                    APY: {pool.apy}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-6 gap-4 mb-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Rewards</div>
                  <div className="text-sm font-medium">{pool.rewards}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Lock Period</div>
                  <div className="text-sm">{pool.lockPeriod}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
                  <div className={`text-sm ${
                    pool.risk === 'Very Low' ? 'text-green-600' :
                    pool.risk === 'Low' ? 'text-blue-600' :
                    pool.risk === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {pool.risk}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Total Staked</div>
                  <div className="text-sm">{pool.totalStaked}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Validators</div>
                  <div className="text-sm">{pool.validators}</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Slashing Risk</div>
                  <div className="text-sm">{pool.slashingRisk}</div>
                </div>
              </div>

              <div className="flex gap-2">
                {pool.status === 'active' ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      Unstake
                    </Button>
                    <Button size="sm" className="flex-1">
                      Add More
                    </Button>
                    <Button variant="outline" size="sm">
                      <Droplets className="w-4 h-4 mr-2" />
                      Claim Rewards
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full">
                    Start Staking
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Pools */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Available Staking Opportunities</h3>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Browse All Pools
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {additionalPools.map((pool, index) => (
            <div key={index} className="p-4 border rounded-lg border-dashed">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pool.asset}</span>
                      <Badge variant="outline" className="text-xs">{pool.protocol}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{pool.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-green-600 font-medium">{pool.apy}</div>
                  <Badge 
                    variant={pool.status === 'available' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {pool.status === 'coming-soon' ? 'Coming Soon' : 'Available'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <span className="text-muted-foreground">Lock Period:</span>
                  <div>{pool.lockPeriod}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Risk:</span>
                  <div className={
                    pool.risk === 'Low' ? 'text-green-600' :
                    pool.risk === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }>
                    {pool.risk}
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className="w-full"
                disabled={pool.status === 'coming-soon'}
              >
                {pool.status === 'coming-soon' ? 'Notify Me' : 'Start Staking'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rewards History */}
        <Card className="p-6">
          <h3 className="text-lg mb-6">Monthly Rewards (₪)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rewardsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`₪${value}`, name.toUpperCase()]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="eth" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="sol" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="usdc" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* APY Trends */}
        <Card className="p-6">
          <h3 className="text-lg mb-6">APY Trends (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={apyTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name.toUpperCase()]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="eth" stackId="1" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.6} />
              <Area type="monotone" dataKey="sol" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.6} />
              <Area type="monotone" dataKey="usdc" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Risk Warning */}
      <Card className="p-6 border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Staking Risk Disclosure</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Staking involves risks including slashing penalties, validator performance issues, and market volatility. 
              Locked staking periods may prevent immediate withdrawals. Current APY rates are variable and subject to network conditions.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-yellow-800 border-yellow-300">
                Risk Assessment
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-yellow-800"
                data-navigation="true" onClick={() => onNavigate('tax')}
              >
                Tax Implications
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}