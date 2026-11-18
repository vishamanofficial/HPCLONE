import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../components/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  ArrowLeft,
  Eye,
  Save,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  History,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  RotateCcw,
  Sliders,
  Check,
  X
} from 'lucide-react';

// Section templates catalog
const SECTION_TEMPLATES = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'High-impact headline, subheadline, guarantee badge, call-to-action buttons & metric pills.',
    defaultContent: {
      badgeText: 'Contractual SLA & 2.5 Years Free Maintenance',
      headline: 'Engineering Scalable Software & AI Products That Power Modern Business',
      description: 'We design and engineer enterprise-ready mobile app products and custom AI platforms.',
      primaryBtnText: 'Book a Free Call',
      primaryBtnUrl: '/contact',
      secondaryBtnText: 'Explore Services',
      secondaryBtnUrl: '#services',
      statsPills: [
        { label: 'Products Shipped', value: '120+' },
        { label: 'Client Retention', value: '99.4%' }
      ]
    }
  },
  {
    type: 'client_logos',
    name: 'Client Brands Ticker',
    description: 'Infinite animated logo ticker featuring fast-growing startups and enterprises.',
    defaultContent: {
      subheading: 'TRUSTED BY FAST-GROWING STARTUPS & ESTABLISHED ENTERPRISES',
      brands: ['Finovate', 'HealthSync', 'CloudScale', 'LogiTrack', 'EduPulse', 'RetailNext']
    }
  },
  {
    type: 'services_grid',
    name: 'Services Grid Showcase',
    description: 'Dynamic grid rendering services cards with icons and detail links.',
    defaultContent: {
      badge: 'WHAT WE DELIVER',
      heading: 'High-Performance Software Engineering Services',
      subheading: 'Tailored enterprise solutions built with secure, microservice architectures.'
    }
  },
  {
    type: 'value_pillars',
    name: 'Why Work With Us',
    description: 'Core architectural pillars: velocity, SLA guarantees, and direct developer communication.',
    defaultContent: {
      badge: 'WHY WORK WITH US',
      heading: 'Built for founders who value velocity, architectural rigor, and transparent delivery',
      subheading: 'We replace opaque agency timelines with contractually backed sprint commitments.'
    }
  },
  {
    type: 'industry_tabs',
    name: 'Industries We Serve',
    description: 'Interactive tabbed showcase across Fintech, Healthcare, E-commerce, Logistics, and EdTech.',
    defaultContent: {
      badge: 'INDUSTRIES WE SERVE',
      heading: 'Tailored Solutions Across High-Growth Verticals',
      categories: ['Fintech', 'Healthcare', 'E-commerce', 'Education', 'Logistics']
    }
  },
  {
    type: 'portfolio_highlights',
    name: 'Case Studies Showcase',
    description: 'Featured client case studies with metrics, tech stacks, and results.',
    defaultContent: {
      badge: 'PROVEN RESULTS',
      heading: 'Real Products, Measurable Impact',
      subheading: 'Review how our software builds solve scaling hurdles and increase company valuations.'
    }
  },
  {
    type: 'engineering_journey',
    name: 'Engineering Process Steps',
    description: 'Interactive 4-milestone roadmap: Blueprints, UI/UX, Development & QA, Deployment & IP.',
    defaultContent: {
      badge: 'HOW WE WORK',
      heading: 'From Architecture Blueprint to Production Deployment',
      subheading: 'A four-phase iterative engineering lifecycle backed by weekly review demos.'
    }
  },
  {
    type: 'tech_ecosystem',
    name: 'Technology Ecosystem',
    description: 'Interactive tabs covering Frontend, Backend, Mobile, Databases, and Cloud & DevOps.',
    defaultContent: {
      badge: 'OUR STACK',
      heading: 'Modern, Battle-Tested Engineering Stacks',
      subheading: 'Built on modern, scalable, and battle-tested frameworks.'
    }
  },
  {
    type: 'testimonials',
    name: 'Client Testimonials',
    description: 'Client reviews from founders, CTOs, and product leaders with ratings.',
    defaultContent: {
      badge: 'CLIENT TESTIMONIALS',
      heading: 'Trusted by Founders, CTOs, and Product Leaders',
      subheading: 'Hear directly from executives who scale their businesses on HangingPanda software systems.'
    }
  },
  {
    type: 'faqs',
    name: 'FAQ Accordion',
    description: 'Centralized expandable accordion addressing common questions and guarantees.',
    defaultContent: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      heading: 'Everything You Need to Know About Partnering With Us',
      subheading: 'Clear answers on engineering contracts, source code ownership, SLA guarantees, and maintenance.'
    }
  },
  {
    type: 'lead_form',
    name: 'Contact & Blueprint Form',
    description: 'Integrated lead capture form with budget selector, WhatsApp flag, and direct CRM sync.',
    defaultContent: {
      badge: 'GET STARTED TODAY',
      heading: "Let's Build Something Extraordinary Together",
      subheading: 'Share your application concept for an NDA-backed architecture roadmap and transparent sprint quote.'
    }
  },
  {
    type: 'cta_banner',
    name: 'Call-to-Action Banner',
    description: 'Prominent closing banner with dual action buttons.',
    defaultContent: {
      heading: 'Ready to bring your software vision to life?',
      subheading: 'Connect with our engineering leads today for a confidential architecture consultation.',
      primaryBtnText: 'Schedule a Tech Consultation',
      primaryBtnUrl: '/contact',
      secondaryBtnText: 'Estimate with App Cost Calculator',
      secondaryBtnUrl: '/app-cost-calculator'
    }
  },
  {
    type: 'rich_text',
    name: 'Rich Text Article Content',
    description: 'Formatted markdown or HTML paragraphs, headings, and bullet points.',
    defaultContent: {
      heading: 'Custom In-Depth Overview',
      bodyText: 'HangingPanda designs enterprise software systems built for high availability and low latency.'
    }
  }
];

