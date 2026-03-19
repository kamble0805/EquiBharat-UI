'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Save, Shield, Smartphone, Monitor, Globe, Trash2,
  Eye, EyeOff, CheckCircle2, Loader2, AlertTriangle, Lock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ── Password strength ──────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: 'Very weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-orange-400' },
    2: { label: 'Fair', color: 'bg-yellow-400' },
    3: { label: 'Good', color: 'bg-blue-400' },
    4: { label: 'Strong', color: 'bg-emerald-400' },
    5: { label: 'Very strong', color: 'bg-emerald-500' },
  };

  return { score, ...map[score] };
}

// ── 2FA localStorage key ───────────────────────────────────────────────────────
const TWO_FA_KEY = 'equibharat_2fa_prefs';

interface TwoFAPrefs {
  enabled: boolean;
  email: boolean;
  sms: boolean;
  app: boolean;
}

function loadTwoFA(): TwoFAPrefs {
  if (typeof window === 'undefined') return { enabled: false, email: true, sms: false, app: false };
  try {
    const raw = localStorage.getItem(TWO_FA_KEY);
    return raw ? JSON.parse(raw) : { enabled: false, email: true, sms: false, app: false };
  } catch { return { enabled: false, email: true, sms: false, app: false }; }
}

// ── Sessions localStorage key ──────────────────────────────────────────────────
const SESSIONS_KEY = 'equibharat_sessions';

interface Session {
  id: string;
  device: string;
  location: string;
  iconType: 'mobile' | 'desktop';
  current: boolean;
  lastActive: string;
}

const DEFAULT_SESSIONS: Session[] = [
  { id: 's1', device: 'Chrome on Windows', location: 'Current device', iconType: 'desktop', current: true, lastActive: 'Active now' },
  { id: 's2', device: 'Safari on iPhone', location: 'Delhi, India', iconType: 'mobile', current: false, lastActive: '2 hours ago' },
  { id: 's3', device: 'Firefox on MacOS', location: 'Bangalore, India', iconType: 'desktop', current: false, lastActive: '5 days ago' },
];

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return DEFAULT_SESSIONS;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SESSIONS;
  } catch { return DEFAULT_SESSIONS; }
}

