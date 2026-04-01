'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  User, 
  ExternalLink,
  Calendar,
  Clock,
  Circle
} from 'lucide-react';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { EconomicEvent } from './EventTable';
import { useToast } from '@/hooks/use-toast';

// Extended interface for the premium experience
export interface PremiumEvent extends EconomicEvent {
  currency?: string;
  usual_effect?: string | null;
  why_traders_care?: string;
  technical_notes?: string;
  speaker?: string;
  verify_link?: string;
  previous_news_link?: string | null;
}

interface PremiumEconomicCalendarProps {
  events: PremiumEvent[];
  compact?: boolean;
}

const IMPACT_COLORS = {
  high: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-500',
    pill: 'bg-red-500',
    folder: 'text-red-500/70'
  },
  medium: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    text: 'text-orange-500',
    pill: 'bg-orange-500',
    folder: 'text-orange-500/70'
  },
  low: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-500',
    pill: 'bg-yellow-500',
    folder: 'text-yellow-500/70'
  },
  extreme: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-500',
    pill: 'bg-purple-500',
    folder: 'text-purple-500/70'
  },
  moderate: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-500',
    pill: 'bg-blue-500',
    folder: 'text-blue-500/70'
  }
};

const CURRENCY_FLAGS: Record<string, string> = {
  'INR': '🇮🇳',
  'USD': '🇺🇸',
  'EUR': '🇪🇺',
  'GBP': '🇬🇧',
  'JPY': '🇯🇵',
  'AUD': '🇦🇺',
  'CAD': '🇨🇦',
  'CHF': '🇨🇭',
  'CNY': '🇨🇳',
  'HKD': '🇭🇰',
  'NZD': '🇳🇿',
};

