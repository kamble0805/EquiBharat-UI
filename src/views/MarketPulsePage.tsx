'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Calendar, Loader2, Info } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type MarketPulseData } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const StatusGauge = ({ label, value, colorClass }: { label: string, value: string, colorClass: string }) => (
  <div className="bg-card border border-border p-4 rounded-xl flex-1 group hover:bg-card/80 transition-all border-b-2 shadow-sm" style={{ borderBottomColor: colorClass.includes('emerald') ? 'hsl(var(--success))' : colorClass.includes('blue') ? 'hsl(var(--primary))' : colorClass.includes('orange') ? 'hsl(var(--warning))' : colorClass.includes('red') ? 'hsl(var(--destructive))' : 'hsl(var(--muted))' }}>
    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase block mb-1">{label}</span>
    <div className={cn("text-lg font-black tracking-tight", colorClass)}>
      {value || 'N/A'}
    </div>
  </div>
);

const MarketPulsePage = () => {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { data: pulseData, isLoading, isError } = useQuery<MarketPulseData>({
    queryKey: ['marketPulse'],
    queryFn: async () => {
      const res = await fetch(`/api/market-pulse`);
      if (!res.ok) throw new Error('Failed to fetch market pulse');
      return res.json();
    },
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-background text-muted-foreground gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="italic animate-pulse font-mono text-xs tracking-widest">ESTABLISHING SECURE FEED...</span>
      </div>
    );
  }

  if (isError || !pulseData) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-background text-muted-foreground gap-4">
        <Activity className="w-12 h-12 text-destructive opacity-50" />
        <p className="font-mono text-xs tracking-widest">FEED DISRUPTED. PLEASE RE-SYNC.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-border text-foreground rounded-none uppercase text-[10px] tracking-widest">Manual Re-Sync</Button>
      </div>
    );
  }

  const triggers = JSON.parse(pulseData.pulse?.top_triggers || '[]');

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-16 bg-background text-foreground selection:bg-primary/30">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] font-black tracking-[0.4em] text-emerald-500 uppercase">System Status: Active Intelligence Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground tracking-tighter mb-2">
               Equi<span className="text-primary italic">Bharat</span> <span className="text-muted-foreground font-sans italic not-italic opacity-50 text-3xl md:text-5xl ml-2">PULSE</span>
            </h1>
            <p className="text-muted-foreground text-xs font-medium tracking-tight max-w-sm ml-1 leading-relaxed">
               Cross-asset sentiment and volatility intelligence. Institutional grade analytics for the Indian ecosystem.
            </p>
          </div>
        </div>

         {/* TOP ROW: Gauges */}
         <div className="flex flex-col md:flex-row gap-4 mb-8">
            <StatusGauge 
              label="Global Sentiment" 
              value={pulseData.pulse?.global_mood || 'Neutral'} 
              colorClass={pulseData.pulse?.global_mood === 'Bullish' ? 'text-emerald-500' : pulseData.pulse?.global_mood === 'Bearish' ? 'text-red-500' : 'text-foreground/70'} 
            />
            <StatusGauge 
              label="India Market Bias" 
              value={pulseData.pulse?.india_bias || 'Stable'} 
              colorClass={pulseData.pulse?.india_bias === 'Positive' ? 'text-blue-500' : pulseData.pulse?.india_bias === 'Cautionary' ? 'text-orange-500' : 'text-foreground/70'} 
            />
            <StatusGauge 
              label="Volatility State" 
              value={pulseData.pulse?.volatility_state || 'Stable'} 
              colorClass="text-foreground/70" 
            />
            <StatusGauge 
              label="Liquidity Index" 
              value={pulseData.pulse?.liquidity_state || 'Neutral'} 
              colorClass="text-foreground/70" 
            />
         </div>

        {/* MAIN COLUMN SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: STRATEGIC HORIZON */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                   <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Strategic Horizon
                </h3>
                <span className="text-[9px] text-muted-foreground font-mono">EXTENDED FEED</span>
             </div>
             <div className="space-y-3">
                {pulseData.upcoming_news && pulseData.upcoming_news.length > 0 ? (
                  pulseData.upcoming_news.map((news, i) => (
                    <div key={i} className="bg-card border border-border p-4 rounded-xl group hover:bg-accent transition-all border-l-2 shadow-sm" style={{ borderLeftColor: (news.impact_level || '').toLowerCase() === 'high' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }}>
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase tracking-tighter">
                             {news.impact_level}
                          </span>
                          <span className="text-[8px] font-mono text-muted-foreground">
                             {format(new Date(news.published_at), 'MMM dd')}
                          </span>
                       </div>
                       <h4 className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors mb-1 leading-tight line-clamp-2">
                          {news.title}
                       </h4>
                       <p className="text-[9px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {news.summary}
                       </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-muted border border-dashed border-border p-8 rounded-xl text-center">
                     <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No phase insights.</p>
                  </div>
                )}
             </div>
          </div>

          {/* CENTER: INTELLIGENCE DEEP DIVE */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-card border border-border p-8 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all rounded-full" />
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Activity className="w-4 h-4" /> Tactical Summary
                </h3>
                <p className="text-xl md:text-2xl font-bold leading-tight text-foreground mb-8 tracking-tight">
                  "{pulseData.pulse?.summary || 'Observing market catalysts for emerging bias...'}"
                </p>
                <div className="h-[1px] w-full bg-border/50 mb-8" />
                
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Info className="w-4 h-4" /> Strategic Triggers
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {triggers.map((trigger: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start bg-secondary p-4 rounded-xl border border-border group/item hover:border-primary/50 transition-all">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                       <span className="text-muted-foreground text-[13px] font-medium leading-relaxed group-hover/item:text-foreground transition-colors">{trigger}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* RIGHT: TIMELINE */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5 text-blue-500" /> Impact Timeline
                </h3>
                <span className="text-[9px] text-muted-foreground font-mono">WEEKLY HORIZON</span>
             </div>
             
             <div className="relative border-l border-border/60 ml-2 space-y-6 pb-4">
                {pulseData.events?.slice(0, 10).map((e, i) => (
                  <div key={i} className="relative pl-8 group">
                    {/* Timeline Node */}
                    <div className={cn(
                      "absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background z-10 transition-all duration-300",
                      e.impact_level === 'High' ? 'bg-destructive shadow-[0_0_10px_hsl(var(--destructive)/0.4)]' : 
                      e.impact_level === 'Moderate' ? 'bg-warning' : 'bg-muted-foreground'
                    )} />
                    
                    <div className="bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-all hover:translate-x-1 group-hover:bg-accent/50">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono font-bold text-muted-foreground tracking-tighter uppercase">
                            {format(new Date(e.event_time), 'MMM dd')} <span className="mx-1 opacity-20">•</span> {format(new Date(e.event_time), 'hh:mm a')}
                          </span>
                          <span className={cn(
                             "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                             e.impact_level === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
                          )}>
                             {e.impact_level}
                          </span>
                       </div>
                       <div className="text-foreground text-xs font-black truncate mb-1 group-hover:text-primary transition-colors uppercase tracking-tight">{e.event_name}</div>
                       <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{e.country} Market</div>
                    </div>
                  </div>
                ))}
             </div>
             
             <Link href="/calendar" className="block w-full pt-2">
               <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-muted-foreground hover:text-foreground hover:bg-muted/30">
                 View Comprehensive Horizon
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulsePage;

