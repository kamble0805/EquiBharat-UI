'use client';

import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { useQuery } from '@tanstack/react-query';
import { FilterPanel } from "@/components/economic-calendar/FilterPanel";
import { DateRangeFilter } from "@/components/economic-calendar/DateRangeFilter";
import { PremiumEconomicCalendar, PremiumEvent } from "@/components/economic-calendar/PremiumEconomicCalendar";
import { EconomicEvent } from "@/components/economic-calendar/EventTable";
import { Loader2 } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
  format
} from "date-fns";

const fetchCalendarEvents = async (): Promise<EconomicEvent[]> => {
  const response = await fetch('/api/calendar/events');
  if (!response.ok) {
    throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
  }
  const data = await response.json();

  // Map backend fields to the EconomicEvent shape used by the UI
  const events = Array.isArray(data) ? data : (data.events ?? []);
  return events.map((item: any): PremiumEvent => ({
    id: String(item.id ?? item.news_event_ai_id ?? ''),
    raw_news_id: String(item.raw_news_id ?? item.news_event_id ?? item.id ?? ''),
    source: item.source ?? item.feed_name ?? '',
    title: item.title ?? item.headline ?? '',
    summary: item.simple_summary ?? item.summary ?? '',
    category: item.category ?? item.event_type ?? 'General',
    impact_level: (item.overall_impact_level ?? item.impact_level ?? 'low') as EconomicEvent['impact_level'],
    impact_direction: (item.impact_direction ?? null) as EconomicEvent['impact_direction'],
    likely_affected_indices: item.likely_affected_indices || [],
    likely_affected_sectors: item.likely_affected_sectors || [],
    keywords: item.keywords || [],
    published_date: item.published_date ?? item.created_at ?? new Date().toISOString(),
    link: item.link ?? item.url ?? null,
    // Premium fields
    currency: item.currency ?? (item.title?.includes('RBI') || item.source?.includes('PIB') ? 'INR' : 'USD'),
    usual_effect: item.usual_effect,
    why_traders_care: item.why_traders_care,
    technical_notes: item.technical_notes,
    speaker: item.speaker,
    verify_link: item.verify_link
  }));
};

const CalendarPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("This Week");
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfWeek(new Date(), { weekStartsOn: 1 }),
    to: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImpact, setSelectedImpact] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  const { data: events = [], isLoading, isError } = useQuery<PremiumEvent[], Error>({
    queryKey: ['calendarEvents'],
    queryFn: fetchCalendarEvents,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000,       // Consider data fresh for 2 minutes
  });

  // Extract dynamic filters from data
  const availableKeywords = Array.from(new Set(events.flatMap(e => e.keywords || []))).sort();
  const availableSectors = Array.from(new Set(events.flatMap(e => e.likely_affected_sectors || []))).sort();

  const getDateRange = (range: string) => {
    const now = new Date();

    if (range === "Custom") {
      return {
        start: date?.from ? startOfDay(date.from) : startOfDay(now),
        end: date?.to ? endOfDay(date.to) : endOfDay(now)
      };
    }

    switch (range) {
      case "Last Week":
        const lastWeek = subDays(now, 7);
        return {
          start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          end: endOfWeek(lastWeek, { weekStartsOn: 1 })
        };
      case "Yesterday":
        return {
          start: startOfDay(subDays(now, 1)),
          end: endOfDay(subDays(now, 1))
        };
      case "Today":
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        };
      case "This Week":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
      case "Upcoming Week":
        const nextWeek = addDays(now, 7);
        return {
          start: startOfWeek(nextWeek, { weekStartsOn: 1 }),
          end: endOfWeek(nextWeek, { weekStartsOn: 1 })
        };
      default:
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        };
    }
  };

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleImpact = (impact: string) => {
    setSelectedImpact((prev) =>
      prev.includes(impact) ? prev.filter((i) => i !== impact) : [...prev, impact]
    );
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const clearAllFilters = () => {
    setSelectedSources([]);
    setSelectedCategories([]);
    setSelectedImpact([]);
    setSelectedKeywords([]);
  };

  const filteredEvents = (events || []).filter((event): event is PremiumEvent => {
    if (!event?.published_date) return false;

    try {
      const eventDate = new Date(event.published_date);
      const { start, end } = getDateRange(selectedRange);

      const isInDateRange = isWithinInterval(eventDate, { start, end });

      const matchesSource = selectedSources.length === 0 ||
        (event.source && selectedSources.includes(event.source));

      // Matches hardcoded category OR dynamic sector
      const matchesCategory = selectedCategories.length === 0 ||
        (event.category && selectedCategories.includes(event.category)) ||
        (event.likely_affected_sectors && event.likely_affected_sectors.some(s => selectedCategories.includes(s)));

      const matchesImpact = selectedImpact.length === 0 ||
        (event.impact_level && selectedImpact.includes(event.impact_level));

      const matchesKeywords = selectedKeywords.length === 0 ||
        (event.keywords && event.keywords.some(k => selectedKeywords.includes(k)));

      return isInDateRange && matchesSource && matchesCategory && matchesImpact && matchesKeywords;
    } catch (error) {
      console.error('Error filtering event:', event, error);
      return false;
    }
  });

  // Note: Grouping and sorting is now handled internally by PremiumEconomicCalendar

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-8 bg-gradient-premium animate-fade-in">
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedSources={selectedSources}
        selectedCategories={selectedCategories}
        selectedImpact={selectedImpact}
        selectedKeywords={selectedKeywords}
        availableKeywords={availableKeywords}
        availableSectors={availableSectors}
        onSourceToggle={toggleSource}
        onCategoryToggle={toggleCategory}
        onImpactToggle={toggleImpact}
        onKeywordToggle={toggleKeyword}
        onClearAll={clearAllFilters}
      />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-3">
              Economic Calendar
            </h1>
            <div className="text-xs sm:text-sm text-muted-foreground">
              (GMT +05:30) Asia/Calcutta
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <DateRangeFilter
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
              date={date}
              setDate={setDate}
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Filters
                {(selectedSources.length > 0 || selectedCategories.length > 0 || selectedImpact.length > 0 || selectedKeywords.length > 0) && (
                  <span className="ml-2 rounded-full bg-primary w-2 h-2" />
                )}
              </button>

              {(selectedSources.length > 0 || selectedCategories.length > 0 || selectedImpact.length > 0 || selectedKeywords.length > 0) && (
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Showing {filteredEvents.length} events
                </p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-destructive">Error loading events. Please try again later.</p>
            </div>
          ) : (
            <PremiumEconomicCalendar events={filteredEvents} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
