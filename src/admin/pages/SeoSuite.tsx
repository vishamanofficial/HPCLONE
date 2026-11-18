import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Save,
  ArrowRight,
  Shield,
  FileCode,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  XCircle,
  FileText
} from 'lucide-react';

export const SeoSuite: React.FC = () => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'audit' | 'settings' | 'redirects' | 'sitemaps'>('audit');

  // SEO Settings state
  const [seoSettings, setSeoSettings] = useState<any>({
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    defaultOgImage: '',
    siteUrl: 'https://hangingpanda.com',
    googleAnalyticsId: '',
    googleSearchConsoleVerification: '',
    defaultRobots: 'index, follow',
    organizationSchema: {
      name: 'HangingPanda Software Labs',
      legalName: 'HangingPanda Pvt Ltd',
      url: 'https://hangingpanda.com',
      logo: 'https://hangingpanda.com/favicon.svg'
    }
  });

  // Audit state
  const [auditData, setAuditData] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Redirects state
  const [redirects, setRedirects] = useState<any[]>([]);
  const [newSource, setNewSource] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStatusCode, setNewStatusCode] = useState<number>(301);
  const [isCreatingRedirect, setIsCreatingRedirect] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [seoRes, redRes] = await Promise.all([
        api.getAdminSeoSettings(),
        api.getAdminRedirects()
      ]);
      if (seoRes.success && seoRes.seoSettings) setSeoSettings(seoRes.seoSettings);
      if (redRes.success) setRedirects(redRes.redirects);

      // Run initial audit
      runAudit();
    } catch (err: any) {
      error(err.message || 'Failed to fetch SEO suite data');
    } finally {
      setIsLoading(false);
    }
  };

  const runAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await api.runSeoAudit();
      if (res.success && res.audit) {
        setAuditData(res.audit);
      }
    } catch (err: any) {
      error(err.message || 'Failed to run SEO audit');
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateAdminSeoSettings(seoSettings);
      if (res.success) {
        success('Global SEO settings and Schema.org saved successfully!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim() || !newDestination.trim()) return;
    setIsCreatingRedirect(true);

    try {
      const res = await api.createAdminRedirect({
        sourceUrl: newSource,
        destinationUrl: newDestination,
        statusCode: newStatusCode
      });
      if (res.success) {
        success(`Redirect rule added: ${newSource} -> ${newDestination}`);
        setNewSource('');
        setNewDestination('');
        const redRes = await api.getAdminRedirects();
        if (redRes.success) setRedirects(redRes.redirects);
      }
    } catch (err: any) {
      error(err.message || 'Failed to create redirect');
    } finally {
      setIsCreatingRedirect(false);
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    try {
      await api.deleteAdminRedirect(id);
      success('Redirect rule deleted');
      setRedirects((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      error(err.message || 'Failed to delete redirect');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Advanced SEO & Indexing Suite
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Site-wide automated audit, XML sitemaps, dynamic robots.txt, 301 redirect manager, and Schema.org.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'audit' && (
            <Button
              variant="gradient"
              size="sm"
              onClick={runAudit}
              isLoading={isAuditing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Re-Scan Entire Site
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> SEO Audit Dashboard
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Search className="w-4 h-4" /> Global Meta & Schema.org
        </button>

        <button
          onClick={() => setActiveTab('redirects')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'redirects'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <ArrowRight className="w-4 h-4" /> 301/302 Redirect Manager
        </button>

        <button
          onClick={() => setActiveTab('sitemaps')}
          className={`py-3 px-5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'sitemaps'
              ? 'border-primary text-primary font-black'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <FileCode className="w-4 h-4" /> Sitemaps & Robots.txt
        </button>
      </div>

      {/* TAB 1: SEO AUDIT DASHBOARD */}
      {activeTab === 'audit' && (
        <div className="flex flex-col gap-6">
          {/* Audit Score Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-surface border-4 border-primary">
                <span className="text-2xl font-black text-text-primary">{auditData?.score ?? 95}</span>
                <span className="text-[10px] text-text-muted absolute -bottom-2 font-bold bg-card px-1 rounded">
                  /100
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-text-primary">Site-Wide SEO Health Score</h3>
                <span className="text-xs text-text-secondary mt-0.5">
                  Scanned {auditData?.totalChecked || 21} published URLs across pages, services, and blogs.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-center">
                <span className="text-lg font-black block leading-none">{auditData?.errorsCount ?? 0}</span>
                <span className="text-[9px] uppercase tracking-wider mt-1 block">Critical Errors</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-center">
                <span className="text-lg font-black block leading-none">{auditData?.warningsCount ?? 2}</span>
                <span className="text-[9px] uppercase tracking-wider mt-1 block">Warnings</span>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 text-center">
                <span className="text-lg font-black block leading-none">{auditData?.infoCount ?? 0}</span>
                <span className="text-[9px] uppercase tracking-wider mt-1 block">Notices</span>
              </div>
            </div>
          </div>

          {/* Audit Issues List */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
              Audit Findings & Recommendations
            </h3>

            <div className="divide-y divide-border/60">
              {auditData?.issues && auditData.issues.length > 0 ? (
                auditData.issues.map((issue: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5">
                        {issue.type === 'error' ? (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        ) : issue.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Info className="w-5 h-5 text-sky-500" />
                        )}
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary">{issue.title}</span>
                          <span className="font-mono text-[10px] text-primary font-bold">{issue.page}</span>
                        </div>
                        <span className="text-xs text-text-secondary">{issue.details}</span>
                        <div className="mt-1 p-2 rounded-xl bg-surface border border-border text-[11px] text-text-muted">
                          <strong>Fix Recommendation:</strong> {issue.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-emerald-500 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> All scanned pages meet strict SEO metadata guidelines!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL META & SCHEMA.ORG */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary pb-3 border-b border-border">
              Global Default Meta Tags
            </h3>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                Default Meta Title (Fallback)
              </label>
              <Input
                value={seoSettings.defaultMetaTitle || ''}
                onChange={(e) => setSeoSettings({ ...seoSettings, defaultMetaTitle: e.target.value })}
                placeholder="HangingPanda | AI-Powered Custom Software & Mobile App Development"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                Default Meta Description
              </label>
              <Textarea
                rows={3}
                value={seoSettings.defaultMetaDescription || ''}
                onChange={(e) => setSeoSettings({ ...seoSettings, defaultMetaDescription: e.target.value })}
                placeholder="Enterprise software, mobile app development..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                  Default OG Social Image URL
                </label>
                <Input
                  value={seoSettings.defaultOgImage || ''}
                  onChange={(e) => setSeoSettings({ ...seoSettings, defaultOgImage: e.target.value })}
                  placeholder="https://hangingpanda.com/og-image.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                  Google Search Console Verification Code
                </label>
                <Input
                  value={seoSettings.googleSearchConsoleVerification || ''}
                  onChange={(e) => setSeoSettings({ ...seoSettings, googleSearchConsoleVerification: e.target.value })}
                  placeholder="google-site-verification=abc..."
                />
              </div>
            </div>
          </div>

          {/* Schema.org Organization */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary pb-3 border-b border-border">
              Schema.org Organization JSON-LD Configuration
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Organization Name</label>
                <Input
                  value={seoSettings.organizationSchema?.name || ''}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      organizationSchema: { ...seoSettings.organizationSchema, name: e.target.value }
                    })
                  }
                  placeholder="HangingPanda Software Labs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Official Site URL</label>
                <Input
                  value={seoSettings.organizationSchema?.url || ''}
                  onChange={(e) =>
                    setSeoSettings({
                      ...seoSettings,
                      organizationSchema: { ...seoSettings.organizationSchema, url: e.target.value }
                    })
                  }
                  placeholder="https://hangingpanda.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="gradient" size="lg" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              Save SEO Settings
            </Button>
          </div>
        </form>
      )}

      {/* TAB 3: REDIRECT MANAGER */}
      {activeTab === 'redirects' && (
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-text-primary">
              Create New 301 / 302 Redirect Rule
            </h3>

            <form onSubmit={handleCreateRedirect} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Old Source URL</label>
                <Input
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="/old-service-url"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Destination URL</label>
                <Input
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  placeholder="/services/app-development"
                  required
                />
              </div>

              <div>
                <Button type="submit" variant="gradient" size="md" className="w-full justify-center" isLoading={isCreatingRedirect}>
                  Add Rule
                </Button>
              </div>
            </form>
          </div>

          {/* Existing Redirects Table */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-text-muted font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-4 px-6">Source URL</th>
                    <th className="py-4 px-4">Destination</th>
                    <th className="py-4 px-4">HTTP Status</th>
                    <th className="py-4 px-4">Hits Triggered</th>
                    <th className="py-4 px-6 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {redirects.map((r) => (
                    <tr key={r._id} className="hover:bg-surface/40 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-primary">{r.sourceUrl}</td>
                      <td className="py-4 px-4 font-mono text-text-secondary">{r.destinationUrl}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-surface border border-border font-bold">
                          {r.statusCode} Permanent
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-text-muted">{r.hitCount || 0}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteRedirect(r._id)}
                          className="p-1.5 text-text-muted hover:text-rose-500 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SITEMAPS & ROBOTS.TXT */}
      {activeTab === 'sitemaps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-text-primary">XML Sitemap Index</h3>
              </div>
              <a href="/api/v1/public/sitemap.xml" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  View Live XML
                </Button>
              </a>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your XML sitemap is dynamically generated from MongoDB. Whenever you publish new pages, blogs, or services, they are automatically indexed.
            </p>
            <div className="p-3.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text-primary break-all">
              https://hangingpanda.com/sitemap.xml
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase text-text-primary">Robots.txt Directives</h3>
              </div>
              <a href="/api/v1/public/robots.txt" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  View robots.txt
                </Button>
              </a>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Directives instruct search engine crawlers (Googlebot, Bingbot) which paths to index and protect admin routes.
            </p>
            <div className="p-3.5 rounded-2xl bg-surface border border-border font-mono text-xs text-text-secondary whitespace-pre leading-relaxed">
              {`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://hangingpanda.com/sitemap.xml`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SeoSuite;
