'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Calendar as CalendarIcon, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { type MarketPulseData, type MarketTrigger, type MarketSnapshot, type ScheduledEvent, type MarketChange, type RiskFlag } from '@/types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type FocusTab = 'equity' | 'currency' | 'commodities';

const MarketPulsePage = () => {
  const [activeTab, setActiveTab] = useState<FocusTab>('equity');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format date for display or key usage
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  // Fetch real data from market-pulse API
  const { data, isLoading, isError } = useQuery<MarketPulseData>({
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
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-8 bg-gradient-premium animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header with Date Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 flex items-center gap-3">
              MARKET PULSE
            </h1>
            <p className="text-muted-foreground">
              Key events and market drivers for traders
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevDay}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-8 px-3 text-sm font-medium min-w-[140px]">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              disabled={isSameDay(selectedDate, new Date())}
              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <div className="bg-card border border-border shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Global Mood:</span>
            <span className={cn(
              'font-semibold flex items-center gap-1',
              data.globalMood.direction === 'down' ? 'text-destructive' :
                data.globalMood.direction === 'up' ? 'text-success' : 'text-warning'
            )}>
              {data.globalMood.status}
              {data.globalMood.direction === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : data.globalMood.direction === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
            </span>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">India Bias:</span>
            <span className="font-semibold text-primary">{data.indiaBias}</span>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Volatility:</span>
            <span className="font-semibold text-warning">{data.volatility}</span>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Liquidity:</span>
            <span className="font-semibold text-foreground">{data.liquidity}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Market Triggers */}
            <div className="widget-card bg-card border border-border shadow-card rounded-xl p-6 transition-all hover:shadow-lg">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Key Market Triggers
              </h2>
              <div className="space-y-4">
                {data.triggers.map((trigger) => (
                  <div key={trigger.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-warning mt-2 shrink-0 shadow-sm shadow-warning/50" />
                    <div>
                      <span className="font-semibold text-foreground block mb-1">{trigger.title}</span>
                      <span className="text-sm text-muted-foreground">{trigger.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Focus Section - Simplified to only Equity */}
            <div className="bg-card border border-border shadow-card rounded-xl overflow-hidden p-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Equity Focus: NIFTY 50</span>
                <span className="text-xl font-bold text-foreground leading-relaxed">{data.equityFocus}</span>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Market Snapshot */}
            <div className="widget-card bg-card border border-border shadow-card rounded-xl p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Market Snapshot</h3>
              <div className="space-y-1">
                {data.snapshot.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 px-2 rounded transition-colors group">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-foreground">{item.value}</span>
                      <span className={cn(
                        'flex items-center gap-0.5 text-xs font-bold',
                        item.direction === 'up' ? 'text-success' : 'text-destructive'
                      )}>
                        {item.direction === 'up' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(item.change).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Economic Calendar Widget */}
            <div className="widget-card bg-card border border-border shadow-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Today's Events
              </h3>
              <div className="timeline relative space-y-6 pl-4 border-l border-border ml-2">
                {data.calendarEvents.map((event, index) => (
                  <div key={index} className="relative">
                    <div className={cn(
                      "absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-background",
                      event.impact === 'high' ? 'bg-destructive' :
                        event.impact === 'medium' ? 'bg-warning' : 'bg-success'
                    )} />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-mono text-muted-foreground">{event.time}</span>
                      <span className="text-sm font-medium text-foreground">{event.event}</span>
                      <span className={cn(
                        'text-[10px] uppercase tracking-wider font-bold w-fit px-1.5 py-0.5 rounded',
                        event.impact === 'high' ? 'bg-destructive/10 text-destructive' :
                          event.impact === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                      )}>
                        {event.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPulsePage;
