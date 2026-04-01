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
    <div className="widget-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h1 className="font-serif font-black text-white text-sm">Equi<span className="text-primary italic">Bharat</span> <span className="opacity-40 font-sans font-bold">PULSE</span></h1>
        </div>
        <Link
          href="/market-pulse"
          className="text-[10px] text-primary hover:text-primary/80 font-black uppercase tracking-widest flex items-center gap-1 transition-colors"
        >
          Full Analysis
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-secondary rounded px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-muted-foreground font-mono opacity-50">Global:</span>
          <span className={cn(
             data.pulse.global_mood === 'Bullish' ? 'text-success' : 
             data.pulse.global_mood === 'Bearish' ? 'text-destructive' : 'text-foreground'
          )}>
            {data.pulse.global_mood}
          </span>
        </div>
        <div className="bg-secondary rounded px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
          <span className="text-muted-foreground font-mono opacity-50">India:</span>
          <span className={cn(
             data.pulse.india_bias === 'Positive' ? 'text-primary' : 
             data.pulse.india_bias === 'Cautionary' ? 'text-warning' : 'text-foreground'
          )}>
            {data.pulse.india_bias}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Sector Summary */}
        <div>
           <h4 className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 border-b border-border pb-1">
             Top Sectors
           </h4>
           <div className="flex gap-2">
             {displaySectors.map((s, i) => (
               <div key={i} className="flex-1 bg-secondary/40 p-2 rounded border-l-2" 
                    style={{ borderLeftColor: s.score > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
                 <div className="text-[9px] text-muted-foreground font-bold truncate uppercase">{s.sector}</div>
                 <div className="text-xs font-bold text-foreground">{s.score > 0 ? '+' : ''}{s.score.toFixed(1)}</div>
               </div>
             ))}
           </div>
        </div>

        {/* Recent Events */}
        {!compact && (
          <div>
            <h4 className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 border-b border-border pb-1">
              Impending Events
            </h4>
            <div className="space-y-2">
              {displayEvents.map((e, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate pr-2">{e.event_name}</span>
                  <span className={cn(
                    "font-bold uppercase text-[9px]",
                    e.impact_level === 'High' ? 'text-destructive' : 'text-muted-foreground'
                  )}>{e.impact_level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming News Tip */}
        {!compact && data.upcoming_news && data.upcoming_news.length > 0 && (
          <div>
            <h4 className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 border-b border-border pb-1">
              Weekly Intelligence
            </h4>
            <div className="bg-primary/5 border border-primary/20 p-2 rounded">
              <p className="text-[10px] text-primary font-bold leading-tight">
                {data.upcoming_news[0].title}
              </p>
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
