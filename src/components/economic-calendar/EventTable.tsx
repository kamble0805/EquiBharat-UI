'use client';

import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  FileText,
  ExternalLink,
  BookOpen,
  FolderOpen,
  Folder,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export interface EconomicEvent {
  id: string;
  /** ID of the raw news article – used for the /news/:id route */
  raw_news_id: string;
  source: string;
  title: string;
  /** Populated from simple_summary returned by the backend */
  summary: string;
  /** Optional original link to the external source */
  link?: string | null;
  category: string;
  /** Populated from overall_impact_level returned by the backend */
  impact_level: "extreme" | "high" | "moderate" | "medium" | "low";
  /** Bullish / Bearish / Neutral direction indicator */
  impact_direction?: "bullish" | "bearish" | "neutral" | null;
  likely_affected_indices?: string[];
  likely_affected_sectors?: string[];
  keywords?: string[];
  published_date: string;
}

interface EventTableProps {
  events: EconomicEvent[];
  groupedByDate: Map<string, EconomicEvent[]>;
}

const impactStyles = {
  extreme: "bg-purple-100/50 text-purple-700 border-purple-200 ring-purple-500/20 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  high: "bg-red-50 text-red-700 border-red-200 ring-red-500/20 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50",
  moderate: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/50",
  medium: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/50",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/50",
};

const impactDot = {
  extreme: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]",
  high: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  moderate: "bg-indigo-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const directionStyles = {
  bullish: "text-emerald-600 dark:text-emerald-400",
  bearish: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

