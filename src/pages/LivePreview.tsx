import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  AlertCircle,
  Eye,
  ArrowLeft,
  RefreshCw,
  Edit3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Layers,
  Code
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LivePreview: React.FC = () => {
  const { type, token } = useParams<{ type: string; token: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [allPages, setAllPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndustryTab, setActiveIndustryTab] = useState('Fintech');

  useEffect(() => {
    const fetchPreview = async () => {
      if (!token) return;
      try {
        const res = await api.getPreviewData(token);
        if (res.success) {
          setData(res.data);
        } else {
          setError('Failed to resolve preview data');
        }

        // Fetch list of available pages for quick switcher
        const pagesRes = await api.getAdminPages().catch(() => null);
        if (pagesRes && pagesRes.success) {
          setAllPages(pagesRes.pages || []);
        }
      } catch (err: any) {
        setError(err.message || 'Invalid or expired preview session');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [token]);

  const handleSwitchPage = async (pageId: string) => {
    try {
      setIsLoading(true);
      const res = await api.generatePreviewToken('page', pageId);
      if (res.success && res.previewToken) {
        navigate(`/preview/page/${res.previewToken}`);
      }
    } catch (err: any) {
      alert('Could not generate preview for this page');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-bg">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-bold text-text-primary">Loading live preview session...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-4 bg-bg">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-2xl font-black text-text-primary">Preview Session Expired</h2>
        <p className="text-xs text-text-secondary max-w-md">
          {error || 'This tokenized preview session has expired or is invalid.'}
        </p>
        <div className="flex items-center gap-3">
          <Link to="/admin/pages">
            <Button variant="gradient" size="sm">
              Back to Pages Manager
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" size="sm">
              Visit Live Site
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sections = data.sections || [];

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col font-sans">
      {/* Live Preview Persistent Control Bar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-b border-primary/30 py-2.5 px-6 flex items-center justify-between text-xs font-bold shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            Live Preview
          </div>
          <span className="text-text-primary font-bold">
            {data.title}
          </span>
          <span className="font-mono text-[10px] text-text-muted bg-surface px-2 py-0.5 rounded border border-border">
            /{data.slug}
          </span>
          <span className="text-[10px] text-primary font-bold hidden sm:inline">
            (Rev #{data.currentRevision || 1} • {data.status?.toUpperCase() || 'DRAFT'})
          </span>
        </div>

        {/* Center: Switch Page Preview Dropdown */}
        {allPages.length > 1 && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] uppercase text-text-muted font-bold">Switch Page:</span>
            <select
              value={data._id}
              onChange={(e) => handleSwitchPage(e.target.value)}
              className="bg-surface border border-border rounded-lg text-xs font-semibold py-1 px-2.5 text-text-primary focus:outline-none focus:border-primary"
            >
              {allPages.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} (/{p.slug})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {data._id && (
            <Link to={`/admin/builder/${data._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs py-1 px-3"
                leftIcon={<Edit3 className="w-3.5 h-3.5 text-primary" />}
              >
                Back to Builder
              </Button>
            </Link>
          )}
          <button
            onClick={() => window.close()}
            className="px-3 py-1 rounded-lg border border-border hover:bg-surface text-text-secondary hover:text-text-primary text-xs transition-colors"
          >
            Close Tab
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="pt-16 pb-24 flex-1">
        {sections.length > 0 ? (
          sections
            .filter((sec: any) => sec.isEnabled !== false)
            .map((sec: any) => (
              <section key={sec.id} className="relative">
                {/* 1. Hero Section */}
                {sec.type === 'hero' && (
                  <div className="py-20 md:py-28 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                    {sec.content?.badgeText && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        {sec.content.badgeText}
                      </span>
                    )}
                    <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-tight max-w-4xl">
                      {sec.content?.headline || data.title}
                    </h1>
                    <p className="text-sm sm:text-lg text-text-secondary mt-6 leading-relaxed max-w-2xl">
                      {sec.content?.description || 'Engineered scalable software platforms and AI solutions.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                      {sec.content?.primaryBtnText && (
                        <Button variant="gradient" size="lg">
                          {sec.content.primaryBtnText}
                        </Button>
                      )}
                      {sec.content?.secondaryBtnText && (
                        <Button variant="secondary" size="lg">
                          {sec.content.secondaryBtnText}
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Client Logos Ticker */}
                {sec.type === 'client_logos' && (
                  <div className="py-12 border-y border-border/60 bg-surface/40">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted block mb-6">
                        {sec.content?.subheading || 'TRUSTED BY FAST-GROWING ENTERPRISES & STARTUPS'}
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80">
                        {(sec.content?.brands || ['Finovate', 'HealthSync', 'CloudScale', 'LogiTrack', 'EduPulse', 'RetailNext']).map(
                          (brand: string) => (
                            <span key={brand} className="text-base sm:text-lg font-black text-text-secondary tracking-tight">
                              {brand}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Services Grid */}
                {sec.type === 'services_grid' && (
                  <div className="py-20 max-w-7xl mx-auto px-6 text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                      {sec.content?.badge || 'WHAT WE DELIVER'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                      {sec.content?.heading || 'High-Performance Software Engineering'}
                    </h2>
                    <p className="text-sm text-text-secondary mt-3 max-w-2xl mx-auto">
                      {sec.content?.subheading || 'Tailored enterprise solutions built with secure, microservice architectures.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                      {[
                        { title: 'Custom App Development', desc: 'End-to-end native and hybrid mobile apps tailored to business operations.', tech: 'React Native • Flutter • Swift' },
                        { title: 'Enterprise Software', desc: 'Secure, decoupled microservices with ACID-compliant database architectures.', tech: 'Java Spring • Node.js • PostgreSQL' },
                        { title: 'Autonomous AI Labs', desc: 'Production-ready LLM pipelines, RAG retrieval engines, and smart automation.', tech: 'FastAPI • PyTorch • pgvector' }
                      ].map((item) => (
                        <div key={item.title} className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col gap-3">
                          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Code className="w-5 h-5" />
                          </span>
                          <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                          <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                          <span className="text-[10px] font-mono font-bold text-primary mt-2">{item.tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Industries Tabs */}
                {sec.type === 'industry_tabs' && (
                  <div className="py-20 bg-surface/30 border-y border-border/40">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                      <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                        {sec.content?.badge || 'INDUSTRIES WE SERVE'}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                        {sec.content?.heading || 'Tailored Solutions Across High-Growth Verticals'}
                      </h2>
                      <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {['Fintech', 'Healthcare', 'E-commerce', 'Education', 'Logistics'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveIndustryTab(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                              activeIndustryTab === cat
                                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                : 'bg-card border border-border text-text-secondary hover:text-text-primary'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="mt-8 p-8 rounded-3xl bg-card border border-border max-w-3xl mx-auto text-left shadow-sm">
                        <span className="text-xs font-bold text-primary uppercase">{activeIndustryTab} Infrastructure</span>
                        <h3 className="text-xl font-bold text-text-primary mt-1">
                          Dedicated Architecture & Compliance Deliverables
                        </h3>
                        <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                          We deliver production-ready software suites with bank-grade encryption, automated data backups, and high-concurrency request routing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Value Pillars */}
                {sec.type === 'value_pillars' && (
                  <div className="py-20 max-w-7xl mx-auto px-6 text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                      {sec.content?.badge || 'WHY WORK WITH US'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                      {sec.content?.heading || 'Architectural Rigor & Guaranteed Delivery'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                      {[
                        { title: '2-Week Sprint Velocity', desc: 'Predictable milestones with continuous integration and bi-weekly staging builds.' },
                        { title: '2.5 Years Free Maintenance', desc: 'Contractually guaranteed bug fixes, zero licensing lock-in, and full SLA coverage.' },
                        { title: 'Direct Git Access', desc: '100% intellectual property ownership with shared repositories and engineering Slack channels.' }
                      ].map((p) => (
                        <div key={p.title} className="p-6 rounded-2xl bg-surface border border-border">
                          <CheckCircle2 className="w-6 h-6 text-primary mb-3" />
                          <h4 className="text-base font-bold text-text-primary">{p.title}</h4>
                          <p className="text-xs text-text-secondary mt-2 leading-relaxed">{p.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. CTA Banner */}
                {sec.type === 'cta_banner' && (
                  <div className="py-16 max-w-5xl mx-auto px-6">
                    <div className="p-10 rounded-3xl bg-gradient-to-r from-primary/15 via-accent-orange/10 to-primary/15 border border-primary/30 text-center flex flex-col items-center gap-4 shadow-xl">
                      <span className="text-xs font-black uppercase tracking-widest text-primary">
                        {sec.content?.badge || 'READY TO BUILD?'}
                      </span>
                      <h3 className="text-3xl font-black text-text-primary tracking-tight">
                        {sec.content?.heading || 'Ready to bring your software vision to life?'}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
                        {sec.content?.subheading || 'Schedule an engineering scoping call to map deliverables to 2-week milestones.'}
                      </p>
                      <Button variant="gradient" size="md" className="mt-2">
                        {sec.content?.primaryBtnText || 'Book Free Architecture Call'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Fallback Section Card */}
                {!['hero', 'client_logos', 'services_grid', 'industry_tabs', 'value_pillars', 'cta_banner'].includes(sec.type) && (
                  <div className="py-16 border-b border-border/40 max-w-6xl mx-auto px-6 text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                      {sec.content?.badge || sec.content?.badgeText || sec.type}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-text-primary">
                      {sec.content?.heading || sec.content?.headline || sec.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-3 max-w-2xl mx-auto">
                      {sec.content?.description || sec.content?.subheading || sec.content?.bodyText}
                    </p>
                  </div>
                )}
              </section>
            ))
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-3xl font-black text-text-primary">{data.title}</h1>
            <p className="text-sm text-text-secondary mt-2">{data.excerpt || data.shortDesc || 'No sections added yet.'}</p>
          </div>
        )}
      </main>

      {/* Footer info banner */}
      <footer className="py-6 border-t border-border bg-surface text-center text-xs text-text-muted">
        <span>Live Preview sandbox for HangingPanda CMS • Changes rendered directly from database draft</span>
      </footer>
    </div>
  );
};

export default LivePreview;
