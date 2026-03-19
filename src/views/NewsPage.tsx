'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Clock, Loader2, Search } from 'lucide-react';
import { type NewsItem } from '@/types';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function ImpactBadge({ impact }: { impact: NewsItem['impact'] }) {
  return (
    <span
      className={cn(
        'impact-badge',
        impact === 'extreme' && 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        impact === 'high' && 'impact-high',
        impact === 'moderate' && 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        impact === 'medium' && 'impact-medium',
        impact === 'low' && 'impact-low'
      )}
    >
      {impact.charAt(0).toUpperCase() + impact.slice(1)}
    </span>
  );
}

const NewsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Compute categories dynamically from the data
  // We'll take unique sectors and the top most frequent keywords
  const categories = ['All'];
  const sectors = Array.from(new Set(news.map(n => n.category))).filter((c): c is string => !!c && c !== 'General');
  categories.push(...sectors);

  // Filter logic
  const filteredNews = news.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      item.headline.toLowerCase().includes(searchLower) ||
      item.summary.toLowerCase().includes(searchLower) ||
      (item.keywords && item.keywords.some(k => k.toLowerCase().includes(searchLower))) ||
      (item.sectors && item.sectors.some(s => s.toLowerCase().includes(searchLower)));

    const matchesCategory = activeCategory === 'All' ||
      item.category === activeCategory ||
      (item.keywords && item.keywords.includes(activeCategory)) ||
      (item.sectors && item.sectors.includes(activeCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Newspaper className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Market Intelligence</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Expert analysis and real-time updates on Indian economic developments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search keywords, indices, companies..."
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Tabs / Filters */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="hidden md:block text-sm text-muted-foreground font-medium">
              Showing {filteredNews.length} Intelligence Reports
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="widget-card h-80 animate-pulse bg-card/50" />
            ))
          ) : filteredNews.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              {item.imageUrl ? (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-60" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-primary/20" />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ImpactBadge impact={item.impact} />
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {item.headline}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-1">
                  {item.summary}
                </p>

                {/* Keywords Tags */}
                {item.keywords && item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.keywords.slice(0, 3).map(kw => (
                      <span key={kw} className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-medium border border-border/50">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {item.source.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground opacity-70">
                    <Clock className="w-3.5 h-3.5" />
                    {item.publishTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-32 bg-card/50 rounded-3xl border border-dashed border-border mt-8">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No matching reports found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-8">
              We couldn't find any intelligence reports matching your search or filter criteria.
            </p>
            <Button
              variant="default"
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="rounded-full px-8"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
