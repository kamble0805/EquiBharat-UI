import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, TrendingUp, LogOut, Search, CloudSun, Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from '@/components/mode-toggle';
import { format } from 'date-fns';
import { SearchCommand } from '@/components/SearchCommand';

import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/calendar', label: 'Economic Calendar' },
  { path: '/news', label: 'News' },
  { path: '/forums', label: 'Forums' },
];

export function Navbar() {
  const { isLoggedIn, logout, user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();
  const currentDate = new Date();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Ctrl+K for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "User profile will be available when backend is connected.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
        {/* Top Utility Bar - Hidden on scroll to save space, visible on desktop */}
        <div className={cn(
          "bg-slate-950 text-slate-300 text-xs border-b border-white/5 transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-10 opacity-100 hidden lg:block"
        )}>
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-medium text-slate-100">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </span>
              <div className="flex items-center gap-2">
                <CloudSun className="w-3.5 h-3.5" />
                <span>24°C Mumbai</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 border-r border-white/10 pr-4">
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </div>

              <div className="flex items-center gap-3">
                {/* Social Icons (Mock) */}
                <a href="#" className="hover:text-white transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter className="w-3.5 h-3.5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
                <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>
              </div>

              <div className="flex items-center gap-2 pl-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link href="/admin">
                        <button className="hover:text-white flex items-center gap-1.5 border border-violet-500/40 px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 transition-all" title="Admin Panel">
                          <Shield className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline-block text-xs font-medium">Admin</span>
                        </button>
                      </Link>
                    )}
                    <Link href="/profile">
                      <button className="hover:text-white flex items-center gap-1.5 border border-white/10 px-2 py-1 rounded-full bg-white/5 transition-all">
                        <span className="max-w-[80px] truncate hidden sm:inline-block font-medium">
                          {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                        </span>
                        <User className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="hover:text-red-500 text-muted-foreground transition-colors p-1"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="hover:text-white"><User className="w-4 h-4" /></button>
                  </Link>
                )}
                <button className="hover:text-white" onClick={() => setSearchOpen(true)}>
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className={cn(
          "bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}>
          <div className="container mx-auto px-4 h-full flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              {/* Using a larger, serif-style logo presentation matching the reference image's vibe */}
              <div className="flex flex-col relative">
                <div className="text-3xl md:text-4xl font-bold tracking-tighter leading-none text-foreground font-serif">
                  Equi<span className="text-primary">Bharat</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    'px-3 xl:px-4 py-2 text-[15px] font-bold transition-colors uppercase tracking-tight',
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <ModeToggle />


              {/* Mobile Search Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden ml-[-8px]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background overflow-y-auto">
            {/* Close bar at top */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <Link href="/" className="text-2xl font-bold font-serif" onClick={() => setMobileMenuOpen(false)}>
                Equi<span className="text-primary">Bharat</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col gap-0 px-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'text-lg font-semibold py-3 border-b border-border/50',
                    isActive(link.path) ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <Search className="w-4 h-4" />
                  Search (Ctrl+K)
                </Button>
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name?.[0] || user?.email?.[0]}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-sm truncate">{user?.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button asChild variant="outline" className="w-full border-violet-500/40 text-violet-400 hover:bg-violet-500/10" onClick={() => setMobileMenuOpen(false)}>
                        <Link href="/admin"><Shield className="w-4 h-4 mr-2" />Admin Panel</Link>
                      </Button>
                    )}
                    <Button asChild variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/profile">My Profile</Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout} className="w-full text-red-500 border-red-500/30 hover:bg-red-500/10">Sign Out</Button>
                  </>
                ) : (
                  <Button asChild variant="outline" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}