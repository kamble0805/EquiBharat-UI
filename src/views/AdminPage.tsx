'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
    Shield, Newspaper, Users, Plus, Pencil, Trash2, Loader2,
    ChevronLeft, Eye, Bot, AlertCircle, X, Check, Search,
    RefreshCw, UserPlus, Crown, UserCheck, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsItem {
    id: string;
    headline: string;
    summary: string;
    fullContent?: string;
    source: string;
    category: string;
    impact: 'high' | 'medium' | 'low';
    publishTime: string;
    published_at?: string;
    imageUrl?: string | null;
    isAdminPost: boolean;
    isAiProcessed: boolean;
    externalUrl?: string;
}

interface UserItem {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    jobTitle: string;
    bio: string;
    plan: string;
    role: string;
    createdAt: string;
}

type Tab = 'news' | 'users';
type NewsFilter = 'all' | 'raw' | 'processed' | 'admin';

// ─── Sub-components ────────────────────────────────────────────────────────────

function ImpactDot({ impact }: { impact: string }) {
    return (
        <span className={cn(
            'inline-block w-2.5 h-2.5 rounded-full',
            impact === 'high' && 'bg-red-500',
            impact === 'medium' && 'bg-amber-500',
            impact === 'low' && 'bg-emerald-500',
        )} />
    );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'admin' | 'ai' | 'success' | 'warning' }) {
    return (
        <span className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
            variant === 'default' && 'bg-secondary text-muted-foreground border-border',
            variant === 'admin' && 'bg-violet-500/15 text-violet-400 border-violet-500/30',
            variant === 'ai' && 'bg-blue-500/15 text-blue-400 border-blue-500/30',
            variant === 'success' && 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            variant === 'warning' && 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        )}>
            {children}
        </span>
    );
}

// ─── News Form Modal ───────────────────────────────────────────────────────────

