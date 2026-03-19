'use client';

import { useState } from 'react';
import { OverviewSection } from '@/components/profile/OverviewSection';
import { MyDiscussionsSection } from '@/components/profile/MyDiscussionsSection';
import { PersonalInfoSection } from '@/components/profile/PersonalInfoSection';
import { DisplaySection } from '@/components/profile/DisplaySection';
import { SecuritySection } from '@/components/profile/SecuritySection';
import {
  User, Monitor, Shield,
  LayoutDashboard, MessageSquare, LogOut,
  Home, Calendar, Newspaper, Users,
  ChevronRight, Menu, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── Sidebar Sections ─────────────────────────────────────────────────────────

const accountItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'discussions', icon: MessageSquare, label: 'My Discussions' },
];

const settingItems = [
  { id: 'personal', icon: User, label: 'Profile Details' },
  { id: 'display', icon: Monitor, label: 'Display' },
  { id: 'security', icon: Shield, label: 'Security' },
];

const siteLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/calendar', icon: Calendar, label: 'Economic Calendar' },
  { href: '/news', icon: Newspaper, label: 'News' },
  { href: '/forums', icon: Users, label: 'Forums' },
];

// ─── Nav Item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const NavItem = ({ icon: Icon, label, isActive, onClick, href, className }: NavItemProps) => {
  const base = `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
    } ${className ?? ''}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        <Icon className="h-4 w-4 shrink-0" />
        {label}
        <ChevronRight className="h-3 w-3 ml-auto opacity-40" />
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base}>
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose?: () => void;
  user: any;
  handleLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, onClose, user, handleLogout }: SidebarProps) => (
  <div className="flex flex-col h-full">
    {/* User Card */}
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>

    {/* Scrollable Nav Area */}
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {/* My Account */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1.5">My Account</p>
        <div className="space-y-0.5">
          {accountItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => { setActiveTab(item.id); onClose?.(); }}
            />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1.5">Settings</p>
        <div className="space-y-0.5">
          {settingItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => { setActiveTab(item.id); onClose?.(); }}
            />
          ))}
        </div>
      </div>

      {/* Go to Site */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-3 mb-1.5">Navigate Site</p>
        <div className="space-y-0.5">
          {siteLinks.map((link) => (
            <NavItem key={link.href} icon={link.icon} label={link.label} href={link.href} />
          ))}
        </div>
      </div>
    </nav>

    {/* Sign Out */}
    <div className="p-3 border-t border-border">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  </div>
);

// ─── Main ProfilePage ─────────────────────────────────────────────────────────

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const tabLabels: Record<string, string> = {
    overview: 'Dashboard',
    discussions: 'My Discussions',
    personal: 'Profile Details',
    display: 'Display',
    security: 'Security',
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-border sticky top-0 h-screen overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          handleLogout={handleLogout}
        />
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-background border-r border-border flex flex-col overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onClose={() => setMobileSidebarOpen(false)}
              user={user}
              handleLogout={handleLogout}
            />
          </div>
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-base font-semibold">{tabLabels[activeTab]}</h2>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          {/* Desktop Page Title */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-foreground">{tabLabels[activeTab]}</h1>
          </div>

          <div className="animate-fade-in">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'discussions' && <MyDiscussionsSection />}
            {activeTab === 'personal' && <PersonalInfoSection />}
            {activeTab === 'display' && <DisplaySection />}
            {activeTab === 'security' && <SecuritySection />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
