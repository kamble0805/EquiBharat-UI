'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Clock, MessageCircle, Lock, Users,
  Plus, ArrowLeft, Send, Loader2, TrendingUp, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const CATEGORIES = ['All Topics', 'Monetary Policy', 'Technical Analysis', 'Fiscal Policy', 'Sector Analysis', 'General'];

interface Thread {
  id: string;
  title: string;
  category: string;
  replies: number;
  lastActivity: string;
  author: string;
}

interface Reply {
  id: string;
  content: string;
  author: string;
  timeAgo: string;
}

interface ThreadDetail {
  thread: { id: number; title: string; category: string; user_name: string; created_at: string };
  replies: Reply[];
}

// ─── New Thread Modal ─────────────────────────────────────────────────────────
function NewThreadModal({ onClose, onCreated, user }: {
  onClose: () => void;
  onCreated: () => void;
  user: any;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/forums/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, category, content,
          userName: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          userEmail: user?.email || '',
        }),
      });
      if (!res.ok) throw new Error('Failed to create');
      onCreated();
      onClose();
    } catch {
      setError('Failed to create thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Start a New Discussion</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. What does the RBI rate hold mean for equity markets?"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              maxLength={300}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {CATEGORIES.filter(c => c !== 'All Topics').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Your Post <span className="text-red-500">*</span></label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your analysis, question, or view..."
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Post Discussion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Thread View ──────────────────────────────────────────────────────────────
function ThreadView({ threadId, onBack, user, isLoggedIn }: {
  threadId: string; onBack: () => void; user: any; isLoggedIn: boolean;
}) {
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`/api/forums/threads/${threadId}`);
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data?.error || 'Thread not found.');
        return;
      }
      // Ensure replies is always an array
      setDetail({ ...data, replies: Array.isArray(data.replies) ? data.replies : [] });
    } catch {
      setFetchError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchThread(); }, [threadId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/forums/threads/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          userName: user?.name || user?.email?.split('@')[0] || 'Anonymous',
          userEmail: user?.email || '',
        }),
      });
      if (!res.ok) throw new Error();
      const newReply: Reply = await res.json();
      setDetail(d => d ? { ...d, replies: [...d.replies, newReply] } : d);
      setReplyContent('');
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setReplyError('Failed to post reply. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  );
  if (fetchError || !detail) return (
    <div className="text-center py-20 bg-card border border-border rounded-xl">
      <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
      <p className="font-medium text-foreground mb-1">Unable to load thread</p>
      <p className="text-sm text-muted-foreground mb-4">{fetchError || 'Thread not found.'}</p>
      <button onClick={fetchThread} className="text-sm text-primary hover:underline">Try again</button>
    </div>
  );

  const { thread, replies } = detail;
  const firstLetter = (name: string) => (name?.[0] || '?').toUpperCase();
  const colorFor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-red-500', 'bg-pink-500'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Title */}
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Discussions
      </button>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-primary/5">
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{thread.category}</span>
          <h2 className="text-2xl font-bold mt-3 text-foreground">{thread.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">Started by <span className="font-medium text-foreground">{thread.user_name}</span></p>
        </div>

        {/* Replies */}
        <div className="divide-y divide-border">
          {replies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <MessageSquare className="w-10 h-10 text-muted-foreground/20 mb-3" />
              <p className="font-medium text-foreground text-sm mb-1">No replies yet</p>
              <p className="text-xs text-muted-foreground">Be the first to respond to this discussion.</p>
            </div>
          ) : (
            replies.map((reply, i) => (
              <div key={reply.id} className={`p-6 flex gap-4 ${i === 0 ? 'bg-muted/30' : ''}`}>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${colorFor(reply.author)}`}>
                  {firstLetter(reply.author)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-sm">{reply.author}</span>
                    {i === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">OP</span>}
                    <span className="text-xs text-muted-foreground">{reply.timeAgo}</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reply Box */}
        {isLoggedIn ? (
          <form onSubmit={handleReply} className="p-6 border-t border-border">
            <p className="text-sm font-medium mb-2">Reply as <span className="text-primary">{user?.name || user?.email?.split('@')[0]}</span></p>
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Share your thoughts on this discussion..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none mb-3"
            />
            {replyError && <p className="text-red-500 text-sm mb-2">{replyError}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !replyContent.trim()}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Post Reply
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-3">Sign in to reply to this thread</p>
            <Button asChild size="sm"><Link href="/login">Sign In</Link></Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Forums Page ──────────────────────────────────────────────────────────────
const ForumsPage = () => {
  const { isLoggedIn, user, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All Topics');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forums/threads');
      const data = await res.json();
      setThreads(Array.isArray(data) ? data : []);
    } catch {
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchThreads(); }, []);

  const filteredThreads = activeCategory === 'All Topics'
    ? threads
    : threads.filter(t => t.category === activeCategory);

  if (selectedThread) {
    return (
      <div className="min-h-screen pt-32 md:pt-40 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <ThreadView
            threadId={selectedThread}
            onBack={() => setSelectedThread(null)}
            user={user}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-12">
      {showNewThread && (
        <NewThreadModal
          onClose={() => setShowNewThread(false)}
          onCreated={fetchThreads}
          user={user}
        />
      )}

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
              <MessageSquare className="w-8 h-8 text-primary" />
              Discussion Forums
            </h1>
            <p className="text-muted-foreground">Structured discussions on markets, policy, and economic analysis</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={fetchThreads} className="p-2 rounded-lg border border-border hover:bg-accent transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
            {isLoggedIn && (
              <Button onClick={() => setShowNewThread(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Discussion
              </Button>
            )}
          </div>
        </div>

        {!isLoggedIn ? (
          /* Login Required */
          <div className="bg-card border border-border rounded-2xl max-w-2xl mx-auto text-center py-16 px-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Join the Discussion</h2>
            <p className="text-muted-foreground mb-8">Sign in to read full threads, post replies, and start new discussions.</p>
            <Button asChild size="lg">
              <Link href="/login">Sign In to Continue</Link>
            </Button>

            {/* Preview */}
            <div className="mt-10 pt-8 border-t border-border text-left space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center mb-4">Recent Topics</p>
              {threads.slice(0, 3).map(t => (
                <div key={t.id} className="bg-muted/40 rounded-lg p-4 opacity-70 select-none">
                  <h4 className="font-medium text-foreground mb-1 text-sm">{t.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="bg-accent px-2 py-0.5 rounded">{t.category}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{t.replies} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main */}
            <div className="lg:col-span-3 space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Count */}
              <p className="text-sm text-muted-foreground">
                {loading ? 'Loading...' : `${filteredThreads.length} ${filteredThreads.length === 1 ? 'topic' : 'topics'}`}
              </p>

              {/* Threads */}
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-xl">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No discussions yet in this category</p>
                  <Button className="mt-4 gap-2" onClick={() => setShowNewThread(true)}>
                    <Plus className="w-4 h-4" />Start one
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredThreads.map(thread => (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base mb-2 line-clamp-2">
                            {thread.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="bg-accent px-2 py-0.5 rounded font-medium">{thread.category}</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />{thread.replies} {thread.replies === 1 ? 'reply' : 'replies'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />{thread.lastActivity}
                            </span>
                            {thread.author && (
                              <span>by <span className="text-foreground font-medium">{thread.author}</span></span>
                            )}
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* My Activity */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Community Stats
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Topics</span>
                    <span className="font-semibold">{threads.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Replies</span>
                    <span className="font-semibold">{threads.reduce((a, t) => a + t.replies, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3">Guidelines</h3>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• No stock tips or price predictions</li>
                  <li>• Respectful discussion only</li>
                  <li>• Cite your sources when possible</li>
                  <li>• No promotional content</li>
                </ul>
              </div>

              {/* Start Discussion CTA */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                <h3 className="font-semibold text-sm text-primary mb-2">Have a question?</h3>
                <p className="text-xs text-muted-foreground mb-3">Start a new thread and get insights from the community.</p>
                <Button size="sm" className="w-full gap-2" onClick={() => setShowNewThread(true)}>
                  <Plus className="w-3.5 h-3.5" />New Discussion
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumsPage;
