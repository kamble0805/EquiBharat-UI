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
    date: string;
    globalMood: {
        status: string;
        direction: 'up' | 'down' | 'neutral';
    };
    indiaBias: string;
    volatility: string;
    liquidity: string;
    triggers: MarketTrigger[];
    snapshot: MarketSnapshot[];
    equityFocus: string;
    currencyFocus: string;
    commoditiesFocus: string;
    scheduledEvents: ScheduledEvent[];
    calendarEvents: {
        time: string;
        event: string;
        impact: 'extreme' | 'high' | 'moderate' | 'medium' | 'low';
    }[];
    changedSinceYesterday: MarketChange[];
    riskFlags: RiskFlag[];
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
