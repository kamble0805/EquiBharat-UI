'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Calendar, Loader2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import { type MarketPulseData } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const StatusGauge = ({ label, value, colorClass }: { label: string, value: string, colorClass: string }) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-4 rounded-xl flex-1 group hover:bg-slate-800/40 transition-all border-b-2" style={{ borderBottomColor: colorClass.includes('emerald') ? '#10b981' : colorClass.includes('blue') ? '#3b82f6' : colorClass.includes('orange') ? '#f59e0b' : colorClass.includes('red') ? '#ef4444' : '#64748b' }}>
    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1">{label}</span>
    <div className={cn("text-lg font-black tracking-tight", colorClass)}>
      {value || 'N/A'}
    </div>
  </div>
);

const MarketPulsePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const { data: pulseData, isLoading, isError } = useQuery<MarketPulseData>({
    queryKey: ['marketPulse', formattedDate],
    queryFn: async () => {
      const res = await fetch(`/api/market-pulse?date=${formattedDate}`);
      if (!res.ok) throw new Error('Failed to fetch market pulse');
      return res.json();
    },
  });

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#020617] text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="italic animate-pulse font-mono text-xs tracking-widest">ESTABLISHING SECURE FEED...</span>
      </div>
    );
  }

  if (isError || !pulseData) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#020617] text-slate-400 gap-4">
        <Activity className="w-12 h-12 text-red-500 opacity-50" />
        <p className="font-mono text-xs tracking-widest">FEED DISRUPTED. PLEASE RE-SYNC.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-800 text-slate-300 rounded-none uppercase text-[10px] tracking-widest">Manual Re-Sync</Button>
      </div>
    );
  }

  const triggers = JSON.parse(pulseData.pulse?.top_triggers || '[]');

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-16 bg-[#02030a] text-slate-200 selection:bg-blue-500/30">
      <div className="container mx-auto px-4 max-w-[1400px]">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[9px] font-black tracking-[0.4em] text-emerald-500 uppercase">System Status: Active Intelligence Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 italic">
              MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400 not-italic uppercase">PULSE</span>
            </h1>
            <p className="text-slate-500 text-xs font-medium tracking-tight max-w-sm ml-1">
              Cross-asset sentiment and volatility analysis for India's institutional grade intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/30 border border-slate-800/50 rounded-lg p-1backdrop-blur-xl">
            <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-10 w-10 text-slate-500 hover:text-blue-400">
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 hover:bg-slate-800/50">
                  <Calendar className="mr-3 h-4 w-4 text-blue-500" />
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#020617] border-slate-800 shadow-2xl" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date()}
                  className="bg-[#020617] text-slate-200"
                />
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={handleNextDay} disabled={isSameDay(selectedDate, new Date())} className="h-10 w-10 text-slate-500 hover:text-blue-400 disabled:opacity-5">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* TOP ROW: Gauges */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <StatusGauge 
             label="Global Sentiment" 
             value={pulseData.pulse?.global_mood || 'Neutral'} 
             colorClass={pulseData.pulse?.global_mood === 'Bullish' ? 'text-emerald-400' : pulseData.pulse?.global_mood === 'Bearish' ? 'text-red-400' : 'text-slate-200'} 
           />
           <StatusGauge 
             label="India Market Bias" 
             value={pulseData.pulse?.india_bias || 'Stable'} 
             colorClass={pulseData.pulse?.india_bias === 'Positive' ? 'text-blue-400' : pulseData.pulse?.india_bias === 'Cautionary' ? 'text-orange-400' : 'text-slate-200'} 
           />
           <StatusGauge 
             label="Volatility State" 
             value={pulseData.pulse?.volatility_state || 'Stable'} 
             colorClass="text-slate-200" 
           />
           <StatusGauge 
             label="Liquidity Index" 
             value={pulseData.pulse?.liquidity_state || 'Neutral'} 
             colorClass="text-slate-200" 
           />
        </div>

        {/* MAIN COLUMN SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: SECTORS (Col 1-3) */}
          <div className="lg:col-span-3 space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                   <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Sector Exposure
                </h3>
                <span className="text-[9px] text-slate-600 font-mono">LIVE FEED</span>
             </div>
             <div className="space-y-3">
                {pulseData.sectors?.map((s, i) => (
                  <div key={i} className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/40 p-4 rounded-lg flex justify-between items-center group hover:bg-slate-800/20 transition-all">
                     <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">{s.sector}</span>
                        <div className="text-sm font-black text-white">{s.score > 0 ? '+' : ''}{s.score.toFixed(1)}</div>
                     </div>
                     <div className="text-right">
                        <div className={cn("text-[10px] font-black", s.score > 2 ? 'text-emerald-500' : s.score < -2 ? 'text-red-500' : 'text-slate-600')}>
                          {s.score > 0 ? 'LONG' : 'SHORT'}
                        </div>
                        <div className="text-[8px] text-slate-700 font-mono uppercase">{s.total_signals} SGNLS</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* CENTER: INTELLIGENCE DEEP DIVE (Col 4-8) */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] group-hover:bg-blue-500/10 transition-all rounded-full" />
                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                   <Activity className="w-4 h-4" /> Tactical Summary
                </h3>
                <p className="text-xl md:text-2xl font-bold leading-tight text-white mb-8 tracking-tight">
                  "{pulseData.pulse?.summary || 'Observing market catalysts for emerging bias...'}"
                </p>
                <div className="h-[1px] w-full bg-slate-800/50 mb-8" />
                
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                   <Info className="w-4 h-4" /> Strategic Triggers
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {triggers.map((trigger: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start bg-slate-950/30 p-4 rounded-xl border border-slate-900 group/item hover:border-blue-900/50 transition-all">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                       <span className="text-slate-300 text-[13px] font-medium leading-relaxed group-hover/item:text-white transition-colors">{trigger}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* RIGHT: TIMELINE (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5 text-blue-500" /> Impact Timeline
                </h3>
                <span className="text-[9px] text-slate-600 font-mono">14-DAY HORIZON</span>
             </div>
             
             <div className="relative border-l border-slate-800/60 ml-2 space-y-6 pb-4">
                {pulseData.events?.slice(0, 10).map((e, i) => (
                  <div key={i} className="relative pl-8 group">
                    {/* Timeline Node */}
                    <div className={cn(
                      "absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#02030a] z-10 transition-all duration-300",
                      e.impact_level === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 
                      e.impact_level === 'Moderate' ? 'bg-orange-500' : 'bg-slate-500'
                    )} />
                    
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/30 hover:border-slate-700 transition-all hover:translate-x-1 group-hover:bg-slate-800/10">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono font-bold text-slate-500 tracking-tighter uppercase">
                            {format(new Date(e.event_time), 'MMM dd')} <span className="mx-1 opacity-20">•</span> {format(new Date(e.event_time), 'hh:mm a')}
                          </span>
                          <span className={cn(
                             "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                             e.impact_level === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                          )}>
                             {e.impact_level}
                          </span>
                       </div>
                       <div className="text-white text-xs font-black truncate mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{e.event_name}</div>
                       <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{e.country} Market</div>
                    </div>
                  </div>
                ))}
             </div>
             
             <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-slate-600 hover:text-slate-300 hover:bg-slate-900/30">
               View Comprehensive Horizon
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulsePage;

