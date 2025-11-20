import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import AIAnalysis from './components/AIAnalysis';
import { Trade, TradeStatus, TradeType, View } from './types';
import { LayoutDashboard, BookOpen, PlusCircle, BrainCircuit, LogOut, User } from 'lucide-react';

// Initial mock data
const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    date: '2023-10-01',
    pair: 'EURUSD',
    type: TradeType.BUY,
    entryPrice: 1.0500,
    exitPrice: 1.0550,
    lotSize: 1.0,
    pnl: 500,
    status: TradeStatus.WIN,
    setup: 'Support Bounce',
    notes: 'Clean setup, waited for confirmation candle.',
    tags: ['Trend']
  },
  {
    id: '2',
    date: '2023-10-02',
    pair: 'GBPUSD',
    type: TradeType.SELL,
    entryPrice: 1.2200,
    exitPrice: 1.2240,
    lotSize: 0.5,
    pnl: -200,
    status: TradeStatus.LOSS,
    setup: 'Breakout',
    notes: 'Fakeout. Should have waited for retest. Felt FOMO.',
    tags: ['Breakout']
  },
  {
    id: '3',
    date: '2023-10-03',
    pair: 'USDJPY',
    type: TradeType.BUY,
    entryPrice: 149.00,
    exitPrice: 149.80,
    lotSize: 1.0,
    pnl: 600,
    status: TradeStatus.WIN,
    setup: 'Trend Continuation',
    notes: 'Added to position as it moved in my favor.',
    tags: ['Trend']
  },
  {
    id: '4',
    date: '2023-10-05',
    pair: 'XAUUSD',
    type: TradeType.SELL,
    entryPrice: 1820,
    exitPrice: 1825,
    lotSize: 0.2,
    pnl: -100,
    status: TradeStatus.LOSS,
    setup: 'Supply Zone',
    notes: 'News event spike took out stop loss.',
    tags: ['Reversal']
  },
  {
    id: '5',
    date: '2023-10-06',
    pair: 'EURUSD',
    type: TradeType.SELL,
    entryPrice: 1.0600,
    exitPrice: 1.0520,
    lotSize: 1.0,
    pnl: 800,
    status: TradeStatus.WIN,
    setup: 'Double Top',
    notes: 'Perfect execution.',
    tags: ['Reversal']
  }
];

const App: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  const [view, setView] = useState<View>('dashboard');

  // Persist to local storage (optional, simplified for demo)
  useEffect(() => {
    const saved = localStorage.getItem('protrade_journal');
    if (saved) {
      setTrades(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('protrade_journal', JSON.stringify(trades));
  }, [trades]);

  const handleAddTrade = (newTrade: Trade) => {
    setTrades(prev => [newTrade, ...prev]);
    setView('journal');
  };

  const handleDeleteTrade = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            ProTrade AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">Professional Trading Journal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setView('journal')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'journal' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Journal</span>
          </button>

          <button
            onClick={() => setView('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              view === 'analysis' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <BrainCircuit size={20} />
            <span className="font-medium">AI Coach</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setView('add-trade')}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle size={20} />
            <span>New Trade</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav Placeholder (Simple Top Bar) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 z-20 flex justify-between items-center">
         <h1 className="text-xl font-bold text-emerald-400">ProTrade AI</h1>
         <div className="flex gap-4">
            <button onClick={() => setView('dashboard')} className="text-slate-400"><LayoutDashboard size={24}/></button>
            <button onClick={() => setView('journal')} className="text-slate-400"><BookOpen size={24}/></button>
            <button onClick={() => setView('add-trade')} className="text-emerald-400"><PlusCircle size={24}/></button>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize">
              {view === 'add-trade' ? 'Log New Trade' : view === 'analysis' ? 'AI Performance Analysis' : view}
            </h2>
            <p className="text-slate-400 mt-1">
              {view === 'dashboard' && 'Overview of your trading performance.'}
              {view === 'journal' && 'Detailed history of your trades.'}
              {view === 'analysis' && 'Get insights from Gemini to improve your edge.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <User size={14} />
                <span>Trader</span>
             </div>
          </div>
        </header>

        {/* View Content */}
        <div className="transition-opacity duration-300">
          {view === 'dashboard' && <Dashboard trades={trades} />}
          {view === 'journal' && <TradeList trades={trades} onDelete={handleDeleteTrade} />}
          {view === 'add-trade' && <TradeForm onSave={handleAddTrade} onCancel={() => setView('journal')} />}
          {view === 'analysis' && <AIAnalysis trades={trades} />}
        </div>
      </main>
    </div>
  );
};

export default App;
