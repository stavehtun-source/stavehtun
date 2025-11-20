export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum TradeStatus {
  WIN = 'WIN',
  LOSS = 'LOSS',
  BE = 'BE', // Break Even
  OPEN = 'OPEN'
}

export interface Trade {
  id: string;
  date: string;
  pair: string;
  type: TradeType;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pnl: number; // Profit or Loss in currency
  status: TradeStatus;
  setup: string; // e.g., "Trendline Break", "Supply Zone"
  notes: string;
  tags: string[];
}

export interface TradeStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  bestPair: string;
}

export type View = 'dashboard' | 'journal' | 'add-trade' | 'analysis';
