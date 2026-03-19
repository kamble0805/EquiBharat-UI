'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Phone, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AuthPageFormProps {
    initialMode: 'login' | 'register';
}

export function AuthPageForm({ initialMode }: AuthPageFormProps) {
    const { login } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    // Form State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const { toast } = useToast();

    // Sync mode if initialMode changes (optional, but good if reusing)
    useEffect(() => {
        if (initialMode === 'login' || initialMode === 'register') {
            setMode(initialMode);
        }
    }, [initialMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (mode === 'forgot') {
            toast({
                title: "Password Reset",
                description: "Password reset functionality will be available soon.",
            });
            setMode('login');
            return;
        }

        if (mode === 'register') {
            if (password !== confirmPassword) {
                setFormError('Passwords do not match. Please check and try again.');
                return;
            }

            setLoading(true);
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, username, email, phone, password }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setFormError(data.error || 'Registration failed. Please try again.');
                    return;
                }
                login(data.user);
                toast({ title: 'Account Created', description: `Welcome ${data.user.name}!` });
                router.push('/');
            } catch {
                setFormError('Network error. Please check your connection.');
            } finally {
                setLoading(false);
            }
        } else {
            // LOGIN
            setLoading(true);
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setFormError(data.error || 'Login failed. Please check your credentials.');
                    return;
                }
                login(data.user);
                toast({ title: 'Signed In', description: `Welcome back, ${data.user.name}!` });
                router.push('/');
            } catch {
                setFormError('Network error. Please check your connection.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-elevated p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Register'}
                    {mode === 'forgot' && 'Reset Password'}
                </h2>
                <p className="text-muted-foreground text-sm">
                    {mode === 'login' && 'Access full analysis and research'}
                    {mode === 'register' && 'Create an account to access complete content'}
                    {mode === 'forgot' && 'Enter your email to receive reset instructions'}
                </p>
            </div>

            {/* Error banner */}
            {formError && (
                <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5 mb-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{formError}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 bg-secondary border-border focus:border-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm text-muted-foreground">Username</Label>
                                <div className="relative">
                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-10 bg-secondary border-border focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Phone No."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10 bg-secondary border-border focus:border-primary"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 bg-secondary border-border focus:border-primary"
                            required
                        />
                    </div>
                </div>

                {mode !== 'forgot' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 bg-secondary border-border focus:border-primary"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-secondary border-border focus:border-primary"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {mode === 'login' && (
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                )}

                <Button type="submit" disabled={loading} className="w-full gap-2">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {!loading && mode === 'login' && 'Sign In'}
                    {!loading && mode === 'register' && 'Create Account'}
                    {!loading && mode === 'forgot' && 'Send Reset Link'}
                    {loading && (mode === 'login' ? 'Signing in...' : 'Creating account...')}
                </Button>
            </form>

            {/* Switch Mode Links */}
            <div className="mt-6 text-center text-sm">
                {mode === 'forgot' ? (
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setFormError(''); }}
                        className="text-primary hover:underline font-medium"
                    >
                        Back to sign in
                    </button>
                ) : (
                    <>
                        <span className="text-muted-foreground">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        </span>
                        <Link
                            href={mode === 'login' ? '/signup' : '/login'}
                            className="text-primary hover:underline font-medium"
                        >
                            {mode === 'login' ? 'Register' : 'Sign in'}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
