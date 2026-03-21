import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MarketPulseData } from '@/types';

interface MarketPulseWidgetProps {
  compact?: boolean;
}

export function MarketPulseWidget({ compact = false }: MarketPulseWidgetProps) {
  const [data, setData] = useState<MarketPulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPulse = async () => {
      try {
        const res = await fetch('/api/market-pulse');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to fetch market pulse', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPulse();
  }, []);

  if (loading) {
    return (
      <div className="widget-card h-[300px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!data) return null;

  const displayEvents = data.events.slice(0, 3);
  const displaySectors = data.sectors.slice(0, 3);

  return (
    <div className="widget-card bg-slate-900 border-slate-800 text-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Market Pulse</h3>
        </div>
        <Link
          href="/market-pulse"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          Intelligence View
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-slate-800 rounded px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-500">Global:</span>
          <span className={cn(
             data.pulse.global_mood === 'Bullish' ? 'text-emerald-400' : 
             data.pulse.global_mood === 'Bearish' ? 'text-red-400' : 'text-slate-300'
          )}>
            {data.pulse.global_mood}
          </span>
        </div>
        <div className="bg-slate-800 rounded px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-500">India:</span>
          <span className={cn(
             data.pulse.india_bias === 'Positive' ? 'text-blue-400' : 
             data.pulse.india_bias === 'Cautionary' ? 'text-orange-400' : 'text-slate-300'
          )}>
            {data.pulse.india_bias}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Sector Summary */}
        <div>
           <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
             Top Sectors
           </h4>
           <div className="flex gap-2">
             {displaySectors.map((s, i) => (
               <div key={i} className="flex-1 bg-slate-800/50 p-2 rounded border-l-2" 
                    style={{ borderLeftColor: s.score > 0 ? '#10b981' : '#ef4444' }}>
                 <div className="text-[9px] text-slate-400 font-bold truncate uppercase">{s.sector}</div>
                 <div className="text-xs font-bold text-white">{s.score > 0 ? '+' : ''}{s.score.toFixed(1)}</div>
               </div>
             ))}
           </div>
        </div>

        {/* Recent Events */}
        {!compact && (
          <div>
            <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
              Impending Events
            </h4>
            <div className="space-y-2">
              {displayEvents.map((e, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate pr-2">{e.event_name}</span>
                  <span className={cn(
                    "font-bold uppercase text-[9px]",
                    e.impact_level === 'High' ? 'text-red-400' : 'text-slate-500'
                  )}>{e.impact_level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
           <p className="text-[11px] text-slate-500 italic leading-relaxed">
             "{data.pulse.summary.substring(0, 100)}..."
           </p>
        </div>
      </div>
    </div>
  );
}
