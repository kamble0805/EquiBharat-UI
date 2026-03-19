import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { type ForumTopic } from '@/types';

interface ForumsWidgetProps {
  compact?: boolean;
}

export function ForumsWidget({ compact = false }: ForumsWidgetProps) {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await fetch('/api/forums/threads');
        if (res.ok) {
          const data = await res.json();
          setTopics(data);
        }
      } catch (e) {
        console.error('Failed to fetch forum topics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const displayTopics = compact ? topics.slice(0, 3) : topics;

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Discussion Forums</h3>
        </div>
        <Link
          href="/forums"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
          </div>
        ) : displayTopics.length > 0 ? (
          displayTopics.map((topic) => (
            <Link
              key={topic.id}
              href="/forums"
              className="block bg-secondary/50 rounded-lg p-3 hover:bg-secondary/80 transition-colors group"
            >
              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-2">
                {topic.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="bg-accent px-2 py-0.5 rounded">{topic.category}</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {topic.replies}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {topic.lastActivity}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-xs text-muted-foreground">No discussions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
