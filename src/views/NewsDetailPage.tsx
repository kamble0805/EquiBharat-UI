'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink, Tag, Calendar, Lock, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

// ────────────────────────────────────────────────────────────────────────────
// Type – mirrors the shape returned by GET /news/:id from the backend
// ────────────────────────────────────────────────────────────────────────────
interface RawNewsArticle {
  id: string | number;
  title?: string;
  headline?: string;
  source?: string;
  category?: string;
  impact?: string;
  published_date?: string;
  fullContent?: string;
  summary?: string;
  externalUrl?: string;
  imageUrl?: string;
  keywords?: string[] | string;
  isAiProcessed?: boolean;
  aiIntelligence?: {
    summary?: string;
    who_is_affected?: string;
    market_impact_explanation?: string;
    contrarian_view?: string;
    likelyAffectedIndices?: string[];
    likelyAffectedSectors?: string[];
    impactDirection?: string;
    confidenceLevel?: number;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Helper components
// ────────────────────────────────────────────────────────────────────────────
function ImpactBadge({ impact, direction }: { impact?: string, direction?: string }) {
  if (!impact) return null;

  const getDirectionColors = () => {
    if (!direction) return '';
    const dir = direction.toLowerCase();
    if (dir.includes('bullish') || dir.includes('positive') || dir.includes('up'))
      return 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10';
    if (dir.includes('bearish') || dir.includes('negative') || dir.includes('down'))
      return 'border-red-500/50 text-red-500 bg-red-500/10';
    return 'border-blue-500/50 text-blue-500 bg-blue-500/10';
  };

  const impactValue = impact.toLowerCase();

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all',
          impactValue === 'extreme' && 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.1)]',
          impactValue === 'high' && 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_12px_rgba(239,68,68,0.1)]',
          impactValue === 'moderate' && 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
          impactValue === 'medium' && 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          impactValue === 'low' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        )}
      >
        {impact}
      </span>
      {direction && (
        <span className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border', getDirectionColors())}>
          {direction}
        </span>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main page component
// ────────────────────────────────────────────────────────────────────────────
const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<RawNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error(`Article not found (${response.status})`);
        }
        const data: RawNewsArticle = await response.json();
        setArticle(data);
      } catch (err: any) {
        console.error('Error fetching news article:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm tracking-widest uppercase font-bold text-primary/50">Analyzing Article…</span>
        </div>
      </div>
    );
  }

  // ── Error / not found state ────────────────────────────────────────────────
  if (error || !article) {
    return (
      <div className="min-h-screen pt-20 pb-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          {error && <p className="text-sm text-muted-foreground">{error}</p>}
          <Link href="/news">
            <Button>Back to News Feed</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Normalise fields ────────────────────────────────────────────────────────
  const headline = article.title ?? article.headline ?? 'Untitled Report';
  const source = article.source ?? '';
  const impact = article.impact;
  const category = article.category ?? 'Market News';
  const publishDate = article.published_date;
  const externalUrl = article.externalUrl ?? '';
  const imageUrl = article.imageUrl ?? '';
  const keywords: string[] = Array.isArray(article.keywords)
    ? article.keywords
    : typeof article.keywords === 'string'
      ? article.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

  const fullText = article.fullContent || article.summary || '';
  const allParagraphs = fullText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const paragraphs = isLoggedIn
    ? allParagraphs
    : allParagraphs.slice(0, Math.max(1, Math.floor(allParagraphs.length / 2)));

  const isRestricted = !isLoggedIn && allParagraphs.length > paragraphs.length;
  const ai = article.aiIntelligence;

  return (
    <div className="min-h-screen pt-32 pb-8 bg-zinc-950/20">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Back button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-all text-xs font-bold uppercase tracking-widest group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Market Intelligence
        </Link>

        <article>
          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {impact && <ImpactBadge impact={impact} direction={ai?.impactDirection} />}
              {category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-zinc-800/50 border border-zinc-700/50 px-3 py-1 rounded-md">
                  {category}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-[1.15] tracking-tight">
              {headline}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[9px]">
                  {source.charAt(0)}
                </div>
                <span className="text-primary">{source}</span>
              </div>
              {publishDate && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(publishDate).toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(publishDate).toLocaleTimeString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </div>
                </>
              )}
            </div>
          </header>

          {/* AI INTELLIGENCE REPORT SECTION - MATCHING SCREENSHOT BUT THEME AWARE */}
          {ai && (
            <div className="mb-12 p-8 rounded-2xl dark:bg-[#030e16]/80 bg-[#f0f8ff] backdrop-blur-sm border dark:border-cyan-900/40 border-cyan-200 shadow-xl dark:shadow-cyan-500/5 transition-colors relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-1 px-1.5 dark:bg-cyan-500/10 bg-cyan-600/10 rounded-lg border dark:border-cyan-500/20 border-cyan-600/20">
                  <Bot className="w-5 h-5 dark:text-cyan-400 text-cyan-700" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.15em] dark:text-cyan-400 text-cyan-700">AI Intelligence Report</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                {/* Indices */}
                <div>
                  <h4 className="text-[10px] font-black dark:text-slate-400/80 text-slate-500/80 uppercase tracking-[0.1em] mb-4">
                    Affected Indices
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {ai.likelyAffectedIndices && ai.likelyAffectedIndices.length > 0 ? (
                      ai.likelyAffectedIndices.map(idx => (
                        <span key={idx} className="px-3.5 py-1.5 rounded-lg dark:bg-zinc-950/80 bg-white border dark:border-zinc-800 border-zinc-200 text-xs font-bold dark:text-zinc-100 text-zinc-900 shadow-sm transition-colors">
                          {idx}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic tracking-wide">No specific indices identified</span>
                    )}
                  </div>
                </div>

                {/* Sectors */}
                <div>
                  <h4 className="text-[10px] font-black dark:text-slate-400/80 text-slate-500/80 uppercase tracking-[0.1em] mb-4">
                    Impacted Sectors
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {ai.likelyAffectedSectors && ai.likelyAffectedSectors.length > 0 ? (
                      ai.likelyAffectedSectors.map(s => (
                        <span key={s} className="px-3.5 py-1.5 rounded-lg dark:bg-zinc-950/80 bg-white border dark:border-zinc-800 border-zinc-200 text-xs font-bold dark:text-zinc-100 text-zinc-900 shadow-sm transition-colors">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic tracking-wide">General market impact expected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured image */}
          {imageUrl && (
            <div className="rounded-xl overflow-hidden mb-8">
              <img
                src={imageUrl}
                alt={headline}
                className="w-full aspect-video object-cover"
              />
            </div>
          )}

          {/* Full article body */}
          <div className="relative">
            {paragraphs.length > 0 ? (
              <div className={cn("prose prose-invert max-w-none space-y-4", isRestricted && "mask-fade-bottom")}>
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-secondary-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Full content is not available for this article.
              </p>
            )}

            {isRestricted && (
              <div className="mt-8 p-8 border border-primary/20 bg-primary/5 rounded-xl text-center space-y-4 relative z-10">
                <div className="inline-flex p-3 bg-primary/10 rounded-full mb-2">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Unlock Complete Analysis</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You are reading a preview of this market intelligence. Sign in to access full content, research, and sector impact reports.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link href="/login">
                    <Button variant="default" className="px-8 py-6 h-auto text-lg font-bold min-w-[160px]">
                      Sign In to Read
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="px-8 py-6 h-auto text-lg min-w-[160px]">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                Keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External source link */}
          {externalUrl && (
            <div className="mt-8 pt-6 border-t border-border">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Original Article {source ? `on ${source}` : ''}
                </Button>
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage;
