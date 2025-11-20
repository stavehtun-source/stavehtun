import React, { useState } from 'react';
import { Trade } from '../types';
import { analyzeTradingJournal } from '../services/geminiService';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  trades: Trade[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ trades }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeTradingJournal(trades);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-800 p-8 rounded-xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" />
            Gemini Trade Coach
          </h2>
          <p className="text-slate-300 mt-2 max-w-xl">
            Use Google's Gemini AI to analyze your journal. It will identify your winning patterns, point out psychological leaks, and suggest improvements for your next session.
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-2 whitespace-nowrap ${
            loading 
              ? 'bg-indigo-600/50 cursor-wait' 
              : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" /> Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Generate Analysis
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-lg">
          <div className="prose prose-invert max-w-none">
            {/* We render markdown here. In a real app, we'd use a proper markdown renderer. 
                Since I cannot install 'react-markdown' in this environment, I will display it as pre-formatted text 
                with some basic styling, OR assume the user has a markdown renderer. 
                For this prompt, I'll simulate a markdown-like view using basic CSS in global or just render the text cleanly.
                Wait, I can create a simple parser or just dump the text.
                Actually, let's use a simple whitespace preserver.
             */}
             <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
                {analysis.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-4">{line.replace('# ', '')}</h1>
                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-indigo-300 mt-5 mb-3">{line.replace('## ', '')}</h2>
                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold text-emerald-300 mt-4 mb-2">{line.replace('### ', '')}</h3>
                    if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-300 mb-1">{line.replace('- ', '')}</li>
                    if (line.trim() === '') return <br key={i} />
                    return <p key={i} className="mb-2">{line}</p>
                })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
