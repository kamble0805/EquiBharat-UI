'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  publishTime: string;
}

interface NewsWidgetProps {
  compact?: boolean;
}

function ImpactDot({ impact }: { impact: NewsItem['impact'] }) {
  return (
    <span
      className={cn(
        'w-2 h-2 rounded-full shrink-0',
        impact === 'high' && 'bg-destructive',
        impact === 'medium' && 'bg-warning',
        impact === 'low' && 'bg-success'
      )}
    />
  );
}

export function NewsWidget({ compact = false }: NewsWidgetProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching widget news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const displayNews = compact ? news.slice(0, 3) : news;

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Latest News</h3>
        </div>
        <Link
          href="/news"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : displayNews.length > 0 ? (
          displayNews.map((news, index) => (
            <Link
              key={`${news.id}-${index}`}
              href={`/news/${news.id}`}
              className="block bg-secondary/50 rounded-lg p-4 hover:bg-secondary/80 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <ImpactDot impact={news.impact} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {news.headline}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{news.source}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span className="bg-accent px-2 py-0.5 rounded">{news.category}</span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {news.publishTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No news available</p>
        )}
      </div>
    </div>
  );
}