const PremiumEventRow = ({ 
  event, 
  isFirstOfDate, 
  isExpanded, 
  onToggle,
  compact = false
}: { 
  event: PremiumEvent; 
  isFirstOfDate: boolean; 
  isExpanded: boolean; 
  onToggle: () => void;
  compact?: boolean;
}) => {
  const { toast } = useToast();
  const impact = (event.impact_level as keyof typeof IMPACT_COLORS) || 'low';
  const colors = IMPACT_COLORS[impact] || IMPACT_COLORS.low;
  
  const time = new Date(event.published_date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const date = new Date(event.published_date);
  const dateStr = format(date, 'dd/MM');

  const handleToggle = () => {
    const eventTime = new Date(event.published_date).getTime();
    if (eventTime > Date.now()) {
      toast({
        title: "Upcoming Event",
        description: `This data will be released in ${formatDistanceToNow(eventTime)}.`,
      });
      // Allow expansion anyway, or we could stop here if we don't want to expand.
    }
    onToggle();
  };

  return (
    <>
      <motion.tr 
        layout
        onClick={handleToggle}
        className={`group border-b border-border/70 hover:bg-muted/50 cursor-pointer transition-colors ${
          isExpanded ? 'bg-muted/80 shadow-inner' : ''
        }`}
      >
        {/* Date Column */}
        {!compact && (
          <td className="w-[60px] md:w-[100px] py-4 px-2 md:px-4 border-r border-border/70 align-top">
            {isFirstOfDate ? (
              <span className="font-mono text-xs font-bold text-muted-foreground tracking-wider">
                {dateStr}
              </span>
            ) : (
              <span className="sr-only">{dateStr}</span>
            )}
          </td>
        )}

        {/* Time Column */}
        <td className={cn(
          "py-4 px-2 md:px-4 border-r border-border/70 font-mono text-xs text-muted-foreground align-top text-center",
          compact ? "w-[50px] md:w-[70px]" : "w-[60px] md:w-[80px]"
        )}>
          {time}
        </td>

        {/* Currency Column */}
        <td className="w-[40px] md:w-[50px] py-4 px-2 md:px-4 border-r border-border/70 align-top text-center">
          <div className="flex items-center justify-center">
            <div className="w-5 h-3 rounded-[1px] overflow-hidden border border-border/60 shadow-sm flex-shrink-0">
               <img 
                 src={`https://flagcdn.com/w40/${event.currency === 'USD' ? 'us' : event.currency === 'EUR' ? 'eu' : event.currency === 'GBP' ? 'gb' : event.currency === 'JPY' ? 'jp' : (event.currency || 'INR').toLowerCase().slice(0, 2)}.png`} 
                 alt={event.currency || 'INR'}
                 className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1] group-hover:grayscale-0 transition-all"
                 onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                 }}
               />
            </div>
          </div>
        </td>

        {/* Impact Column - Hidden in compact if needed? No, keep it as indicator */}
        <td className="w-[40px] md:w-[50px] py-4 px-2 md:px-4 border-r border-border/70 align-top">
           <div className={`w-3.5 h-3.5 rounded-sm mx-auto flex items-center justify-center ${colors.bg} ${colors.border} border`}>
              <div className={`w-1.5 h-1.5 rounded-sm ${colors.pill} shadow-[0_0_4px_rgba(255,255,255,0.1)]`} />
           </div>
        </td>

        {/* Title Column */}
        <td className={cn(
          "py-4 align-top",
          compact ? "px-2 md:px-3" : "px-3 md:px-6"
        )}>
          <div className="flex flex-col gap-1">
            <h4 className={`text-[12px] font-bold tracking-tight transition-colors ${
              isExpanded ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'
            }`}>
              {event.title}
            </h4>
            {event.category && !compact && (
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                {event.category}
              </span>
            )}
          </div>
        </td>

        {/* Details Icon Column */}
        <td className="w-[40px] py-4 px-2 md:px-4 text-center align-top">
          <div className={`transition-all duration-300 ${
            isExpanded ? 'opacity-100 scale-110' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
          }`}>
             {isExpanded ? (
               <FolderOpen className={`w-3.5 h-3.5 mx-auto ${colors.folder}`} />
             ) : (
               <Folder className={`w-3.5 h-3.5 mx-auto ${colors.folder} opacity-60`} />
             )}
          </div>
        </td>
      </motion.tr>

      {/* Expandable Intelligence Node */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.tr 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="bg-muted/20"
          >
            <td colSpan={compact ? 5 : 6} className="p-0 overflow-hidden">
              <div className={cn(
                "border-b border-border/70 bg-background/80 backdrop-blur-sm",
                compact ? "p-4" : "p-6 md:p-8"
              )}>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/20">
                    <tr className="flex flex-col md:table-row">
                      <td className="py-3 pr-4 font-semibold text-muted-foreground md:w-[140px] md:min-w-[140px] align-top text-left">Source</td>
                      <td className="py-3 align-top flex flex-wrap gap-2 items-center">
                        <span className="font-medium text-foreground">{event.speaker || 'Official Publication'}</span>
                        <a href={event.verify_link || event.link || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary hover:bg-secondary/80 text-xs font-medium text-foreground transition-colors">
                          <ExternalLink className="w-3 h-3" /> Latest Release
                        </a>
                        {event.previous_news_link && (
                          <a href={event.previous_news_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-primary/20 text-primary hover:bg-primary/10 text-xs font-medium transition-colors">
                            <Calendar className="w-3 h-3" /> Previous News
                          </a>
                        )}
                      </td>
                    </tr>
                    <tr className="flex flex-col md:table-row">
                      <td className="py-3 pr-4 font-semibold text-muted-foreground md:w-[140px] md:min-w-[140px] align-top text-left">Measures</td>
                      <td className="py-3 align-top text-muted-foreground leading-relaxed">
                        {event.summary || 'Advanced institutional analysis pending for this event. Market monitoring in progress.'}
                      </td>
                    </tr>
                    <tr className="flex flex-col md:table-row">
                      <td className="py-3 pr-4 font-semibold text-muted-foreground md:w-[140px] md:min-w-[140px] align-top text-left">Usual Effect</td>
                      <td className="py-3 align-top text-muted-foreground leading-relaxed">
                        {event.usual_effect || 'Actual > Forecast = Bullish for Currency Performance'}
                      </td>
                    </tr>
                    <tr className="flex flex-col md:table-row">
                      <td className="py-3 pr-4 font-semibold text-muted-foreground md:w-[140px] md:min-w-[140px] align-top text-left">Why Traders Care</td>
                      <td className="py-3 align-top text-muted-foreground leading-relaxed">
                        {event.why_traders_care || `The ${event.title} provides critical insights into macroeconomic shifts that drive central bank policy and long-term currency valuations.`}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

export const PremiumEconomicCalendar = ({ events, compact = false }: PremiumEconomicCalendarProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group events by date and sort chronologically
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.published_date).getTime();
    const timeB = new Date(b.published_date).getTime();
    return timeA - timeB;
  });

  const groupedByDate: Record<string, PremiumEvent[]> = {};
  sortedEvents.forEach(event => {
    const dateKey = format(new Date(event.published_date), 'yyyy-MM-dd');
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(event);
  });

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/30 rounded-2xl border border-border overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 border border-border">
           <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-foreground font-bold text-lg mb-2">No Economic Events Found</h3>
        <p className="text-muted-foreground text-sm max-w-xs text-center">
          The calendar is currently clear. Expect new data as institutional feeds pulse.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border/60 rounded-xl overflow-hidden shadow-2xl">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-muted/40 border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {!compact && <th className="py-4 px-2 md:px-4 w-[60px] md:w-[100px]">Date</th>}
            <th className={cn("py-4 px-2 md:px-4 text-center", compact ? "w-[50px] md:w-[70px]" : "w-[60px] md:w-[80px]")}>Time</th>
            <th className="py-4 px-2 md:px-4 w-[40px] md:w-[50px] text-center">Cur</th>
            <th className="py-4 px-2 md:px-4 w-[40px] md:w-[50px] text-center">Imp</th>
            <th className="py-4 px-3 md:px-6 border-l border-border/70">Event Name</th>
            <th className="py-4 px-2 md:px-4 w-[40px] text-center">Det</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {Object.entries(groupedByDate).map(([dateKey, dateEvents]) => (
            <React.Fragment key={dateKey}>
              {dateEvents.map((event, index) => (
                <PremiumEventRow
                  key={event.id}
                  event={event}
                  isFirstOfDate={index === 0}
                  isExpanded={expandedId === event.id}
                  onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  compact={compact}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
