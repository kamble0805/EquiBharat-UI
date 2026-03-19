'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Save, Moon, Sun, Monitor, CheckCircle2, Loader2 } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/context/AuthContext';

const DISPLAY_PREFS_KEY = 'equibharat_display_prefs';

interface DisplayPrefs {
  fontSize: number;
  compactMode: boolean;
  reducedMotion: boolean;
  timezone: string;
  dateFormat: string;
}

const defaults: DisplayPrefs = {
  fontSize: 16,
  compactMode: false,
  reducedMotion: false,
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
};

function loadPrefs(): DisplayPrefs {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(DISPLAY_PREFS_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

function applyPrefs(prefs: DisplayPrefs) {
  document.documentElement.style.fontSize = `${prefs.fontSize}px`;
  document.documentElement.classList.toggle('compact', prefs.compactMode);
  document.documentElement.classList.toggle('motion-reduce', prefs.reducedMotion);
}

export const DisplaySection = () => {
  const { user } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<DisplayPrefs>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load saved prefs on mount
  useEffect(() => {
    const fetchPrefs = async () => {
      // 1. Initial local load
      const loaded = loadPrefs();
      setPrefs(loaded);
      applyPrefs(loaded);

      // 2. DB fetch if logged in
      if (user?.email) {
        try {
          const res = await fetch(`/api/user/display?email=${user.email}`);
          if (res.ok) {
            const data = await res.json();
            if (data.preferences) {
              const dbPrefs = {
                fontSize: data.preferences.font_size,
                compactMode: !!data.preferences.compact_mode,
                reducedMotion: !!data.preferences.reduced_motion,
                timezone: data.preferences.timezone,
                dateFormat: data.preferences.date_format,
              };
              setPrefs(dbPrefs);
              applyPrefs(dbPrefs);
            }
          }
        } catch (e) {
          console.error("DB prefernce fetch failed", e);
        }
      }
    };

    fetchPrefs();
  }, [user?.email]);

  const updatePref = <K extends keyof DisplayPrefs>(key: K, value: DisplayPrefs[K]) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    setSaveError('');

    // Apply font size live
    if (key === 'fontSize') {
      document.documentElement.style.fontSize = `${value}px`;
    }
    if (key === 'compactMode') {
      document.documentElement.classList.toggle('compact', value as boolean);
    }
    if (key === 'reducedMotion') {
      document.documentElement.classList.toggle('motion-reduce', value as boolean);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');

    try {
      // Save locally as fallback
      localStorage.setItem(DISPLAY_PREFS_KEY, JSON.stringify(prefs));
      applyPrefs(prefs);

      // Save to DB if logged in
      if (user?.email) {
        const res = await fetch('/api/user/display', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            theme: currentTheme, // Use the current theme from theme-provider
            fontSize: prefs.fontSize,
            compactMode: prefs.compactMode,
            reducedMotion: prefs.reducedMotion,
            timezone: prefs.timezone,
            dateFormat: prefs.dateFormat,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to save to database');
        }
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaving(false);
      setSaveError(err.message || 'Network error — saved locally instead.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>Select your preferred color theme — applies immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={currentTheme}
            onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: 'light', Icon: Sun, label: 'Light' },
              { value: 'dark', Icon: Moon, label: 'Dark' },
              { value: 'system', Icon: Monitor, label: 'System' },
            ].map(({ value, Icon, label }) => (
              <Label
                key={value}
                htmlFor={`theme-${value}`}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${currentTheme === value
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border hover:border-foreground/30 hover:bg-accent/40'
                  }`}
              >
                <RadioGroupItem value={value} id={`theme-${value}`} className="sr-only" />
                <Icon className={`h-6 w-6 ${currentTheme === value ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${currentTheme === value ? 'text-primary' : ''}`}>{label}</span>
                {currentTheme === value && (
                  <span className="text-[10px] text-primary font-semibold">Active</span>
                )}
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Typography</CardTitle>
          <CardDescription>Adjust the base font size — preview updates live.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Font Size</Label>
              <span className="text-sm font-semibold tabular-nums">{prefs.fontSize}px</span>
            </div>
            <Slider
              value={[prefs.fontSize]}
              onValueChange={([v]) => updatePref('fontSize', v)}
              min={13}
              max={22}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small (13px)</span>
              <span>Default (16px)</span>
              <span>Large (22px)</span>
            </div>
          </div>
          {/* Live preview */}
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <p className="font-semibold mb-1" style={{ fontSize: `${prefs.fontSize}px` }}>
              Preview: RBI holds repo rate at 6.5%
            </p>
            <p className="text-muted-foreground" style={{ fontSize: `${Math.max(prefs.fontSize - 2, 11)}px` }}>
              The Monetary Policy Committee voted unanimously to keep rates unchanged, citing inflation concerns.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Layout & Accessibility</CardTitle>
          <CardDescription>Configure display density and motion preferences.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <div className="flex items-center justify-between py-4">
            <div>
              <Label htmlFor="compactMode" className="text-sm font-medium cursor-pointer">Compact Mode</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Show more content with reduced spacing</p>
            </div>
            <Switch
              id="compactMode"
              checked={prefs.compactMode}
              onCheckedChange={(v) => updatePref('compactMode', v)}
            />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <Label htmlFor="reducedMotion" className="text-sm font-medium cursor-pointer">Reduced Motion</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Minimize animations and transitions</p>
            </div>
            <Switch
              id="reducedMotion"
              checked={prefs.reducedMotion}
              onCheckedChange={(v) => updatePref('reducedMotion', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regional Settings</CardTitle>
          <CardDescription>Configure your timezone and date format.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={prefs.timezone} onValueChange={(v) => updatePref('timezone', v)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">India (IST, UTC+5:30)</SelectItem>
                  <SelectItem value="America/New_York">Eastern (EST, UTC-5)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific (PST, UTC-8)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT, UTC+0)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (SGT, UTC+8)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan (JST, UTC+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={prefs.dateFormat} onValueChange={(v) => updatePref('dateFormat', v)}>
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (6 Mar 2026)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (03/06/2026)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-03-06)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {saveError && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                ⚠️ {saveError}
              </div>
            )}
            <div className="flex items-center justify-between">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Settings saved to database!
                </span>
              )}
              <div className="ml-auto">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Save className="h-4 w-4" />
                  }
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
