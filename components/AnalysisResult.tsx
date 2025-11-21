'use client';

import { motion } from 'framer-motion';

interface AnalysisResultProps {
    data: {
        recommendation: 'BUY' | 'SELL' | 'HOLD';
        explanation: string;
    } | null;
}

export default function AnalysisResult({ data }: AnalysisResultProps) {
    if (!data) return null;

    const getColor = (rec: string) => {
        switch (rec) {
            case 'BUY': return 'text-green-500 border-green-500 bg-green-500/10';
            case 'SELL': return 'text-red-500 border-red-500 bg-red-500/10';
            default: return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
        >
            <div className="flex flex-col items-center text-center">
                <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Recommendation</h2>
                <div className={`text-4xl font-bold px-6 py-2 rounded-full border-2 ${getColor(data.recommendation)}`}>
                    {data.recommendation}
                </div>

                <div className="mt-6 text-left w-full">
                    <h3 className="text-gray-300 font-semibold mb-2">Analysis</h3>
                    <p className="text-gray-400 leading-relaxed">
                        {data.explanation}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
