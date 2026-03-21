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

const BiasGauge = ({ pulse }: { pulse: MarketPulseData['pulse'] }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl text-center shadow-xl">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2 w-full text-center">
        Current Market Bias
      </h3>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center justify-center">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Global Mood</span>
          <div className={`text-3xl font-black ${pulse?.global_mood === 'Bullish' ? 'text-emerald-400' : pulse?.global_mood === 'Bearish' ? 'text-red-400' : 'text-slate-300'}`}>
            {pulse?.global_mood || 'Neutral'}
          </div>
        </div>
        <div className="hidden sm:block h-12 w-[1px] bg-slate-800" />
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">India Bias</span>
          <div className={`text-3xl font-black ${pulse?.india_bias === 'Positive' ? 'text-blue-400' : pulse?.india_bias === 'Cautionary' ? 'text-orange-400' : 'text-slate-300'}`}>
            {pulse?.india_bias || 'Stable'}
          </div>
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-sm italic max-w-xl mx-auto">
        "{pulse?.summary || 'Observing market catalysts for emerging bias...'}"
      </p>
    </div>
  );
};

const SectoralHeatmap = ({ sectors }: { sectors: MarketPulseData['sectors'] }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {sectors?.map((s, i) => (
        <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-4 rounded-xl border-l-4 transition-all hover:scale-[1.02] hover:bg-slate-800/80" 
             style={{ borderLeftColor: s.score > 2 ? '#10b981' : s.score < -2 ? '#ef4444' : '#64748b' }}>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 truncate">{s.sector}</span>
            <div className="flex justify-between items-end">
               <span className="text-white font-bold">{s.score > 0 ? '+' : ''}{s.score.toFixed(1)}</span>
               <span className="text-[9px] text-slate-600 font-mono">{s.total_signals} signals</span>
            </div>
        </div>
      ))}
    </div>
  );
};

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
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-slate-950 text-slate-500 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="italic animate-pulse">Requesting intelligence pulse...</span>
      </div>
    );
  }

  if (isError || !pulseData) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-4">
        <Activity className="w-12 h-12 text-red-500 opacity-50" />
        <p>Failed to synchronized with market intelligence feeds.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-800 text-slate-300">Retry Sync</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-16 bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase">Live Intelligence Feed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
              MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">PULSE</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-md">
              Real-time sentiment aggregation and cross-sector impact analysis for the Indian markets.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl p-1.5 backdrop-blur-sm self-start md:self-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevDay}
              className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-slate-800">
                  <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                  {format(selectedDate, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-800" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date()}
                  className="bg-slate-900 text-slate-200"
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              disabled={isSameDay(selectedDate, new Date())}
              className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800 disabled:opacity-20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Row 1: Bias and Triggers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BiasGauge pulse={pulseData.pulse} />
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl shadow-xl">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
                 <Info className="w-3 h-3" /> TOP TRIGGERS
               </h3>
               <ul className="space-y-4">
                  {JSON.parse(pulseData.pulse?.top_triggers || '[]').map((trigger: string, i: number) => (
                     <li key={i} className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-4 py-1 group hover:border-blue-400 transition-colors">
                        <span className="text-slate-300 text-xs font-medium leading-relaxed group-hover:text-white transition-colors">{trigger}</span>
                     </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* Row 2: Heatmap and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
             <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 px-1">
                   <TrendingUp className="w-4 h-4 text-emerald-400" /> Sectoral Heatmap
                </h3>
                <SectoralHeatmap sectors={pulseData.sectors} />
             </div>
             
             <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 px-1">
                   <Calendar className="w-4 h-4 text-blue-400" /> Impact Timeline
                </h3>
                <div className="space-y-3">
                   {pulseData.events?.map((e, i) => (
                      <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:bg-slate-800/60 transition-colors">
                         <div className="flex gap-4 items-center">
                            <div className={cn(
                              "w-2 h-2 rounded-full transition-all duration-500",
                              e.impact_level === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                              e.impact_level === 'Moderate' ? 'bg-orange-500' : 'bg-slate-500'
                            )} />
                            <div>
                               <div className="text-white text-xs font-bold group-hover:text-blue-400 transition-colors">{e.event_name}</div>
                               <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-tighter">
                                 {e.country} <span className="mx-1 opacity-30">•</span> {new Date(e.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </div>
                            </div>
                         </div>
                         <div className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded">
                            {e.impact_level}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketPulsePage;

