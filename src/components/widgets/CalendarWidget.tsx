'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { 
  Calendar,
  Loader2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  isAfter, 
  isBefore, 
  startOfDay, 
  endOfWeek, 
  addDays 
} from 'date-fns';
import { PremiumEconomicCalendar, PremiumEvent } from '@/components/economic-calendar/PremiumEconomicCalendar';

// ── Types ──────────────────────────────────────────────────────────────────────

type CalendarEvent = PremiumEvent;

// ── Data Fetching ──────────────────────────────────────────────────────────────

async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const res = await fetch('/api/calendar/events');
  if (!res.ok) throw new Error('Failed to load calendar events');
  return res.json();
}

// ── Main Widget ────────────────────────────────────────────────────────────────

interface CalendarWidgetProps {
  compact?: boolean;
}

export function CalendarWidget({ compact = false }: CalendarWidgetProps) {
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

      {/* Unified Premium Table in Compact Mode */}
      {!isLoading && !isError && (
        <>
          {displayEvents.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">No events available.</p>
          ) : (
            <PremiumEconomicCalendar events={displayEvents} compact={true} />
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
