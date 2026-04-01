export interface NewsItem {
    id: string;
    headline: string;
    summary: string;
    fullContent?: string;
    source: string;
    externalUrl?: string;
    category: string;
    impact: 'extreme' | 'high' | 'moderate' | 'medium' | 'low';
    publishTime: string;
    imageUrl?: string | null;
    keywords?: string[];
    sectors?: string[];
}

export interface MarketTrigger {
    id: string;
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
}

export interface MarketSnapshot {
    name: string;
    value: string;
    change: number;
    direction: 'up' | 'down';
}

export interface ScheduledEvent {
    id: string;
    time: string;
    event: string;
    impact: 'extreme' | 'high' | 'moderate' | 'medium' | 'low';
    status: 'upcoming' | 'ongoing' | 'completed';
}

export interface MarketChange {
    id: string;
    indicator: string;
    currentValue: string;
    previousValue: string;
    changePercent: number;
    trend: 'up' | 'down';
}

export interface RiskFlag {
    id: string;
    type: 'danger' | 'warning' | 'info';
    message: string;
}

export interface MarketPulseData {
  pulse: {
    global_mood: 'Bullish' | 'Bearish' | 'Neutral';
    india_bias: 'Positive' | 'Cautionary' | 'Stable';
    summary: string;
    top_triggers: string; // JSON string containing a list of strings
    volatility_state: string;
    liquidity_state: string;
  };
  sectors: {
    sector: string;
    score: number;
    total_signals: number;
  }[];
  events: {
    event_name: string;
    impact_level: 'High' | 'Moderate' | 'Low';
    country: string;
    event_time: string;
    actual_value?: string;
    expected_value?: string;
    previous_value?: string;
  }[];
  upcoming_news: {
    id: string;
    title: string;
    summary: string;
    published_at: string;
    impact_level: string;
  }[];
}


export interface ForumTopic {
    id: string;
    title: string;
    category: string;
    replies: number;
    lastActivity: string;
    author: string;
    isPinned?: boolean;
}
