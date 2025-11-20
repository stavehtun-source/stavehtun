import React, { useMemo } from 'react';
import { Trade, TradeStatus } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats = useMemo(() => {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.status === TradeStatus.WIN).length;
    const losses = trades.filter(t => t.status === TradeStatus.LOSS).length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
      : 0;
    const avgLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length) 
      : 0;
    
    const profitFactor = avgLoss > 0 ? (avgWin * wins) / (avgLoss * losses) : 0;

    return {
      totalTrades,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
      profitFactor
    };
  }, [trades]);

  // Prepare Equity Curve Data
  const equityData = useMemo(() => {
    let runningBalance = 0;
    // Sort by date ascending for the chart
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sortedTrades.map(trade => {
      runningBalance += trade.pnl;
      return {
        date: trade.date,
        balance: runningBalance,
        pnl: trade.pnl
      };
    });
  }, [trades]);

  // Prepare Win/Loss Pie Data
  const pieData = [
    { name: 'Wins', value: trades.filter(t => t.status === TradeStatus.WIN).length },
    { name: 'Losses', value: trades.filter(t => t.status === TradeStatus.LOSS).length },
    { name: 'Break Even', value: trades.filter(t => t.status === TradeStatus.BE).length },
  ];
  
  const PIE_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Net P&L</p>
              <h3 className={`text-2xl font-bold mt-2 ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${stats.totalPnL.toFixed(2)}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${stats.totalPnL >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Win Rate</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {stats.winRate.toFixed(1)}%
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400">
              <Target size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{stats.totalTrades} Total Trades</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Profit Factor</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {stats.profitFactor.toFixed(2)}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
              <Activity size={20} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Avg R:R Estimate</p>
              <h3 className="text-2xl font-bold mt-2 text-white">
                {(stats.avgLoss !== 0 ? (stats.avgWin / stats.avgLoss).toFixed(2) : '0.00')}
              </h3>
            </div>
            <div className="p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Win: ${stats.avgWin.toFixed(0)} | Loss: -${stats.avgLoss.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6">Equity Curve</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}}
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPnl)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
