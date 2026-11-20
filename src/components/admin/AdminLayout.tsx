'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  Layers,
  Users,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Search,
  MessageSquare,
  Globe,
  Settings,
  Shield,
  FileText,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  UserCheck,
  HelpCircle,
  FolderGit2,
  Bell,
  Sparkles
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, hasRole, isLoading } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    // If not logged in and not on login page, redirect to login
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [user, isLoading, pathname, router]);

  // If on login page, render child directly without admin frame
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-text-muted mt-3">Verifying session...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Pages & Builder', path: '/admin/pages', icon: Layers },
    { label: 'Mini CRM Leads', path: '/admin/crm', icon: MessageSquare, badge: 'Active' },
    { label: 'Services CMS', path: '/admin/services', icon: Briefcase },
    { label: 'Blog CMS', path: '/admin/blogs', icon: BookOpen },
    { label: 'Portfolio CMS', path: '/admin/portfolio', icon: FolderGit2 },
    { label: 'SEO Suite', path: '/admin/seo', icon: Search, badge: 'Audit' },
    { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { label: 'Testimonials', path: '/admin/testimonials', icon: Sparkles },
    { label: 'Team Members', path: '/admin/team', icon: Users },
    { label: 'FAQs Manager', path: '/admin/faqs', icon: HelpCircle },
    { label: 'Navigation Menus', path: '/admin/navigation', icon: Globe },
    { label: 'Career Openings', path: '/admin/jobs', icon: UserCheck },
    { label: 'Global Settings', path: '/admin/settings', icon: Settings },
    ...(hasRole(['Super Admin'])
      ? [
          { label: 'Users & Roles', path: '/admin/users', icon: Shield },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText }
        ]
      : [])
  ];

  // Breadcrumbs calculation
  const pathParts = pathname.replace('/admin', '').split('/').filter(Boolean);
  const currentTitle =
    pathParts.length === 0 || pathParts[0] === 'dashboard'
      ? 'Dashboard Overview'
      : pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);

  return (
    <div className="flex h-screen bg-bg text-text-primary overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                HP
              </span>
              <div>
                <span className="font-black text-base tracking-tight text-text-primary block leading-none">
                  HangingPanda
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1 block">
                  Enterprise CMS
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1 custom-scrollbar">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted px-3 mb-2">
              Management Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin/dashboard'
                  ? pathname === '/admin' || pathname === '/admin/dashboard'
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm font-bold border border-primary/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.badge === 'Audit'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-primary/15 text-primary border border-primary/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Profile Card & Sign Out */}
          <div className="p-4 border-t border-border flex-shrink-0 bg-surface/40">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-text-primary block truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium text-text-muted block truncate">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="Sign out of CMS"
                className="p-2 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
              <Link href="/admin/dashboard" className="hover:text-text-primary transition-colors">
                Admin
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-text-primary font-bold">{currentTitle}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* View Live Website Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface border border-border transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="p-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notification Bell */}
            <button
              title="Recent alerts"
              className="p-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-bg p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
