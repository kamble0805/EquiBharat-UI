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

  const displaySnapshot = compact ? data.snapshot.slice(0, 4) : data.snapshot;
  const displayTriggers = compact ? data.triggers.slice(0, 3) : data.triggers;

  return (
    <div className="widget-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Market Pulse</h3>
          <span className="text-xs text-muted-foreground ml-2">— {data.date}</span>
        </div>
        <Link
          href="/market-pulse"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Full view
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="bg-secondary/80 rounded px-3 py-1 flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Global:</span>
          <span className={cn(
            'font-medium flex items-center gap-0.5',
            data.globalMood.direction === 'down' ? 'text-destructive' : 'text-success'
          )}>
            {data.globalMood.status}
            {data.globalMood.direction === 'down' ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
          </span>
        </div>
        <div className="bg-secondary/80 rounded px-3 py-1 flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">India:</span>
          <span className="font-medium text-warning">{data.indiaBias}</span>
        </div>
        <div className="bg-secondary/80 rounded px-3 py-1 flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Vol:</span>
          <span className="font-medium text-warning">{data.volatility}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Triggers */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Key Triggers
          </h4>
          <div className="space-y-2">
            {displayTriggers.map((trigger) => (
              <div key={trigger.id} className="flex items-start gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <span className="font-medium text-foreground">{trigger.title}</span>
                  {!compact && (
                    <span className="text-muted-foreground"> — {trigger.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Snapshot */}
        <div>
          <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Market Snapshot
          </h4>
          <div className="space-y-2">
            {displaySnapshot.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1.5 px-2 bg-secondary/50 rounded"
              >
                <span className="text-sm text-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">{item.value}</span>
                  <span className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    item.direction === 'up' ? 'text-success' : 'text-destructive'
                  )}>
                    {item.direction === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {item.direction === 'up' ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      {data.riskFlags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-4">
            {data.riskFlags.slice(0, 2).map((flag, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                <span className="text-muted-foreground">{flag.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
