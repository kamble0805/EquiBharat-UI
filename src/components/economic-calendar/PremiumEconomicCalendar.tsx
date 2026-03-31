'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { format, isToday, isYesterday } from 'date-fns';
import { EconomicEvent } from './EventTable';

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
  onToggle 
}: { 
  event: PremiumEvent; 
  isFirstOfDate: boolean; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  const impact = (event.impact_level as keyof typeof IMPACT_COLORS) || 'low';
  const colors = IMPACT_COLORS[impact] || IMPACT_COLORS.low;
  
  const time = new Date(event.published_date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const date = new Date(event.published_date);
  const dateStr = format(date, 'dd/MM');

  return (
    <>
      <motion.tr 
        layout
        onClick={onToggle}
        className={`group border-b border-slate-800/40 hover:bg-zinc-900/50 cursor-pointer transition-colors ${
          isExpanded ? 'bg-zinc-900/80 shadow-inner' : ''
        }`}
      >
        {/* Date Column */}
        <td className="w-[100px] py-4 px-4 border-r border-slate-800/40 align-top">
          {isFirstOfDate ? (
            <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
              {dateStr}
            </span>
          ) : (
            <span className="sr-only">{dateStr}</span>
          )}
        </td>

        {/* Time Column */}
        <td className="w-[80px] py-4 px-4 border-r border-slate-800/40 font-mono text-xs text-slate-300 align-top">
          {time}
        </td>

        {/* Currency Column */}
        <td className="w-[60px] py-4 px-4 border-r border-slate-800/40 align-top text-center">
          <div className="flex items-center justify-center">
            <div className="w-6 h-4 rounded-[1px] overflow-hidden border border-slate-800/60 shadow-sm flex-shrink-0">
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

        {/* Impact Column */}
        <td className="w-[60px] py-4 px-4 border-r border-slate-800/40 align-top">
           <div className={`w-5 h-5 rounded-sm flex items-center justify-center ${colors.bg} ${colors.border} border`}>
              <div className={`w-2.5 h-2.5 rounded-sm ${colors.pill} shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
           </div>
        </td>

        {/* Title Column */}
        <td className="py-4 px-6 align-top">
          <div className="flex flex-col gap-1">
            <h4 className={`text-sm font-bold tracking-tight transition-colors ${
              isExpanded ? 'text-white' : 'text-slate-200 group-hover:text-white'
            }`}>
              {event.title}
            </h4>
            {event.category && (
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                {event.category}
              </span>
            )}
          </div>
        </td>

        {/* Details Icon Column */}
        <td className="w-[50px] py-4 px-4 text-center align-top">
          <div className={`transition-all duration-300 ${
            isExpanded ? 'opacity-100 scale-110' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
          }`}>
             {isExpanded ? (
               <FolderOpen className={`w-4 h-4 mx-auto ${colors.folder}`} />
             ) : (
               <Folder className={`w-4 h-4 mx-auto ${colors.folder} opacity-60`} />
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
            className="bg-black/40"
          >
            <td colSpan={6} className="p-0 overflow-hidden">
              <div className="p-8 border-b border-slate-800/40 bg-zinc-950/50 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Institutional Deep-dive */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                       <Info className="w-3.5 h-3.5" />
                       Institutional Summary
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {event.summary || 'Advanced institutional analysis pending for this event. Market monitoring in progress.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Usual Effect Mapping</h5>
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex flex-col gap-2">
                       <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase">
                          <TrendingUp className="w-3 h-3" /> Institutional Impact Strategy
                       </div>
                       <p className="text-slate-300 text-xs italic leading-relaxed">
                          {event.usual_effect || 'Actual > Forecast = Bullish for Currency Performance'}
                       </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Rationale */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                     <Circle className="w-1.5 h-1.5 fill-current" />
                     Why Traders Care
                  </div>
                  <p className="text-slate-300 text-sm italic leading-relaxed">
                     {event.why_traders_care || `The ${event.title} provides critical insights into macroeconomic shifts that drive central bank policy and long-term currency valuations.`}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="col-span-full pt-4 mt-4 border-t border-slate-800/40 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Speaker / Authority</span>
                      <span className="text-xs text-slate-300 font-medium">{event.speaker || 'Official Publication'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {event.previous_news_link && (
                      <a 
                        href={event.previous_news_link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 hover:text-indigo-300 text-indigo-400 text-xs font-bold transition-all"
                      >
                         View Previous Event <Calendar className="w-3 h-3" />
                      </a>
                    )}
                    
                    <a 
                      href={event.verify_link || event.link || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded border border-slate-800 hover:bg-slate-800 hover:text-white text-slate-400 text-xs font-bold transition-all"
                    >
                      Verify External <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};

export const PremiumEconomicCalendar = ({ events }: { events: PremiumEvent[] }) => {
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
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-zinc-950/30 rounded-2xl border border-slate-900 overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800">
           <Calendar className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-slate-200 font-bold text-lg mb-2">No Economic Events Found</h3>
        <p className="text-slate-500 text-sm max-w-xs text-center">
          The calendar is currently clear. Expect new data as institutional feeds pulse.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl overflow-x-auto lg:overflow-x-visible">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="bg-zinc-900/40 border-b border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            <th className="py-4 px-4 w-[100px]">Date</th>
            <th className="py-4 px-4 w-[80px]">Time</th>
            <th className="py-4 px-4 w-[80px]">Cur</th>
            <th className="py-4 px-4 w-[60px]">Imp</th>
            <th className="py-4 px-6 border-l border-slate-800/40">Event Name</th>
            <th className="py-4 px-4 w-[50px] text-center">Det</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/20">
          {Object.entries(groupedByDate).map(([dateKey, dateEvents]) => (
            <React.Fragment key={dateKey}>
              {dateEvents.map((event, index) => (
                <PremiumEventRow
                  key={event.id}
                  event={event}
                  isFirstOfDate={index === 0}
                  isExpanded={expandedId === event.id}
                  onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
