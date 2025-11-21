'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface StockInputProps {
    onSearch: (symbol: string) => void;
    isLoading: boolean;
}

export default function StockInput({ onSearch, isLoading }: StockInputProps) {
    const [symbol, setSymbol] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (symbol.trim()) {
            onSearch(symbol.toUpperCase());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter Stock Symbol (e.g., AAPL)"
                    className="w-full px-4 py-3 pr-12 text-lg bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !symbol.trim()}
                    className="absolute right-2 p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                    <Search size={24} />
                </button>
            </div>
        </form>
    );
}
