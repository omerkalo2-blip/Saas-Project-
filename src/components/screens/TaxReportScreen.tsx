import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { FileText, Download, AlertTriangle, TrendingUp, TrendingDown, Calendar, Calculator } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface TaxReportScreenProps {
  onNavigate: (screen: string) => void;
}

const gainsData = [
  {
    asset: 'USDC',
    buyDate: '2024-01-15',
    sellDate: '2024-09-01',
    buyPrice: '₪0.99',
    sellPrice: '₪1.00',
    quantity: '28,000',
    costBasis: '₪27,720',
    proceeds: '₪28,000',
    gain: '₪280',
    gainType: 'Long-term',
    status: 'realized'
  },
  {
    asset: 'ETH',
    buyDate: '2023-11-20',
    sellDate: '2024-08-15',
    buyPrice: '₪7,200',
    sellPrice: '₪9,100',
    quantity: '5.2',
    costBasis: '₪37,440',
    proceeds: '₪47,320',
    gain: '₪9,880',
    gainType: 'Long-term',
    status: 'realized'
  },
  {
    asset: 'SOL',
    buyDate: '2024-03-10',
    sellDate: '2024-08-20',
    buyPrice: '₪95',
    sellPrice: '₪140',
    quantity: '85',
    costBasis: '₪8,075',
    proceeds: '₪11,900',
    gain: '₪3,825',
    gainType: 'Short-term',
    status: 'realized'
  },
  {
    asset: 'ILV',
    buyDate: '2024-04-05',
    sellDate: '2024-08-31',
    buyPrice: '₪55',
    sellPrice: '₪42.30',
    quantity: '850',
    costBasis: '₪46,750',
    proceeds: '₪35,955',
    gain: '-₪10,795',
    gainType: 'Short-term',
    status: 'realized'
  },
  {
    asset: 'BTC',
    buyDate: '2023-12-01',
    sellDate: 'N/A',
    buyPrice: '₪165,000',
    sellPrice: '₪232,100',
    quantity: '0.238',
    costBasis: '₪39,270',
    proceeds: 'N/A',
    gain: '₪15,830',
    gainType: 'Long-term',
    status: 'unrealized'
  },
];

const missingAssets = [
  {
    asset: 'ILV',
    issue: 'Missing purchase transactions',
    impact: 'Cannot calculate accurate cost basis',
    severity: 'High',
    suggestedAction: 'Import exchange records',
    potentialTax: '₪2,159'
  },
  {
    asset: 'MATIC',
    issue: 'Staking rewards not tracked',
    impact: 'Unreported income',
    severity: 'Medium', 
    suggestedAction: 'Add validator rewards',
    potentialTax: '₪892'
  },
];

const taxSummary = [
  { category: 'Short-term Gains', amount: -6970, color: '#ef4444' },
  { category: 'Long-term Gains', amount: 25990, color: '#22c55e' },
  { category: 'Staking Income', amount: 3780, color: '#3b82f6' },
  { category: 'Trading Fees', amount: -1374, color: '#f59e0b' },
];

const monthlyTaxData = [
  { month: 'Jan', gains: 2400, losses: -800, net: 1600 },
  { month: 'Feb', gains: 1800, losses: -1200, net: 600 },
  { month: 'Mar', gains: 3200, losses: -400, net: 2800 },
  { month: 'Apr', gains: 1600, losses: -2800, net: -1200 },
  { month: 'May', gains: 4200, losses: -600, net: 3600 },
  { month: 'Jun', gains: 2800, losses: -1400, net: 1400 },
  { month: 'Jul', gains: 3600, losses: -800, net: 2800 },
  { month: 'Aug', gains: 5400, losses: -3200, net: 2200 },
];

