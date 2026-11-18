import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Layers,
  FileText,
  Briefcase,
  BookOpen,
  FolderGit2,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle,
  Plus,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load CMS statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-semibold text-text-muted">Loading CMS dashboard metrics...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Published Pages', value: stats?.publishedPages ?? 0, icon: Layers, path: '/admin/pages', color: 'text-primary' },
    { label: 'Draft Pages', value: stats?.draftPages ?? 0, icon: FileText, path: '/admin/pages', color: 'text-amber-500' },
    { label: 'Services Managed', value: stats?.services ?? 12, icon: Briefcase, path: '/admin/services', color: 'text-blue-500' },
    { label: 'Published Blogs', value: stats?.blogs ?? 4, icon: BookOpen, path: '/admin/blogs', color: 'text-purple-500' },
    { label: 'Case Studies', value: stats?.portfolio ?? 5, icon: FolderGit2, path: '/admin/portfolio', color: 'text-pink-500' },
    { label: 'Testimonials', value: stats?.testimonials ?? 3, icon: Sparkles, path: '/admin/testimonials', color: 'text-emerald-500' },
    { label: 'Total Inquiries (CRM)', value: stats?.totalLeads ?? 0, icon: MessageSquare, path: '/admin/crm', color: 'text-rose-500' },
    { label: 'SEO Audit Warnings', value: stats?.seoAlertsCount ?? 0, icon: AlertTriangle, path: '/admin/seo', color: 'text-orange-500' }
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time status of published agency pages, CRM leads, content workflows, and SEO configurations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchStats}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={() => navigate('/admin/pages')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create New Page
          </Button>
        </div>
      </div>

      {/* Analytics Status Alert */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Google Analytics 4 Status
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Connected
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Live measurement ID active: <span className="font-mono text-primary font-bold">G-HP78201</span>. Tracking pageviews and form conversions.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/seo')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          SEO Suite
        </Button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} to={item.path} className="group">
              <Card
                variant="default"
                hoverEffect="scale"
                className="p-5 sm:p-6 flex flex-col justify-between h-full bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted">{item.label}</span>
                  <div className={`p-2 rounded-xl bg-surface border border-border ${item.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-text-primary tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
                    &rarr;
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Leads & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries (CRM Preview) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-base font-black text-text-primary">Recent Inquiries & Leads</h2>
            </div>
            <Link to="/admin/crm" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View CRM Pipeline &rarr;
            </Link>
          </div>

          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="divide-y divide-border/60">
              {stats.recentLeads.map((lead: any) => (
                <div key={lead._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">{lead.fullName}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          lead.status === 'new'
                            ? 'bg-rose-500/10 text-rose-500'
                            : lead.status === 'contacted'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <span className="text-xs text-text-secondary truncate">
                      {lead.interestedService || 'General Inquiry'} • {lead.budget || 'N/A'} • {lead.email}
                    </span>
                  </div>

                  <Link to={`/admin/crm?leadId=${lead._id}`}>
                    <Button variant="secondary" size="sm">
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-text-muted text-xs">
              No recent inquiries recorded yet.
            </div>
          )}
        </div>

        {/* Audit Activity & SEO Health */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Quick Actions Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
              Quick Content Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs"
                onClick={() => navigate('/admin/blogs')}
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-primary" />}
              >
                Write Blog Post
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs"
                onClick={() => navigate('/admin/services')}
                leftIcon={<Briefcase className="w-3.5 h-3.5 text-blue-500" />}
              >
                Add Service
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs"
                onClick={() => navigate('/admin/portfolio')}
                leftIcon={<FolderGit2 className="w-3.5 h-3.5 text-purple-500" />}
              >
                Add Case Study
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs"
                onClick={() => navigate('/admin/media')}
                leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Upload Media
              </Button>
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                System Activity Log
              </h3>
              <Link to="/admin/audit-logs" className="text-xs text-primary font-bold hover:underline">
                All Logs
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentAudits && stats.recentAudits.length > 0 ? (
                stats.recentAudits.slice(0, 5).map((log: any) => (
                  <div key={log._id} className="flex items-start justify-between text-xs gap-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary">{log.action}</span>
                      <span className="text-text-muted text-[11px] truncate max-w-[220px]">
                        {log.details || log.resource}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-muted py-4 text-center">No audit logs recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;
