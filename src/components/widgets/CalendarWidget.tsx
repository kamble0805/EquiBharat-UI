'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Loader2,
  AlertCircle,
  FolderOpen,
  Folder,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { 
  isAfter, 
  isBefore, 
  startOfDay, 
  endOfWeek, 
  addDays 
} from 'date-fns';

// ── Types ──────────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string;
  raw_news_id: string;
  title: string;
  source: string;
  category: string;
  link: string | null;
  published_date: string;
  simple_summary: string;
  overall_impact_level: 'high' | 'moderate' | 'medium' | 'low';
  impact_direction: 'positive' | 'negative' | 'neutral' | 'mixed' | null;
  likely_affected_indices: string[];
  likely_affected_sectors: string[];
}

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch('/api/calendar/events');
  if (!res.ok) throw new Error('Failed to load calendar events');
  return res.json();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ImpactBadge({ level }: { level: CalendarEvent['overall_impact_level'] }) {
  const map: Record<string, string> = {
    high: 'bg-red-500/15 text-red-400 border border-red-500/30',
    moderate: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };
  const label: Record<string, string> = {
    high: 'High', moderate: 'Moderate', medium: 'Medium', low: 'Low',
  };
  return (
    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0', map[level] ?? map.low)}>
      {label[level] ?? level}
    </span>
  );
}

function DirectionIcon({ direction }: { direction: CalendarEvent['impact_direction'] }) {
  if (direction === 'positive')
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  if (direction === 'negative')
    return <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
}

function TagList({ items, color }: { items: string[]; color: string }) {
  const safeItems = (items || []).filter((item): item is string => item !== null && item !== undefined && item !== '');
  if (safeItems.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {safeItems.map((item, idx) => (
        <span
          key={`${item}-${idx}`}
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-medium',
            color
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ── Main Widget ────────────────────────────────────────────────────────────────

interface CalendarWidgetProps {
  compact?: boolean;
}

export function CalendarWidget({ compact = false }: CalendarWidgetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: events = [], isLoading, isError } = useQuery<CalendarEvent[]>({
    queryKey: ['calendarWidgetEvents'],
    queryFn: fetchCalendarEvents,
    staleTime: 30 * 1000,   // 30 sec
    refetchInterval: 60 * 1000, // 1 min (60 sec)
  });

  // Filter for 'Upcoming This Week' events (Today onwards within the current week)
  const today = startOfDay(new Date());
  const SundayThisWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  const upcomingThisWeek = events
    .filter(event => {
      const eventDate = new Date(event.published_date);
      // Event is today or in the future AND before the end of this week
      return (isAfter(eventDate, today) || eventDate.toDateString() === today.toDateString()) && 
             isBefore(eventDate, addDays(SundayThisWeek, 1));
    })
    .sort((a, b) => new Date(a.published_date).getTime() - new Date(b.published_date).getTime());

  // Show Upcoming if available, else fallback to most recent
  const displayEvents = upcomingThisWeek.length > 0 
    ? upcomingThisWeek.slice(0, compact ? 4 : 6)
    : events.slice(0, compact ? 4 : 6);

  const todayLabel = upcomingThisWeek.length > 0
    ? "Upcoming This Week"
    : "Recent Intelligence";

  const formatEventTime = (event: CalendarEvent) => {
    if (event.source === 'Market Holiday') return 'All Day';
    return new Date(event.published_date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="widget-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Economic Calendar</h3>
        </div>
        <span className="text-xs text-muted-foreground">{todayLabel}</span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading events…</span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 py-6 text-destructive text-sm justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>Could not load events. Please try again.</span>
        </div>
      )}

      {/* Events List */}
      {!isLoading && !isError && (
        <>
          {displayEvents.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No events available.</p>
          ) : (
            <div className="space-y-2">
              {displayEvents.map((event, index) => (
                <div key={`${event.raw_news_id || 'no-id'}-${index}`} className="bg-secondary/50 rounded-lg overflow-hidden">
                  {/* Collapsed Row */}
                  <button
                    onClick={() => setExpandedId(expandedId === event.raw_news_id ? null : event.raw_news_id)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-secondary/80 transition-colors"
                  >
                    <span className="text-[10px] font-mono text-muted-foreground w-14 shrink-0 uppercase">
                      {formatEventTime(event)}
                    </span>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0 max-w-[80px] truncate">
                      {event.source.split('(')[0].trim()}
                    </span>
                    <span className="flex-1 text-sm text-foreground truncate">
                      {event.title}
                    </span>
                    <DirectionIcon direction={event.impact_direction} />
                    <ImpactBadge level={event.overall_impact_level} />
                    <div className="p-1 rounded hover:bg-secondary transition-colors">
                      {expandedId === event.raw_news_id ? (
                        <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedId === event.raw_news_id && (
                    <div className="px-4 pb-4 border-t border-border/50 bg-muted/20 animate-in slide-in-from-top-2 duration-200">
                      <table className="w-full text-[11px] sm:text-xs border-collapse mt-3">
                        <tbody>
                          <tr className="border-b border-border/30">
                            <td className="py-2 pr-3 font-semibold text-muted-foreground w-1/3">Source</td>
                            <td className="py-2">{event.source}</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 pr-3 font-semibold text-muted-foreground">Measures</td>
                            <td className="py-2">{event.category}</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 pr-3 font-semibold text-muted-foreground">Usual Effect</td>
                            <td className="py-2">
                              {event.impact_direction ? (
                                <span className={cn(
                                  "font-medium capitalize",
                                  event.impact_direction === 'positive' ? 'text-emerald-400' : 'text-red-400'
                                )}>
                                  {event.impact_direction === 'positive' ? 'Bullish' : 'Bearish'}
                                </span>
                              ) : 'N/A'}
                            </td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 pr-3 font-semibold text-muted-foreground align-top">Analysis</td>
                            <td className="py-2 leading-relaxed text-muted-foreground">
                              {event.simple_summary || 'No detailed analysis available.'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-3 font-semibold text-muted-foreground">Links</td>
                            <td className="py-2">
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/news/${event.raw_news_id}`}
                                  className="text-primary hover:underline font-medium"
                                >
                                  Report
                                </Link>
                                {event.link && (
                                  <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    Source
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* View All link */}
          <div className="mt-4 text-center">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              View full calendar
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
