import { GoogleGenAI } from "@google/genai";
import { Trade } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTradingJournal = async (trades: Trade[]): Promise<string> => {
  if (trades.length === 0) {
    return "No trades available to analyze. Please log some trades first.";
  }

  // Prepare a simplified version of trades to save tokens and focus on key data
  const tradeData = trades.map(t => ({
    date: t.date,
    pair: t.pair,
    type: t.type,
    pnl: t.pnl,
    setup: t.setup,
    notes: t.notes,
    status: t.status
  }));

  const prompt = `
    Act as a professional Forex Trading Coach and Analyst. 
    Review the following trading journal entries in JSON format.
    
    Analyze the data for:
    1. **Patterns in Winning vs. Losing Trades**: Are there specific setups, pairs, or times that perform better?
    2. **Risk Management**: Comment on the consistency of wins vs losses (Profit Factor implications).
    3. **Psychology**: Based on the 'notes', identify any emotional trading triggers (FOMO, revenge trading, hesitation).
    4. **Actionable Advice**: Give 3 specific bullet points on what the trader should focus on next week to improve.

    Format the output in clean Markdown with headings. Use bolding for emphasis.
    
    Trading Data:
    ${JSON.stringify(tradeData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert financial trading mentor. Be constructive, direct, and data-driven.",
        temperature: 0.7,
      }
    });

    return response.text || "Failed to generate analysis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "An error occurred while analyzing your journal. Please ensure your API key is valid and try again.";
  }
};