const DirectionIcon = ({ direction }: { direction?: EconomicEvent["impact_direction"] }) => {
  if (!direction) return null;
  if (direction === "bullish") return <TrendingUp className="w-4 h-4" />;
  if (direction === "bearish") return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

// Event Detail View
const EventDetail = ({ event }: { event: EconomicEvent }) => {
  return (
    <div className="p-6 bg-muted/10">
      <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-border/30">
              <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20 w-1/4 lg:w-1/5">Source</td>
              <td className="py-3 px-4 font-medium">{event.source || 'N/A'}</td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20">Measures</td>
              <td className="py-3 px-4">{event.category || 'General Economic Health'}</td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20">Why Traders Care</td>
              <td className="py-3 px-4 leading-relaxed text-foreground/80">
                {event.summary || 'No detailed analysis available for this event yet.'}
              </td>
            </tr>
            {event.likely_affected_indices && event.likely_affected_indices.length > 0 && (
              <tr className="border-b border-border/30">
                <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20">Affected Indices</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {event.likely_affected_indices.map((idx, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] bg-primary/5">{idx}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {event.keywords && event.keywords.length > 0 && (
              <tr className="border-b border-border/30">
                <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20">Market Keywords</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-2">
                    {event.keywords.map((kw, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] bg-secondary/50 border-secondary">#{kw}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            )}
            <tr className="">
              <td className="py-3 px-4 font-semibold text-muted-foreground bg-muted/20">Further Reading</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-4">
                  {event.raw_news_id && (
                    <Link
                      href={`/news/${event.raw_news_id}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Full Report
                    </Link>
                  )}
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Source
                    </a>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mobile View component
const MobileEventCard = ({ event }: { event: EconomicEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = new Date(event.published_date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="group bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
              {time}
            </span>
            <Badge variant="outline" className="text-xs font-medium bg-background">
              {event.source}
            </Badge>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${impactStyles[event.impact_level] || impactStyles.low}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${impactDot[event.impact_level] || impactDot.low}`} />
              {event.impact_level}
            </div>
            {event.impact_direction && (
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider ${directionStyles[event.impact_direction]}`}>
                <DirectionIcon direction={event.impact_direction} />
                {event.impact_direction}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary transition-transform duration-300 shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-muted-foreground group-hover:text-primary/70 transition-transform duration-300 shrink-0" />
            )}
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180 text-primary" : "group-hover:text-primary/70"}`}
            />
          </div>
        </div>
        <h4 className="font-semibold text-base leading-snug text-foreground group-hover:text-primary transition-colors">
          {event.title}
        </h4>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Category:</span>
          <Badge variant="secondary" className="text-xs bg-muted/50 hover:bg-muted text-foreground/80 font-normal">
            {event.category}
          </Badge>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/30 animate-accordion-down">
          <EventDetail event={event} />
        </div>
      )}
    </div>
  );
};

// Desktop Row component
const DesktopEventRow = ({ event }: { event: EconomicEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = new Date(event.published_date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <>
      <tr
        className={`group border-b border-border/30 transition-all duration-300 cursor-pointer ${isExpanded
          ? "bg-primary/5 border-primary/20"
          : "hover:bg-muted/40 hover:translate-x-0.5 hover:shadow-sm"
          }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="py-4 px-6">
          <span className="font-mono text-xs sm:text-sm font-medium text-muted-foreground/80 bg-muted/30 px-2 py-1 rounded border border-border/50 group-hover:border-primary/20 transition-colors">
            {time}
          </span>
        </td>
        <td className="py-4 px-6">
          <Badge variant="outline" className="text-[10px] sm:text-xs font-medium bg-background/40 backdrop-blur-sm border-primary/20 text-primary/80">
            {event.source}
          </Badge>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-sm line-clamp-1 transition-colors ${isExpanded ? 'text-primary' : 'text-foreground/90 group-hover:text-foreground'}`}>
              {event.title}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 shrink-0 group-hover:text-primary/70 ${isExpanded ? "rotate-180 text-primary" : ""
                }`}
            />
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs font-semibold uppercase tracking-wide shadow-sm ${impactStyles[event.impact_level] || impactStyles.low}`}>
              <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] ${impactDot[event.impact_level] || impactDot.low}`} />
              {event.impact_level}
            </div>
            {event.impact_direction && (
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold uppercase ${directionStyles[event.impact_direction]}`}>
                <DirectionIcon direction={event.impact_direction} />
              </span>
            )}
          </div>
        </td>
        <td className="py-4 px-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded hover:bg-muted transition-colors group/btn"
          >
            {isExpanded ? (
              <FolderOpen className="w-5 h-5 text-primary" />
            ) : (
              <Folder className="w-5 h-5 text-muted-foreground group-hover/btn:text-primary transition-colors" />
            )}
          </button>
        </td>
        <td className="py-4 px-6 text-sm hidden lg:table-cell">
          <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider opacity-70">
            {event.category}
          </span>
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-border/50 bg-muted/20">
          <td colSpan={6} className="p-0">
            <EventDetail event={event} />
          </td>
        </tr>
      )}
    </>
  );
};

// Main Component
export const EventTable = ({ events, groupedByDate }: EventTableProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No events found for the selected date range</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {Array.from(groupedByDate.entries()).map(([dateStr, dateEvents]) => {
        // Treat dateStr (YYYY-MM-DD) as midnight IST
        const date = new Date(`${dateStr}T00:00:00+05:30`);

        // Format labels in IST
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
        const shortOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', weekday: 'short' };

        let dateLabel = new Intl.DateTimeFormat('en-IN', options).format(date);
        let shortDateLabel = new Intl.DateTimeFormat('en-IN', shortOptions).format(date);

        if (isToday(date)) {
          dateLabel = `Today, ${dateLabel}`;
          shortDateLabel = `Today, ${shortDateLabel}`;
        } else if (isYesterday(date)) {
          dateLabel = `Yesterday, ${dateLabel}`;
          shortDateLabel = `Yesterday, ${shortDateLabel}`;
        }

        return (
          <div key={dateStr} className="space-y-3 lg:space-y-4">
            <h3 className="text-base lg:text-lg font-semibold text-foreground italic">
              <span className="hidden sm:inline">{dateLabel}</span>
              <span className="sm:hidden">{shortDateLabel}</span>
            </h3>

            {/* Mobile View – Cards */}
            <div className="md:hidden space-y-3">
              {dateEvents.map((event, i) => (
                <MobileEventCard key={`${event.id || 'e'}-${i}`} event={event} />
              ))}
            </div>

            {/* Desktop View – Table */}
            <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-medium text-muted-foreground w-20">Time</th>
                      <th className="py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-medium text-muted-foreground w-32">Source</th>
                      <th className="py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-medium text-muted-foreground">Event</th>
                      <th className="py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-medium text-muted-foreground w-28">Impact</th>
                      <th className="py-3 px-3 lg:px-4 text-center text-xs lg:text-sm font-medium text-muted-foreground w-16">Detail</th>
                      <th className="py-3 px-3 lg:px-4 text-left text-xs lg:text-sm font-medium text-muted-foreground w-36 hidden lg:table-cell">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateEvents.map((event, i) => (
                      <DesktopEventRow key={`${event.id || 'e'}-${i}`} event={event} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
