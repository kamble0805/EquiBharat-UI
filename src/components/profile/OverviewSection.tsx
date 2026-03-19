'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, MessageSquare, Activity, ArrowRight, Loader2, Newspaper, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface NewsItem {
    id: string;
    headline: string;
    source: string;
    category: string;
    published_date: string;
}

interface ForumThread {
    id: string;
    title: string;
    category: string;
    replies: number;
    lastActivity: string;
    author: string;
}

function timeAgo(dateStr: string) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export const OverviewSection = () => {
    const { user } = useAuth();
    const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
    const [recentThreads, setRecentThreads] = useState<ForumThread[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [threadCount, setThreadCount] = useState(0);

    useEffect(() => {
        // Fetch recent news
        fetch('/api/news')
            .then(r => r.json())
            .then(data => {
                const list = Array.isArray(data) ? data : (data.news ?? []);
                setRecentNews(list.slice(0, 4));
            })
            .catch(() => setRecentNews([]))
            .finally(() => setLoadingNews(false));

        // Fetch recent forum threads
        fetch('/api/forums/threads')
            .then(r => r.json())
            .then(data => {
                const list = Array.isArray(data) ? data : [];
                setRecentThreads(list.slice(0, 3));
                // Count user's own threads
                const myName = user?.name || user?.email?.split('@')[0] || '';
                setThreadCount(list.filter((t: ForumThread) => t.author === myName).length);
            })
            .catch(() => setRecentThreads([]))
            .finally(() => setLoadingThreads(false));
    }, [user]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
                <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-3">
                        <div>
                            <CardTitle className="text-2xl mb-1">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
                            </CardTitle>
                            <CardDescription>
                                Here's what's happening on EquiBharat today.
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-background shrink-0">Free Plan</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3 mt-1">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/calendar">📅 Economic Calendar</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/news">📰 Latest News</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/forums">💬 Forums</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-500">
                                <Newspaper className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Latest News</p>
                                <p className="text-xl font-bold">{loadingNews ? '—' : recentNews.length > 0 ? `${recentNews.length}+ articles` : 'No data'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-purple-500/10 text-purple-500">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">My Discussions</p>
                                <p className="text-xl font-bold">{loadingThreads ? '—' : threadCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-green-500/10 text-green-500">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Today's Date</p>
                                <p className="text-sm font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent News */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-primary" />
                            Recent News
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                            <Link href="/news" className="flex items-center gap-1">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingNews ? (
                        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                    ) : recentNews.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent news available.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentNews.map(item => (
                                <div key={item.id} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        <div className="min-w-0">
                                            <Link href={`/news/${item.id}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {item.headline}
                                            </Link>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {item.source} · {item.published_date ? timeAgo(item.published_date) : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
                                        <Link href={`/news/${item.id}`}><ArrowRight className="h-3.5 w-3.5" /></Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Forum Activity */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            Active Discussions
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
                            <Link href="/forums" className="flex items-center gap-1">
                                View all <ArrowRight className="h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingThreads ? (
                        <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                    ) : recentThreads.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-sm text-muted-foreground mb-3">No forum discussions yet.</p>
                            <Button size="sm" asChild><Link href="/forums">Start a Discussion</Link></Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentThreads.map(thread => (
                                <div key={thread.id} className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">{thread.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {thread.category} · {thread.replies} {thread.replies === 1 ? 'reply' : 'replies'} · {thread.lastActivity}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" asChild>
                                        <Link href="/forums"><ArrowRight className="h-3.5 w-3.5" /></Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