export function TaxReportScreen({ onNavigate }: TaxReportScreenProps) {
  const totalGains = 35000;
  const totalTaxLiability = 8700;
  const effectiveTaxRate = 24.9;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl mb-2">Tax Report & Analysis</h1>
          <p className="text-muted-foreground">Comprehensive tax analysis for tax year 2024 with LevChain's advanced reporting</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button>
            <Calculator className="w-4 h-4 mr-2" />
            Tax Calculator
          </Button>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Gains</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl mb-1 text-green-600">₪{totalGains.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Realized + Unrealized</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Tax Liability</p>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">₪{totalTaxLiability.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Est. payment due</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Effective Rate</p>
            <Calculator className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl mb-1">{effectiveTaxRate}%</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Blended tax rate</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Net After Tax</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl mb-1 text-green-600">₪{(totalGains - totalTaxLiability).toLocaleString()}</div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Your net profit</span>
          </div>
        </Card>
      </div>

      {/* Missing Assets Alert */}
      {missingAssets.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Action Required:</strong> We found {missingAssets.length} issues that may affect your tax calculation. 
            Review the missing data section below to ensure accurate reporting.
          </AlertDescription>
        </Alert>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tax Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg mb-6">Tax Breakdown by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taxSummary.filter(item => item.amount > 0)}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="amount"
              >
                {taxSummary.filter(item => item.amount > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`₪${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {taxSummary.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className={`text-sm ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount >= 0 ? '+' : ''}₪{item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly P&L */}
        <Card className="p-6">
          <h3 className="text-lg mb-6">Monthly Tax Impact (₪)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyTaxData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`₪${value.toLocaleString()}`, name]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="gains" fill="#22c55e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="losses" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Gains Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Capital Gains & Losses</h3>
          <div className="flex gap-2">
            <Badge variant="secondary">Realized</Badge>
            <Badge variant="outline">Unrealized</Badge>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Buy Date</TableHead>
                <TableHead>Sell Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Basis</TableHead>
                <TableHead>Proceeds</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gainsData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.asset}</TableCell>
                  <TableCell>{row.buyDate}</TableCell>
                  <TableCell>{row.sellDate}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.costBasis}</TableCell>
                  <TableCell>{row.proceeds}</TableCell>
                  <TableCell className={row.gain.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                    {row.gain}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.gainType === 'Long-term' ? 'default' : 'secondary'}>
                      {row.gainType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'realized' ? 'default' : 'outline'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Missing Data */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg">Missing Data & Issues</h3>
          <Badge variant="destructive">{missingAssets.length} Issues</Badge>
        </div>
        
        <div className="space-y-4">
          {missingAssets.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800">{item.asset}</h4>
                    <p className="text-sm text-yellow-700">{item.issue}</p>
                  </div>
                </div>
                <Badge 
                  variant={item.severity === 'High' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {item.severity}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-yellow-600">Impact:</span>
                  <p className="text-yellow-800">{item.impact}</p>
                </div>
                <div>
                  <span className="text-yellow-600">Suggested Action:</span>
                  <p className="text-yellow-800">{item.suggestedAction}</p>
                </div>
                <div>
                  <span className="text-yellow-600">Potential Tax Impact:</span>
                  <p className="text-yellow-800 font-medium">{item.potentialTax}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300">
                  Fix Issue
                </Button>
                <Button size="sm" variant="ghost" className="text-yellow-800">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tax Planning */}
      <Card className="p-6 bg-primary text-primary-foreground">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg mb-2">Tax Planning Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Short-term Strategies:</h4>
                <ul className="text-sm space-y-1 text-primary-foreground/90">
                  <li>• Harvest losses to offset gains before year-end</li>
                  <li>• Consider deferring additional trades until next year</li>
                  <li>• Review staking rewards for quarterly payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Long-term Planning:</h4>
                <ul className="text-sm space-y-1 text-primary-foreground/90">
                  <li>• Hold positions longer for favorable tax treatment</li>
                  <li>• Consider tax-advantaged accounts for staking</li>
                  <li>• Plan for next year's estimated tax payments</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" size="sm">
                Schedule Consultation
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-primary-foreground/20 text-primary-foreground">
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}