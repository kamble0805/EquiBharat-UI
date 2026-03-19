'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Clock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Thread {
    id: string;
    title: string;
    category: string;
    replies: number;
    lastActivity: string;
    author: string;
}

export const MyDiscussionsSection = () => {
    const { user } = useAuth();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyThreads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/forums/threads');
            const data = await res.json();
            // Filter to only show threads started by this user
            const myName = user?.name || user?.email?.split('@')[0] || '';
            const mine = Array.isArray(data)
                ? data.filter((t: Thread) => t.author === myName)
                : [];
            setThreads(mine);
        } catch {
            setThreads([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyThreads(); }, [user]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">My Discussions</h3>
                    <p className="text-sm text-muted-foreground">Threads you've started in the forums.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={fetchMyThreads} className="p-2 rounded-lg border border-border hover:bg-accent" title="Refresh">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <Button asChild size="sm">
                        <Link href="/forums" className="gap-2 flex items-center">
                            <Plus className="w-4 h-4" />
                            New Discussion
                        </Link>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : threads.length === 0 ? (
                <div className="text-center py-16 bg-secondary/30 border border-border rounded-xl">
                    <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="font-medium text-foreground mb-1">No discussions yet</p>
                    <p className="text-sm text-muted-foreground mb-5">Start your first thread in the forums.</p>
                    <Button asChild size="sm">
                        <Link href="/forums">Go to Forums</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {threads.map(thread => (
                        <Link
                            key={thread.id}
                            href="/forums"
                            className="block bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full mb-2 inline-block">
                                        {thread.category}
                                    </span>
                                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                        {thread.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            {thread.replies} {thread.replies === 1 ? 'reply' : 'replies'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {thread.lastActivity}
                                        </span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-1" />
                            </div>
                        </Link>
                    ))}

                    <div className="text-center pt-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/forums" className="gap-2 flex items-center">
                                View All Forums
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
