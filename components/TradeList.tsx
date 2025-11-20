import React from 'react';
import { Trade, TradeStatus, TradeType } from '../types';
import { Trash2, ExternalLink } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
  onDelete: (id: string) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onDelete }) => {
  // Sort trades by date descending
  const sortedTrades = [...trades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: TradeStatus) => {
    switch (status) {
      case TradeStatus.WIN: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case TradeStatus.LOSS: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case TradeStatus.BE: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900/50 text-slate-200 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Pair</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Setup</th>
              <th className="px-6 py-4">Lot</th>
              <th className="px-6 py-4">P&L</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {sortedTrades.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  No trades recorded yet. Start journaling!
                </td>
              </tr>
            ) : (
              sortedTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {trade.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {trade.pair}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${trade.type === TradeType.BUY ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {trade.setup}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {trade.lotSize}
                  </td>
                  <td className={`px-6 py-4 font-mono font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onDelete(trade.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Delete Trade"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeList;
