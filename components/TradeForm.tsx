import React, { useState } from 'react';
import { Trade, TradeStatus, TradeType } from '../types';
import { Save, X } from 'lucide-react';

interface TradeFormProps {
  onSave: (trade: Trade) => void;
  onCancel: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Trade>>({
    date: new Date().toISOString().split('T')[0],
    pair: 'EURUSD',
    type: TradeType.BUY,
    lotSize: 0.01,
    entryPrice: 0,
    exitPrice: 0,
    pnl: 0,
    status: TradeStatus.OPEN,
    setup: '',
    notes: '',
    tags: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // Handle number fields
      if (['entryPrice', 'exitPrice', 'lotSize', 'pnl'].includes(name)) {
        return { ...prev, [name]: parseFloat(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      date: formData.date!,
      pair: formData.pair!.toUpperCase(),
      type: formData.type as TradeType,
      entryPrice: formData.entryPrice!,
      exitPrice: formData.exitPrice!,
      lotSize: formData.lotSize!,
      pnl: formData.pnl!,
      status: formData.status as TradeStatus,
      setup: formData.setup || '',
      notes: formData.notes || '',
      tags: []
    };
    onSave(newTrade);
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Log New Trade</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date & Pair */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Pair</label>
            <input
              type="text"
              name="pair"
              value={formData.pair}
              onChange={handleChange}
              placeholder="e.g. GBPJPY"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all uppercase"
              required
            />
          </div>

          {/* Type & Status */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value={TradeType.BUY}>BUY (Long)</option>
              <option value={TradeType.SELL}>SELL (Short)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value={TradeStatus.OPEN}>OPEN</option>
              <option value={TradeStatus.WIN}>WIN</option>
              <option value={TradeStatus.LOSS}>LOSS</option>
              <option value={TradeStatus.BE}>BREAK EVEN</option>
            </select>
          </div>

          {/* Entry & Exit */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Entry Price</label>
            <input
              type="number"
              step="any"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Exit Price</label>
            <input
              type="number"
              step="any"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Lot & PnL */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Lot Size</label>
            <input
              type="number"
              step="0.01"
              name="lotSize"
              value={formData.lotSize}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">P&L ($)</label>
            <input
              type="number"
              step="any"
              name="pnl"
              value={formData.pnl}
              onChange={handleChange}
              className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all ${
                (formData.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            />
          </div>
        </div>

        {/* Setup & Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Strategy / Setup</label>
          <input
            type="text"
            name="setup"
            value={formData.setup}
            onChange={handleChange}
            placeholder="e.g. 4H Support Bounce"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Notes & Psychology</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="How did you feel? Did you follow your plan?"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors mr-3 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Save Trade
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradeForm;
