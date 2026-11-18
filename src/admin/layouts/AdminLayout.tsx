import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Layers,
  Users,
  Briefcase,
  BookOpen,
  Image,
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

export const AdminLayout: React.FC = () => {
  const { user, logout, hasRole, isLoading } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

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
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Pages & Builder', path: '/admin/pages', icon: Layers },
    { label: 'Mini CRM Leads', path: '/admin/crm', icon: MessageSquare, badge: 'Active' },
    { label: 'Services CMS', path: '/admin/services', icon: Briefcase },
    { label: 'Blog CMS', path: '/admin/blogs', icon: BookOpen },
    { label: 'Portfolio CMS', path: '/admin/portfolio', icon: FolderGit2 },
    { label: 'SEO Suite', path: '/admin/seo', icon: Search, badge: 'Audit' },
    { label: 'Media Library', path: '/admin/media', icon: Image },
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
  const pathParts = location.pathname.replace('/admin', '').split('/').filter(Boolean);
  const currentTitle = pathParts.length === 0 ? 'Dashboard Overview' : pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);

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
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary/20">
                HP
              </span>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tight text-text-primary group-hover:text-primary transition-colors leading-none">
                  HangingPanda
                </span>
                <span className="text-[10px] tracking-wider uppercase font-bold text-primary mt-1">
                  Enterprise CMS
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-text-muted">
              Management Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-border bg-surface/50">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'Admin'}
                  className="w-9 h-9 rounded-xl object-cover border border-border flex-shrink-0"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-text-primary truncate">{user?.name || 'Admin User'}</span>
                  <span className="text-[10px] text-primary font-semibold truncate">{user?.role || 'Super Admin'}</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-18 bg-card border-b border-border px-6 flex items-center justify-between gap-4 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border text-text-secondary hover:text-primary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Link to="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
              {pathParts.length > 0 && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-text-primary font-bold">{currentTitle}</span>
                </>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* View Live Website Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border text-xs font-bold text-text-secondary hover:text-primary hover:bg-surface transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border text-text-secondary hover:text-primary hover:bg-surface transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications Indicator */}
            <div className="relative">
              <button
                onClick={() => navigate('/admin/crm')}
                className="p-2 rounded-full border border-border text-text-secondary hover:text-primary hover:bg-surface transition-colors relative"
                title="Lead Inquiries"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