// ── Component ──────────────────────────────────────────────────────────────────
export const SecuritySection = () => {
  const { user, logout } = useAuth();

  // Password form
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [pwError, setPwError] = useState('');

  // 2FA
  const [twoFA, setTwoFA] = useState<TwoFAPrefs>({ enabled: false, email: true, sms: false, app: false });
  const [twoFASaved, setTwoFASaved] = useState(false);
  const [twoFASaving, setTwoFASaving] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState<Session[]>(DEFAULT_SESSIONS);

  // Load persisted data on mount
  useEffect(() => {
    setTwoFA(loadTwoFA());
    setSessions(loadSessions());
  }, []);

  // ── Password ──────────────────────────────────────────────────────────────
  const strength = getStrength(passwords.new);

  const handlePasswordSave = async () => {
    setPwError('');
    if (!passwords.current) { setPwError('Please enter your current password.'); return; }
    if (passwords.new.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (passwords.new !== passwords.confirm) { setPwError('New passwords do not match.'); return; }
    if (!user?.email) { setPwError('You must be logged in.'); return; }

    setPwStatus('saving');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || 'Failed to update password');
        setPwStatus('error');
      } else {
        setPwStatus('success');
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setPwStatus('idle'), 4000);
      }
    } catch {
      setPwError('Network error. Please try again.');
      setPwStatus('error');
    }
  };

  // ── 2FA ───────────────────────────────────────────────────────────────────
  const handleToggle2FA = (field: keyof TwoFAPrefs) => {
    setTwoFA(prev => ({ ...prev, [field]: !prev[field] }));
    setTwoFASaved(false);
  };

  const handleSave2FA = async () => {
    setTwoFASaving(true);
    await new Promise(r => setTimeout(r, 400));
    localStorage.setItem(TWO_FA_KEY, JSON.stringify(twoFA));
    setTwoFASaving(false);
    setTwoFASaved(true);
    setTimeout(() => setTwoFASaved(false), 3000);
  };

  // ── Sessions ──────────────────────────────────────────────────────────────
  const persistSessions = (updated: Session[]) => {
    setSessions(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  };

  const handleRevokeSession = (id: string) => {
    persistSessions(sessions.filter(s => s.id !== id));
  };

  const handleRevokeAll = () => {
    persistSessions(sessions.filter(s => s.current));
  };

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = () => {
    localStorage.clear();
    logout();
  };

  return (
    <div className="space-y-6">

      {/* ── Change Password ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPw.current ? 'text' : 'password'}
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPw.new ? 'text' : 'password'}
                value={passwords.new}
                onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                placeholder="••••••••"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {/* Strength meter */}
            {passwords.new && (
              <div className="space-y-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-border'}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Strength: <span className="font-medium text-foreground">{strength.label}</span>
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Use 8+ characters with uppercase, numbers, and special characters
            </p>
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPw.confirm ? 'text' : 'password'}
                value={passwords.confirm}
                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••"
                className="pr-10"
              />
              <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwords.confirm && passwords.new && (
              <p className={`text-xs flex items-center gap-1 ${passwords.new === passwords.confirm ? 'text-emerald-500' : 'text-destructive'}`}>
                {passwords.new === passwords.confirm
                  ? <><CheckCircle2 className="h-3 w-3" /> Passwords match</>
                  : <><AlertTriangle className="h-3 w-3" /> Passwords do not match</>}
              </p>
            )}
          </div>

          {/* Error/success */}
          {pwError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {pwError}
            </div>
          )}
          {pwStatus === 'success' && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Password updated successfully!
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button onClick={handlePasswordSave} disabled={pwStatus === 'saving'} className="gap-2">
              {pwStatus === 'saving'
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Save className="h-4 w-4" />}
              {pwStatus === 'saving' ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Two-Factor Authentication ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2faEnabled" className="text-sm font-medium cursor-pointer">
                Enable Two-Factor Authentication
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Require additional verification when signing in</p>
            </div>
            <Switch id="2faEnabled" checked={twoFA.enabled} onCheckedChange={() => handleToggle2FA('enabled')} />
          </div>

          {twoFA.enabled && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground">Choose your preferred verification methods:</p>
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Verification', desc: 'Receive OTP codes via email', field: 'email' as const },
                  { id: 'sms', label: 'SMS Verification', desc: 'Receive OTP codes via text message', field: 'sms' as const },
                  { id: 'app', label: 'Authenticator App', desc: 'Use Google Authenticator or similar', field: 'app' as const },
                ].map(({ id, label, desc, field }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`2fa-${id}`} className="text-sm font-medium cursor-pointer">{label}</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Switch id={`2fa-${id}`} checked={twoFA[field]} onCheckedChange={() => handleToggle2FA(field)} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="pt-2 flex items-center justify-between">
            {twoFASaved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> 2FA preferences saved!
              </span>
            )}
            <div className="ml-auto">
              <Button onClick={handleSave2FA} disabled={twoFASaving} variant="outline" className="gap-2">
                {twoFASaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {twoFASaving ? 'Saving...' : 'Save 2FA Settings'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Active Sessions ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
              <CardDescription>Manage devices where you are currently logged in</CardDescription>
            </div>
            {sessions.filter(s => !s.current).length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/40 hover:bg-destructive/10">
                    Revoke All Others
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out from all other devices. You'll stay logged in on this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRevokeAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Revoke All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No active sessions found.</p>
          )}
          {sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  {session.iconType === 'mobile'
                    ? <Smartphone className="h-4 w-4 text-muted-foreground" />
                    : <Monitor className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{session.device}</span>
                    {session.current && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/15 text-primary border-none">
                        This device
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Globe className="h-3 w-3" />
                    <span>{session.location}</span>
                    <span>·</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
              </div>
              {!session.current && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        <strong>{session.device}</strong> ({session.location}) will be logged out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRevokeSession(session.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Revoke
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible account actions — proceed with caution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action <strong>cannot be undone</strong>. Your account, preferences, discussions,
                    and all associated data will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