interface NewsFormProps {
    news?: NewsItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

function NewsForm({ news, onClose, onSuccess }: NewsFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: news?.headline || '',
        summary: news?.summary || '',
        content: news?.fullContent || '',
        source: news?.source || 'Admin',
        source_url: news?.externalUrl || '',
        sector: news?.category || 'General',
        impact_level: news?.impact || 'low',
        image_url: news?.imageUrl || '',
        is_admin_post: news?.isAdminPost ?? true,
        is_ai_processed: news?.isAiProcessed ?? false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = news ? `/api/admin/news/${news.id}` : '/api/admin/news';
            const method = news ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            toast({ title: news ? 'News Updated' : 'News Created', description: 'Operation successful.' });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition';
    const labelCls = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">{news ? 'Edit News Article' : 'Create News Article'}</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className={labelCls}>Title *</label>
                        <input className={inputCls} required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="News headline..." />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className={labelCls}>Summary</label>
                        <textarea className={cn(inputCls, 'resize-none')} rows={3} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="Brief summary..." />
                    </div>

                    {/* Full Content */}
                    <div>
                        <label className={labelCls}>Full Content</label>
                        <textarea className={cn(inputCls, 'resize-none')} rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full article content..." />
                    </div>

                    {/* Row: Source + URL */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Source</label>
                            <input className={inputCls} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. RBI, Admin..." />
                        </div>
                        <div>
                            <label className={labelCls}>Source URL</label>
                            <input className={inputCls} type="url" value={form.source_url} onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))} placeholder="https://..." />
                        </div>
                    </div>

                    {/* Row: Sector + Impact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Sector / Category</label>
                            <select className={inputCls} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                                <option>General</option>
                                <option>Central Bank</option>
                                <option>Markets</option>
                                <option>Economic Indicator</option>
                                <option>Corporate</option>
                                <option>Commodities</option>
                                <option>Currency</option>
                                <option>Geopolitics</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Impact Level</label>
                            <select className={inputCls} value={form.impact_level} onChange={e => setForm(f => ({ ...f, impact_level: e.target.value as 'high' | 'medium' | 'low' }))}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className={labelCls}>Image URL</label>
                        <input className={inputCls} type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
                    </div>

                    {/* Flags */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                className={cn('w-10 h-5 rounded-full transition-colors relative', form.is_admin_post ? 'bg-violet-500' : 'bg-border')}
                                onClick={() => setForm(f => ({ ...f, is_admin_post: !f.is_admin_post }))}
                            >
                                <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.is_admin_post ? 'translate-x-5' : 'translate-x-0.5')} />
                            </div>
                            <span className="text-sm text-foreground">Admin Post</span>
                            <span className="text-xs text-muted-foreground">(News page only)</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                className={cn('w-10 h-5 rounded-full transition-colors relative', form.is_ai_processed ? 'bg-blue-500' : 'bg-border')}
                                onClick={() => setForm(f => ({ ...f, is_ai_processed: !f.is_ai_processed }))}
                            >
                                <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.is_ai_processed ? 'translate-x-5' : 'translate-x-0.5')} />
                            </div>
                            <span className="text-sm text-foreground">AI Processed</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {news ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Process Modal ─────────────────────────────────────────────────────────────

interface ProcessFormProps {
    news: NewsItem;
    onClose: () => void;
    onSuccess: () => void;
}

function ProcessForm({ news, onClose, onSuccess }: ProcessFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        summary: news.summary || '',
        content: news.fullContent || '',
        sector: news.category || 'General',
        impact_level: news.impact || 'low',
        keywords: '',
        sectors: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const keywords = form.keywords ? form.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
            const sectors = form.sectors ? form.sectors.split(',').map(s => s.trim()).filter(Boolean) : [];
            const res = await fetch(`/api/admin/news/${news.id}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, keywords, sectors }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            toast({ title: 'Processed', description: 'News marked as AI processed.' });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition';
    const labelCls = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-foreground">Manual AI Process</h2>
                            <p className="text-xs text-muted-foreground line-clamp-1">{news.headline}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={labelCls}>AI Summary</label>
                        <textarea className={cn(inputCls, 'resize-none')} rows={3} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="AI-enriched summary..." />
                    </div>
                    <div>
                        <label className={labelCls}>Full Analysis / Content</label>
                        <textarea className={cn(inputCls, 'resize-none')} rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Detailed analysis..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Sector</label>
                            <select className={inputCls} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                                <option>General</option>
                                <option>Central Bank</option>
                                <option>Markets</option>
                                <option>Economic Indicator</option>
                                <option>Corporate</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Impact</label>
                            <select className={inputCls} value={form.impact_level} onChange={e => setForm(f => ({ ...f, impact_level: e.target.value as 'high' | 'medium' | 'low' }))}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Keywords (comma-separated)</label>
                        <input className={inputCls} value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="RBI, inflation, repo rate..." />
                    </div>
                    <div>
                        <label className={labelCls}>Sectors (comma-separated)</label>
                        <input className={inputCls} value={form.sectors} onChange={e => setForm(f => ({ ...f, sectors: e.target.value }))} placeholder="Banking, IT, Auto..." />
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                            Mark as Processed
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── User Form Modal ───────────────────────────────────────────────────────────

interface UserFormProps {
    user?: UserItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

function UserForm({ user, onClose, onSuccess }: UserFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        jobTitle: user?.jobTitle || '',
        bio: user?.bio || '',
        plan: user?.plan || 'free',
        role: user?.role || 'user',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = user ? `/api/admin/users/${user.id}` : '/api/admin/users';
            const method = user ? 'PATCH' : 'POST';

            const body: any = { ...form };
            if (!body.password) delete body.password;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');

            toast({ title: user ? 'User Updated' : 'User Created', description: 'Operation successful.' });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const inputCls = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition';
    const labelCls = 'block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">{user ? 'Edit User' : 'Create User'}</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Name *</label>
                            <input className={inputCls} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" />
                        </div>
                        <div>
                            <label className={labelCls}>Email *</label>
                            <input className={inputCls} type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Phone</label>
                            <input className={inputCls} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91..." />
                        </div>
                        <div>
                            <label className={labelCls}>{user ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                            <input className={inputCls} type="password" required={!user} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Job Title</label>
                        <input className={inputCls} value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} placeholder="e.g. Financial Analyst" />
                    </div>

                    <div>
                        <label className={labelCls}>Bio</label>
                        <textarea className={cn(inputCls, 'resize-none')} rows={2} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Plan</label>
                            <select className={inputCls} value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Role</label>
                            <select className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-border">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {user ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

interface DeleteConfirmProps {
    label: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading: boolean;
}

function DeleteConfirm({ label, onCancel, onConfirm, loading }: DeleteConfirmProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Confirm Delete</h3>
                        <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6 bg-secondary/50 rounded-lg p-3 border border-border">
                    <strong className="text-foreground">"{label}"</strong> will be permanently deleted.
                </p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
                    <Button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
    const { isLoggedIn, isAdmin } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<Tab>('news');
    const [newsFilter, setNewsFilter] = useState<NewsFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [news, setNews] = useState<NewsItem[]>([]);
    const [users, setUsers] = useState<UserItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [editingNews, setEditingNews] = useState<NewsItem | null | undefined>(undefined);
    const [editingUser, setEditingUser] = useState<UserItem | null | undefined>(undefined);
    const [processingNews, setProcessingNews] = useState<NewsItem | null>(null);
    const [deletingNews, setDeletingNews] = useState<NewsItem | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

    // Guard: redirect non-admins
    useEffect(() => {
        if (!isLoggedIn) { router.push('/login'); return; }
        if (!isAdmin) { router.push('/'); return; }
    }, [isLoggedIn, isAdmin, router]);

    const fetchNews = useCallback(async () => {
        setNewsLoading(true);
        try {
            const res = await fetch('/api/admin/news');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setNews(data);
        } catch {
            toast({ title: 'Error', description: 'Failed to load news', variant: 'destructive' });
        } finally {
            setNewsLoading(false);
        }
    }, [toast]);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setUsers(data);
        } catch {
            toast({ title: 'Error', description: 'Failed to load users', variant: 'destructive' });
        } finally {
            setUsersLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchNews(); }, [fetchNews]);
    useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab, fetchUsers]);

    // Filtered news
    const filteredNews = news.filter(n => {
        const matchesFilter =
            newsFilter === 'all' ? true :
                newsFilter === 'raw' ? !n.isAiProcessed :
                    newsFilter === 'processed' ? n.isAiProcessed :
                        newsFilter === 'admin' ? n.isAdminPost : true;
        const matchesSearch = !searchQuery ||
            n.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Filtered users
    const filteredUsers = users.filter(u => {
        return !searchQuery ||
            (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleDeleteNews = async () => {
        if (!deletingNews) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/news/${deletingNews.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast({ title: 'Deleted', description: 'News item removed.' });
            setDeletingNews(null);
            fetchNews();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${deletingUser.id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast({ title: 'Deleted', description: 'User removed.' });
            setDeletingUser(null);
            fetchUsers();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        } finally {
            setActionLoading(false);
        }
    };

    if (!isLoggedIn || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const newsFilterOptions: { key: NewsFilter; label: string; icon: React.ReactNode }[] = [
        { key: 'all', label: 'All', icon: <Newspaper className="w-3.5 h-3.5" /> },
        { key: 'raw', label: 'Raw', icon: <AlertCircle className="w-3.5 h-3.5" /> },
        { key: 'processed', label: 'AI Processed', icon: <Bot className="w-3.5 h-3.5" /> },
        { key: 'admin', label: 'Admin Posts', icon: <Shield className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="min-h-screen pt-28 pb-12">
            {/* Modals */}
            {editingNews !== undefined && (
                <NewsForm
                    news={editingNews}
                    onClose={() => setEditingNews(undefined)}
                    onSuccess={fetchNews}
                />
            )}
            {processingNews && (
                <ProcessForm
                    news={processingNews}
                    onClose={() => setProcessingNews(null)}
                    onSuccess={fetchNews}
                />
            )}
            {deletingNews && (
                <DeleteConfirm
                    label={deletingNews.headline}
                    onCancel={() => setDeletingNews(null)}
                    onConfirm={handleDeleteNews}
                    loading={actionLoading}
                />
            )}
            {editingUser !== undefined && (
                <UserForm
                    user={editingUser}
                    onClose={() => setEditingUser(undefined)}
                    onSuccess={fetchUsers}
                />
            )}
            {deletingUser && (
                <DeleteConfirm
                    label={deletingUser.name || deletingUser.email}
                    onCancel={() => setDeletingUser(null)}
                    onConfirm={handleDeleteUser}
                    loading={actionLoading}
                />
            )}

            <div className="container mx-auto px-4">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin Panel</h1>
                            <p className="text-sm text-muted-foreground">EquiBharat content & user management</p>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                        {[
                            { label: 'Total News', value: news.length, icon: <Newspaper className="w-4 h-4" />, color: 'text-primary' },
                            { label: 'Raw News', value: news.filter(n => !n.isAiProcessed).length, icon: <AlertCircle className="w-4 h-4" />, color: 'text-amber-400' },
                            { label: 'AI Processed', value: news.filter(n => n.isAiProcessed).length, icon: <Bot className="w-4 h-4" />, color: 'text-blue-400' },
                            { label: 'Admin Posts', value: news.filter(n => n.isAdminPost).length, icon: <Shield className="w-4 h-4" />, color: 'text-violet-400' },
                        ].map(stat => (
                            <div key={stat.label} className="widget-card p-4 flex items-center gap-3">
                                <div className={cn('opacity-80', stat.color)}>{stat.icon}</div>
                                <div>
                                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 mb-6 bg-secondary/50 p-1 rounded-xl w-fit">
                    {([
                        { key: 'news' as Tab, label: 'News Management', icon: <Newspaper className="w-4 h-4" /> },
                        { key: 'users' as Tab, label: 'User Management', icon: <Users className="w-4 h-4" /> },
                    ]).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                activeTab === tab.key
                                    ? 'bg-card text-foreground shadow-sm border border-border'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════════════ NEWS TAB ══════════════════════ */}
                {activeTab === 'news' && (
                    <div>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            {/* Filter Pills */}
                            <div className="flex flex-wrap gap-1.5">
                                {newsFilterOptions.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => setNewsFilter(opt.key)}
                                        className={cn(
                                            'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                                            newsFilter === opt.key
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                                        )}
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        className="bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 w-48"
                                        placeholder="Search news..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={fetchNews} title="Refresh">
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button onClick={() => setEditingNews(null)} className="gap-2 shrink-0">
                                    <Plus className="w-4 h-4" />
                                    Add News
                                </Button>
                            </div>
                        </div>

                        {/* News count */}
                        <p className="text-xs text-muted-foreground mb-3">
                            Showing {filteredNews.length} of {news.length} articles
                        </p>

                        {/* News Table */}
                        {newsLoading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : filteredNews.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No news found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredNews.map(item => (
                                    <div
                                        key={item.id}
                                        className="widget-card p-4 flex items-start gap-4 group"
                                    >
                                        {/* Impact dot */}
                                        <div className="pt-1 shrink-0"><ImpactDot impact={item.impact} /></div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                {item.isAdminPost && <Badge variant="admin">Admin Post</Badge>}
                                                {item.isAiProcessed && <Badge variant="ai">AI Processed</Badge>}
                                                <Badge>{item.category}</Badge>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{item.headline}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                                <span>{item.source}</span>
                                                <span>·</span>
                                                <span>{item.publishTime}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!item.isAiProcessed && (
                                                <button
                                                    onClick={() => setProcessingNews(item)}
                                                    title="Manual AI Process"
                                                    className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                                                >
                                                    <Bot className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingNews(item)}
                                                title="Edit"
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingNews(item)}
                                                title="Delete"
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════════════ USERS TAB ══════════════════════ */}
                {activeTab === 'users' && (
                    <div>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <p className="text-sm text-muted-foreground">{users.length} registered users</p>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <input
                                        className="bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 w-48"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="ghost" size="icon" onClick={fetchUsers} title="Refresh">
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button onClick={() => setEditingUser(null)} className="gap-2 shrink-0">
                                    <UserPlus className="w-4 h-4" />
                                    Add User
                                </Button>
                            </div>
                        </div>

                        {/* Users Grid */}
                        {usersLoading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredUsers.map(u => (
                                    <div key={u.id} className="widget-card p-4 group relative">
                                        {/* Avatar + Name */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={cn(
                                                'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0',
                                                u.role === 'admin'
                                                    ? 'bg-violet-500/20 text-violet-400'
                                                    : 'bg-primary/10 text-primary'
                                            )}>
                                                {(u.name || u.email)?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className="text-sm font-semibold text-foreground truncate">{u.name || 'No Name'}</p>
                                                    {u.role === 'admin' && <Badge variant="admin">Admin</Badge>}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">@{u.username || u.email.split('@')[0]}</p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 text-xs text-muted-foreground border-t border-border pt-3">
                                            <p className="truncate">{u.email}</p>
                                            {u.phone && <p>{u.phone}</p>}
                                            <div className="flex items-center gap-2 pt-1">
                                                <Badge variant={u.plan === 'pro' ? 'success' : u.plan === 'enterprise' ? 'warning' : 'default'}>
                                                    {u.plan}
                                                </Badge>
                                                <span className="text-[10px]">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                title="Edit"
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingUser(u)}
                                                title="Delete"
                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