export const VisualPageBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'seo'>('sections');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);

  // SEO state
  const [seo, setSeo] = useState<any>({
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogImage: '',
    robots: 'index, follow'
  });

  useEffect(() => {
    const fetchPage = async () => {
      if (!id) return;
      try {
        const res = await api.getAdminPage(id);
        if (res.success && res.page) {
          setPage(res.page);
          setSections(res.page.sections || []);
          setSeo(res.page.seo || {});
          if (res.page.sections?.length > 0) {
            setSelectedSectionId(res.page.sections[0].id);
          }
        }
      } catch (err: any) {
        error(err.message || 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  useEffect(() => {
    if (selectedSectionId) {
      const el = document.getElementById(`canvas-sec-${selectedSectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedSectionId]);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Section Management Handlers
  const handleAddSection = (template: typeof SECTION_TEMPLATES[0]) => {
    const newSection = {
      id: `sec-${Date.now()}`,
      type: template.type,
      name: template.name,
      order: sections.length + 1,
      isEnabled: true,
      settings: { background: 'default' },
      content: { ...template.defaultContent }
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.id);
    setIsAddModalOpen(false);
    success(`Added "${template.name}" section`);
  };

  const handleDuplicateSection = (secId: string) => {
    const target = sections.find((s) => s.id === secId);
    if (!target) return;

    const duplicated = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sec-${Date.now()}`,
      name: `${target.name} (Copy)`,
      order: sections.length + 1
    };

    setSections((prev) => [...prev, duplicated]);
    setSelectedSectionId(duplicated.id);
    success('Section duplicated');
  };

  const handleDeleteSection = (secId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== secId));
    if (selectedSectionId === secId) {
      setSelectedSectionId(sections[0]?.id || null);
    }
    success('Section removed');
  };

  const handleToggleVisibility = (secId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === secId ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    // Re-index orders
    const reordered = updated.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setSections(reordered);
  };

  const handleContentUpdate = (key: string, value: any) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? { ...s, content: { ...s.content, [key]: value } }
          : s
      )
    );
  };

  const handleSettingsUpdate = (key: string, value: any) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId
          ? { ...s, settings: { ...s.settings, [key]: value } }
          : s
      )
    );
  };

  // Save changes & create version revision
  const handleSave = async (shouldPublish: boolean = false) => {
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await api.updateAdminPage(id, {
        sections,
        seo,
        status: shouldPublish ? 'published' : page.status,
        changeSummary: shouldPublish ? 'Published page updates via builder' : 'Saved draft revisions'
      });

      if (res.success && res.page) {
        setPage(res.page);
        success(shouldPublish ? 'Page published successfully!' : 'Draft changes saved as new revision!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  // Live Preview
  const handleLivePreview = async () => {
    if (!id) return;
    try {
      // Save draft first
      await api.updateAdminPage(id, { sections, seo });
      const res = await api.generatePreviewToken('page', id);
      if (res.success && res.previewUrl) {
        window.open(res.previewUrl, '_blank');
      }
    } catch (err: any) {
      error(err.message || 'Failed to launch preview');
    }
  };

  // Revision History
  const handleOpenRevisions = async () => {
    if (!id) return;
    try {
      const res = await api.getPageRevisions(id);
      if (res.success) {
        setRevisions(res.revisions || []);
        setIsHistoryOpen(true);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch revisions');
    }
  };

  const handleRestoreRevision = async (revId: string, revNum: number) => {
    if (!id) return;
    try {
      const res = await api.restorePageRevision(id, revId);
      if (res.success && res.page) {
        setPage(res.page);
        setSections(res.page.sections || []);
        setSeo(res.page.seo || {});
        setIsHistoryOpen(false);
        success(`Successfully restored to revision #${revNum}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to restore revision');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <span className="text-sm font-bold text-text-muted">Launching Visual Section Builder...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-6 md:-m-8 bg-surface/40">
      {/* Builder Top Toolbar */}
      <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between gap-4 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/pages')}
            className="p-2 rounded-xl border border-border text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            title="Back to Pages"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-text-primary">{page?.title}</span>
              <span className="text-[10px] font-bold text-primary font-mono">/{page?.slug}</span>
            </div>
            <span className="text-[10px] text-text-muted font-semibold">
              Revision #{page?.currentRevision || 1} • {sections.length} active sections
            </span>
          </div>
        </div>

        {/* Device Viewport Mode Toggles */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-surface border border-border">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'desktop' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'mobile' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Actions: Revisions, Preview, Save, Publish */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenRevisions}
            leftIcon={<History className="w-3.5 h-3.5" />}
          >
            Revisions
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLivePreview}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Live Preview
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave(false)}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>

          <Button
            variant="gradient"
            size="sm"
            onClick={() => handleSave(true)}
            isLoading={isSaving}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Publish Live
          </Button>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden text-left">
        {/* Left Column: Sections Outline & Tree */}
        <div className="w-80 bg-card border-r border-border flex flex-col justify-between overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-wider text-text-primary">
                Section Tree
              </span>
            </div>

            <Button
              variant="gradient"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-3 h-3" />}
              className="py-1 px-3 text-[11px]"
            >
              Add Section
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                  selectedSectionId === sec.id
                    ? 'bg-primary/10 border-primary shadow-sm text-text-primary'
                    : 'bg-surface border-border hover:border-primary/40 text-text-secondary'
                } ${!sec.isEnabled ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-[10px] font-mono font-bold text-text-muted">
                    0{idx + 1}
                  </span>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold truncate text-text-primary">
                      {sec.name || sec.type}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono truncate">
                      {sec.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleMoveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-text-muted hover:text-text-primary disabled:opacity-20"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveSection(idx, 'down')}
                    disabled={idx === sections.length - 1}
                    className="p-1 text-text-muted hover:text-text-primary disabled:opacity-20"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(sec.id)}
                    className="p-1 text-text-muted hover:text-primary"
                    title={sec.isEnabled ? 'Hide section' : 'Show section'}
                  >
                    <Eye className={`w-3.5 h-3.5 ${!sec.isEnabled ? 'text-text-muted line-through' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDuplicateSection(sec.id)}
                    className="p-1 text-text-muted hover:text-primary"
                    title="Duplicate section"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-1 text-text-muted hover:text-rose-500"
                    title="Remove section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Device Viewport Canvas */}
        <div className="flex-1 bg-surface/60 overflow-y-auto p-6 flex flex-col items-center">
          <div
            className={`transition-all duration-300 bg-bg border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col min-h-[600px] ${
              deviceMode === 'desktop'
                ? 'w-full max-w-5xl'
                : deviceMode === 'tablet'
                ? 'w-[768px]'
                : 'w-[375px]'
            }`}
          >
            {/* Viewport Frame Header */}
            <div className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-text-primary font-bold">
                  https://hangingpanda.com/{page?.slug}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {deviceMode.toUpperCase()} VIEW
              </span>
            </div>

            {/* Interactive Section Renderers */}
            <div className="divide-y divide-border/40">
              {sections.length > 0 ? (
                sections.map((sec) => (
                  <div
                    key={sec.id}
                    id={`canvas-sec-${sec.id}`}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`relative p-8 transition-all cursor-pointer ${
                      selectedSectionId === sec.id
                        ? 'ring-2 ring-primary ring-inset bg-primary/5 shadow-inner'
                        : 'hover:bg-surface/30'
                    } ${!sec.isEnabled ? 'opacity-30' : ''}`}
                  >
                    {/* Badge Indicator on Section */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      {selectedSectionId === sec.id && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-black uppercase shadow-sm">
                          Active Selection
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-card/90 border border-border text-[9px] font-black uppercase text-text-muted shadow-sm">
                        {sec.name || sec.type}
                      </span>
                    </div>

                    {/* Section Content Mock Renderers */}
                    {sec.type === 'hero' && (
                      <div className="flex flex-col items-center text-center gap-4 py-8 max-w-2xl mx-auto">
                        {sec.content?.badgeText && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                            {sec.content.badgeText}
                          </span>
                        )}
                        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
                          {sec.content?.headline || 'Hero Headline'}
                        </h1>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {sec.content?.description || 'Hero description text'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Button variant="gradient" size="sm">
                            {sec.content?.primaryBtnText || 'Primary CTA'}
                          </Button>
                          <Button variant="secondary" size="sm">
                            {sec.content?.secondaryBtnText || 'Secondary'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {sec.type === 'client_logos' && (
                      <div className="py-4 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block mb-3">
                          {sec.content?.subheading || 'TRUSTED BY ENTERPRISES'}
                        </span>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                          {(sec.content?.brands || ['Finovate', 'HealthSync', 'CloudScale', 'LogiTrack', 'EduPulse']).map((b: string) => (
                            <span key={b} className="text-xs font-bold text-text-secondary opacity-70">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'services_grid' && (
                      <div className="py-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                          {sec.content?.badge || 'SERVICES'}
                        </span>
                        <h2 className="text-xl font-black text-text-primary">
                          {sec.content?.heading || 'High-Performance Software Engineering'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                          {['Custom App Development', 'Web Platforms', 'Autonomous AI Labs'].map((s) => (
                            <div key={s} className="p-4 rounded-2xl bg-surface border border-border text-left">
                              <h4 className="text-xs font-bold text-text-primary">{s}</h4>
                              <p className="text-[10px] text-text-secondary mt-1">High-availability microservice solutions.</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'industry_tabs' && (
                      <div className="py-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                          {sec.content?.badge || 'INDUSTRIES WE SERVE'}
                        </span>
                        <h2 className="text-xl font-black text-text-primary">
                          {sec.content?.heading || 'Tailored Solutions Across High-Growth Verticals'}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {['Fintech', 'Healthcare', 'E-commerce', 'Education', 'Logistics'].map((cat, i) => (
                            <span
                              key={cat}
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                i === 0
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'bg-surface border border-border text-text-secondary'
                              }`}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 p-5 rounded-2xl bg-surface border border-border text-left max-w-lg mx-auto">
                          <h4 className="text-xs font-bold text-primary">Fintech Architecture Deliverables</h4>
                          <p className="text-[11px] text-text-secondary mt-1">
                            Real-time payment integrations, multi-currency ledger engines, and PCI-DSS compliance frameworks.
                          </p>
                        </div>
                      </div>
                    )}

                    {sec.type === 'value_pillars' && (
                      <div className="py-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                          {sec.content?.badge || 'WHY WORK WITH US'}
                        </span>
                        <h2 className="text-xl font-black text-text-primary">
                          {sec.content?.heading || 'Architectural Rigor & Velocity'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                          {[
                            { t: 'Sprint Velocity', d: '2-week milestone cycles with production deliverables.' },
                            { t: 'Contractual SLA', d: '2.5 years free bug-fix warranty and uptime monitoring.' },
                            { t: 'Direct Git Access', d: 'Full ownership of source code with zero licensing lock-in.' }
                          ].map((pil) => (
                            <div key={pil.t} className="p-4 rounded-xl bg-surface border border-border text-left">
                              <h4 className="text-xs font-bold text-text-primary">{pil.t}</h4>
                              <p className="text-[10px] text-text-secondary mt-1">{pil.d}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'portfolio_highlights' && (
                      <div className="py-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                          {sec.content?.badge || 'PROVEN RESULTS'}
                        </span>
                        <h2 className="text-xl font-black text-text-primary">
                          {sec.content?.heading || 'Real Products, Measurable Impact'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                          {[
                            { name: 'Marhba Banking App', metric: '+340% User Growth', tech: 'React Native • Node.js' },
                            { name: 'Sallim Telehealth Portal', metric: '99.99% Uptime', tech: 'Next.js • PostgreSQL' }
                          ].map((item) => (
                            <div key={item.name} className="p-4 rounded-xl bg-surface border border-border text-left">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                                {item.metric}
                              </span>
                              <h4 className="text-xs font-bold text-text-primary mt-2">{item.name}</h4>
                              <span className="text-[10px] text-text-muted mt-1 block font-mono">{item.tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'engineering_journey' && (
                      <div className="py-6 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-1">
                          OUR METHODOLOGY
                        </span>
                        <h2 className="text-xl font-black text-text-primary">Agile Engineering Roadmap</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-left">
                          {[
                            { p: 'Sprint 1', t: 'Scope & Wireframe' },
                            { p: 'Sprint 2', t: 'Core Engineering' },
                            { p: 'Sprint 3', t: 'Interface Integration' },
                            { p: 'Sprint 4', t: 'QA & IP Transfer' }
                          ].map((sp) => (
                            <div key={sp.p} className="p-3 rounded-lg bg-surface border border-border">
                              <span className="text-[9px] font-black text-primary uppercase">{sp.p}</span>
                              <h5 className="text-[11px] font-bold text-text-primary mt-0.5">{sp.t}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {sec.type === 'cta_banner' && (
                      <div className="py-8 px-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent-orange/10 border border-primary/20 text-center flex flex-col items-center gap-3">
                        <h3 className="text-xl font-black text-text-primary">
                          {sec.content?.heading || 'Ready to bring your software vision to life?'}
                        </h3>
                        <p className="text-xs text-text-secondary max-w-lg">
                          {sec.content?.subheading || 'Connect with our engineering leads today.'}
                        </p>
                        <Button variant="gradient" size="sm" className="mt-2">
                          {sec.content?.primaryBtnText || 'Schedule Call'}
                        </Button>
                      </div>
                    )}

                    {!['hero', 'client_logos', 'services_grid', 'industry_tabs', 'value_pillars', 'portfolio_highlights', 'engineering_journey', 'cta_banner'].includes(sec.type) && (
                      <div className="py-6 text-center flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                          {sec.content?.badge || sec.type}
                        </span>
                        <h3 className="text-lg font-black text-text-primary">
                          {sec.content?.heading || sec.name}
                        </h3>
                        <p className="text-xs text-text-secondary max-w-md">
                          {sec.content?.subheading || sec.content?.description || 'Configurable dynamic section component.'}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-24 text-center flex flex-col items-center gap-3">
                  <Layers className="w-10 h-10 text-text-muted" />
                  <h4 className="text-sm font-bold text-text-primary">Canvas is empty</h4>
                  <p className="text-xs text-text-secondary">Click "Add Section" in the left panel to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Section Inspector & SEO Tab */}
        <div className="w-88 bg-card border-l border-border flex flex-col justify-between overflow-hidden flex-shrink-0">
          {/* Tabs: Content vs SEO */}
          <div className="flex border-b border-border text-xs font-bold">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'sections'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Section Content
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'seo'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Search className="w-3.5 h-3.5" /> Page SEO
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'sections' && selectedSection ? (
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Editing Section
                  </span>
                  <h3 className="text-base font-black text-text-primary">
                    {selectedSection.name || selectedSection.type}
                  </h3>
                </div>

                {/* Common Fields */}
                {selectedSection.content?.badgeText !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Badge Text
                    </label>
                    <Input
                      value={selectedSection.content.badgeText || ''}
                      onChange={(e) => handleContentUpdate('badgeText', e.target.value)}
                    />
                  </div>
                )}

                {selectedSection.content?.badge !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Section Category Badge
                    </label>
                    <Input
                      value={selectedSection.content.badge || ''}
                      onChange={(e) => handleContentUpdate('badge', e.target.value)}
                    />
                  </div>
                )}

                {selectedSection.content?.headline !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Main Headline
                    </label>
                    <Textarea
                      rows={2}
                      value={selectedSection.content.headline || ''}
                      onChange={(e) => handleContentUpdate('headline', e.target.value)}
                    />
                  </div>
                )}

                {selectedSection.content?.heading !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Section Title / Heading
                    </label>
                    <Input
                      value={selectedSection.content.heading || ''}
                      onChange={(e) => handleContentUpdate('heading', e.target.value)}
                    />
                  </div>
                )}

                {selectedSection.content?.description !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Description Paragraph
                    </label>
                    <Textarea
                      rows={3}
                      value={selectedSection.content.description || ''}
                      onChange={(e) => handleContentUpdate('description', e.target.value)}
                    />
                  </div>
                )}

                {selectedSection.content?.subheading !== undefined && (
                  <div>
                    <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                      Subheading / Subtitle
                    </label>
                    <Textarea
                      rows={2}
                      value={selectedSection.content.subheading || ''}
                      onChange={(e) => handleContentUpdate('subheading', e.target.value)}
                    />
                  </div>
                )}

                {/* Buttons */}
                {selectedSection.content?.primaryBtnText !== undefined && (
                  <div className="pt-2 border-t border-border flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Primary Action Button
                    </span>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1">Label</label>
                      <Input
                        value={selectedSection.content.primaryBtnText || ''}
                        onChange={(e) => handleContentUpdate('primaryBtnText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1">URL</label>
                      <Input
                        value={selectedSection.content.primaryBtnUrl || ''}
                        onChange={(e) => handleContentUpdate('primaryBtnUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {selectedSection.content?.secondaryBtnText !== undefined && (
                  <div className="pt-2 border-t border-border flex flex-col gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Secondary Action Button
                    </span>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1">Label</label>
                      <Input
                        value={selectedSection.content.secondaryBtnText || ''}
                        onChange={(e) => handleContentUpdate('secondaryBtnText', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-text-secondary mb-1">URL</label>
                      <Input
                        value={selectedSection.content.secondaryBtnUrl || ''}
                        onChange={(e) => handleContentUpdate('secondaryBtnUrl', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'seo' ? (
              /* SEO Inspector with Live Google SERP Preview */
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                    Page SEO Metadata
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    Configure search ranking title, description, and preview SERP snippet.
                  </p>
                </div>

                {/* Live Google SERP Simulator */}
                <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">
                    Google Search Preview
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    <span>https://hangingpanda.com</span>
                    <span>&rsaquo;</span>
                    <span>{page?.slug}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
                    {seo.metaTitle || page?.title || 'Page Title'}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {seo.metaDescription || 'No meta description provided. Google will show an excerpt from page content.'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      SEO Meta Title
                    </label>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        (seo.metaTitle?.length || 0) > 60 ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      {seo.metaTitle?.length || 0} / 60
                    </span>
                  </div>
                  <Input
                    value={seo.metaTitle || ''}
                    onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                    placeholder="e.g. AI-Powered Enterprise Software | HangingPanda"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      Meta Description
                    </label>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        (seo.metaDescription?.length || 0) > 160 ? 'text-rose-500' : 'text-emerald-500'
                      }`}
                    >
                      {seo.metaDescription?.length || 0} / 160
                    </span>
                  </div>
                  <Textarea
                    rows={3}
                    value={seo.metaDescription || ''}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    placeholder="Enter engaging meta description summarizing deliverables..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Focus Target Keyword
                  </label>
                  <Input
                    value={seo.focusKeyword || ''}
                    onChange={(e) => setSeo({ ...seo, focusKeyword: e.target.value })}
                    placeholder="e.g. mobile app development noida"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Canonical URL
                  </label>
                  <Input
                    value={seo.canonicalUrl || ''}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                    placeholder={`https://hangingpanda.com/${page?.slug}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Open Graph Social Image
                  </label>
                  <Input
                    value={seo.ogImage || ''}
                    onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    placeholder="https://hangingpanda.com/og-image.jpg"
                  />
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-text-muted text-xs">
                Select a section to inspect and edit.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Component Library Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  Add Section from Component Library
                </h3>
                <p className="text-xs text-text-secondary">
                  Choose a responsive, pre-designed component to add to your page layout.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SECTION_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.type}
                  onClick={() => handleAddSection(tmpl)}
                  className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col gap-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {tmpl.name}
                    </span>
                    <Plus className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revisions History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl flex flex-col gap-6 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  Page Revision History
                </h3>
                <p className="text-xs text-text-secondary">
                  Compare historical versions and roll back any change with full audit safety.
                </p>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 text-text-muted hover:text-text-primary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-border/60 space-y-3">
              {revisions.map((rev) => (
                <div key={rev._id} className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-primary">
                        Revision #{rev.revisionNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
                        {rev.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-text-primary">{rev.changeSummary}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(rev.createdAt).toLocaleString()} • {rev.sectionsData?.length || 0} sections
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreRevision(rev._id, rev.revisionNumber)}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Restore This
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VisualPageBuilder;
