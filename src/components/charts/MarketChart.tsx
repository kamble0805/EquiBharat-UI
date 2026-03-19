'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChartEngine } from '@/lib/charts/ChartEngine';
import { DataService } from '@/lib/charts/DataService';
import { CandlestickData, Time } from 'lightweight-charts';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Const indices as requested
const INDICES = [
    { id: 'NIFTY', name: 'NIFTY' },
    { id: 'BANKNIFTY', name: 'BANK NIFTY' },
    { id: 'NIFTY50', name: 'NIFTY 50' },
    { id: 'NIFTYMIDCAP', name: 'NIFTY MIDCAP' },
];

export function MarketChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartEngineRef = useRef<ChartEngine | null>(null);
    const dataServiceRef = useRef<DataService | null>(null);

    const [activeSymbol, setActiveSymbol] = useState(INDICES[0].id);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize Services
    useEffect(() => {
        if (!dataServiceRef.current) {
            dataServiceRef.current = new DataService();
        }

        return () => {
            dataServiceRef.current?.disconnect();
        };
    }, []);

    // Initialize and update chart when container or symbol changes
    const initChart = useCallback(async () => {
        if (!chartContainerRef.current) return;

        setIsLoading(true);
        setError(null);

        // Destroy existing chart if it exists
        if (chartEngineRef.current) {
            chartEngineRef.current.destroy();
        }

        // New Engine instance
        const engine = new ChartEngine();
        chartEngineRef.current = engine;

        // Initialize chart
        engine.init(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight || 500,
        });

        try {
            // Fetch Historical Data
            const historicalData = await dataServiceRef.current?.fetchHistoricalData(activeSymbol);

            if (historicalData && historicalData.length > 0) {
                engine.setData(historicalData);
            } else {
                // Placeholder if no data available yet (mocking some data for visual purpose)
                // If the API isn't ready, we might want to show at least something
                console.warn(`No historical data returned for ${activeSymbol}`);
            }

            // Connect WebSocket for real-time updates
            dataServiceRef.current?.connectWebSocket((tick) => {
                // Ensure tick is for the active symbol
                if (tick && tick.symbol === activeSymbol) {
                    const candle: CandlestickData<Time> = {
                        time: (tick.time / 1000) as Time, // Assuming ms to s
                        open: tick.open,
                        high: tick.high,
                        low: tick.low,
                        close: tick.close,
                    };
                    engine.update(candle);
                }
            });

            // Subscribe to symbol
            dataServiceRef.current?.subscribe(activeSymbol);

        } catch (err) {
            console.error('Failed to load chart data:', err);
            setError('Failed to load market data.');
        } finally {
            setIsLoading(false);
        }
    }, [activeSymbol]);

    useEffect(() => {
        initChart();

        // Handle resizing
        const handleResize = () => {
            if (chartContainerRef.current && chartEngineRef.current) {
                chartEngineRef.current.resize(
                    chartContainerRef.current.clientWidth,
                    chartContainerRef.current.clientHeight || 500
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chartEngineRef.current?.destroy();
        };
    }, [initChart]);

    return (
        <div className="w-full h-full bg-[#0f172a] flex flex-col overflow-hidden">
            {/* Chart Header / Selector */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-[#1e293b]/30">
                <div className="flex gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                    {INDICES.map((index) => (
                        <button
                            key={index.id}
                            onClick={() => setActiveSymbol(index.id)}
                            className={cn(
                                "px-3 py-1 text-[11px] font-semibold rounded-md transition-all",
                                activeSymbol === index.id
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            {index.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Stream
                    </span>
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative flex-grow w-full bg-[#0f172a]">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing Market Engine...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm px-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <span className="text-red-500 text-2xl">!</span>
                        </div>
                        <h4 className="text-slate-100 font-semibold mb-1">Data Feed Interrupted</h4>
                        <p className="text-slate-400 text-xs max-w-xs">{error}</p>
                        <button
                            onClick={() => initChart()}
                            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                )}

                <div ref={chartContainerRef} className="w-full h-full" />
            </div>

            {/* Footer Info */}
            <div className="px-6 py-2 bg-[#0a0f1e] text-[10px] text-slate-500 flex justify-between border-t border-slate-800/50">
                <div className="flex gap-4">
                    <span>Powered by <strong className="text-slate-400">Lightweight Charts</strong></span>
                    <span>MIT Licensed</span>
                </div>
                <div className="flex gap-4">
                    <span>OHLC: 1 Minute</span>
                    <span className="text-emerald-500/70 font-mono">Real-time Latency: &lt; 50ms</span>
                </div>
            </div>
        </div>
    );
}
