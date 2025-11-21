'use client';

import { useState } from 'react';
import StockInput from '@/components/StockInput';
import AnalysisResult from '@/components/AnalysisResult';
import StockChart from '@/components/StockChart';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisData {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  explanation: string;
  historical?: any[];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState('');
  const [currentStock, setCurrentStock] = useState<any>(null);

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setError('');
    setAnalysisData(null);
    setCurrentStock(null);

    try {
      // 1. Fetch Stock Data
      const financeRes = await fetch(`/api/finance?symbol=${symbol}`);
      const financeData = await financeRes.json();

      if (!financeRes.ok) throw new Error(financeData.error || 'Failed to fetch stock data');

      setCurrentStock(financeData.quote);

      // 2. Analyze with OpenAI
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          historical: financeData.historical,
          quote: financeData.quote,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) throw new Error(analyzeData.error || 'Failed to analyze stock');

      // Combine analysis result with historical data for the chart
      setAnalysisData({ ...analyzeData, historical: financeData.historical });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/10 rounded-full">
              <TrendingUp size={48} className="text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Trade Helper
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered trend analysis for smarter trading decisions
          </p>
        </div>

        <StockInput onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {currentStock && !isLoading && (
          <div className="text-center w-full">
            <h2 className="text-2xl font-bold">{currentStock.displayName || currentStock.shortName} ({currentStock.symbol})</h2>
            <p className="text-3xl font-mono mt-2">${currentStock.regularMarketPrice?.toFixed(2)}</p>

            {/* Pass historical data to chart if available */}
            {analysisData && (
              <StockChart data={analysisData.historical || []} />
            )}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400 animate-pulse">Analyzing market trends...</p>
          </div>
        )}

        <AnalysisResult data={analysisData} />
      </div>
    </main>
  );
}
