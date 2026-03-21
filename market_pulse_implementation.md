# Market Pulse Implementation Guide

Follow these steps to integrate the **Market Pulse** feature into any frontend project consuming the EquiBharat API.

## 1. Data Structure Definitions (TypeScript)

First, define the core data structure returned by the `/api/market-pulse` endpoint.

```typescript
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
}
```

---

## 2. Integration & State Management

Manage the synchronization and automated data fetching within your main dashboard or a custom hook.

```tsx
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [pulseData, setPulseData] = useState<MarketPulseData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshMarketPulse = async () => {
        try {
            // Adjust the URL if the API is on a different domain
            const res = await fetch('/api/market-pulse', { cache: 'no-store' });
            const data = await res.json();
            setPulseData(data);
        } catch (error) {
            console.error("Pulse sync failure:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshMarketPulse();
        // Polling interval for live updates (e.g., 30 seconds)
        const pulseInterval = setInterval(refreshMarketPulse, 30000);
        return () => clearInterval(pulseInterval);
    }, []);

    // ... rest of component logic
};
```

---

## 3. Core UI Components (Tailwind & Framer Motion)

### A. Sensitivity/Bias Gauge
```tsx
const BiasGauge = ({ pulse }: { pulse: MarketPulseData['pulse'] }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center shadow-inner">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2 w-full text-center">
        Current Market Bias
      </h3>
      <div className="flex gap-12 items-center justify-center">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Global Mood</span>
          <div className={`text-3xl font-black ${pulse?.global_mood === 'Bullish' ? 'text-emerald-400' : pulse?.global_mood === 'Bearish' ? 'text-red-400' : 'text-slate-300'}`}>
            {pulse?.global_mood || 'Neutral'}
          </div>
        </div>
        <div className="h-12 w-[1px] bg-slate-800" />
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">India Bias</span>
          <div className={`text-3xl font-black ${pulse?.india_bias === 'Positive' ? 'text-blue-400' : pulse?.india_bias === 'Cautionary' ? 'text-orange-400' : 'text-slate-300'}`}>
            {pulse?.india_bias || 'Stable'}
          </div>
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-sm italic max-w-xl mx-auto">
        "{pulse?.summary || 'Observing market catalysts for emerging bias...'}"
      </p>
    </div>
  );
};
```

### B. Sectoral Heatmap Grid
```tsx
const SectoralHeatmap = ({ sectors }: { sectors: MarketPulseData['sectors'] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {sectors?.map((s, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl border-l-4 transition-all hover:scale-105" 
             style={{ borderLeftColor: s.score > 2 ? '#10b981' : s.score < -2 ? '#ef4444' : '#64748b' }}>
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 truncate">{s.sector}</span>
            <div className="flex justify-between items-end">
               <span className="text-white font-bold">{s.score > 0 ? '+' : ''}{s.score.toFixed(1)}</span>
               <span className="text-[9px] text-slate-600 font-mono">{s.total_signals} signals</span>
            </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 4. Full Tab Layout Implementation

Assemble these components inside a tab-switched dashboard.

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Calendar } from "lucide-react";

// Integrated Tab View
{activeTab === 'pulse' && (
  <motion.div 
    key="pulse"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    {pulseData ? (
      <>
        {/* Row 1: Bias and Triggers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BiasGauge pulse={pulseData.pulse} />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">TOP TRIGGERS</h3>
             <ul className="space-y-4">
                {JSON.parse(pulseData.pulse?.top_triggers || '[]').map((trigger: string, i: number) => (
                   <li key={i} className="flex gap-3 items-start border-l-2 border-blue-500 pl-4 py-1">
                      <span className="text-white text-xs font-medium leading-relaxed">{trigger}</span>
                   </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Row 2: Heatmap and Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-400" /> Sectoral Heatmap
              </h3>
              <SectoralHeatmap sectors={pulseData.sectors} />
           </div>
           
           <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-blue-400" /> Impact Timeline
              </h3>
              <div className="space-y-3">
                 {pulseData.events?.map((e, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex gap-4 items-center">
                          <div className={`w-2 h-2 rounded-full ${e.impact_level === 'High' ? 'bg-red-500 glow-red' : 'bg-slate-500'}`} />
                          <div>
                             <div className="text-white text-xs font-bold">{e.event_name}</div>
                             <div className="text-[10px] text-slate-500 mt-0.5">{e.country} • {new Date(e.event_time).toLocaleString()}</div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </>
    ) : (
      <div className="h-64 flex items-center justify-center animate-pulse text-slate-500 italic">
         Requesting intelligence pulse...
      </div>
    )}
  </motion.div>
)}
```

## 5. Deployment Checklist
- [ ] Ensure **Tailwind CSS** is configured correctly in your project.
- [ ] Install **Framer Motion** (`npm install framer-motion`).
- [ ] Install **Lucide React** (`npm install lucide-react`).
- [ ] Map the API routes correctly to your backend instance.
