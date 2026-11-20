import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import NotFound from './NotFound';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Sparkles, Code, CheckCircle2, RefreshCw } from 'lucide-react';

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCustomPage = async () => {
      if (!slug) return;
      setIsLoading(true);
      setNotFound(false);

      try {
        const res = await api.getPublicPage(slug);
        if (isMounted && res.success && res.page) {
          setPage(res.page);
        } else {
          if (isMounted) setNotFound(true);
        }
      } catch (err: any) {
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCustomPage();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs font-bold text-text-muted">Loading page...</span>
      </div>
    );
  }

  if (notFound || !page) {
    return <NotFound />;
  }

  const sections = (page.sections || []).filter((s: any) => s.isEnabled !== false);

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Dynamic SEO Meta */}
      <Helmet>
        <title>{page.seo?.metaTitle || `${page.title} | HangingPanda`}</title>
        <meta
          name="description"
          content={page.seo?.metaDescription || `${page.title} - Custom software solutions by HangingPanda.`}
        />
        <link rel="canonical" href={page.seo?.canonicalUrl || `https://hangingpanda.com/${page.slug}`} />
        <meta property="og:title" content={page.seo?.metaTitle || `${page.title} | HangingPanda`} />
        <meta property="og:description" content={page.seo?.metaDescription || `${page.title} - Custom software solutions by HangingPanda.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://hangingpanda.com/${page.slug}`} />
        {page.seo?.ogImage && <meta property="og:image" content={page.seo.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.seo?.metaTitle || `${page.title} | HangingPanda`} />
        <meta name="twitter:description" content={page.seo?.metaDescription || `${page.title} - Custom software solutions by HangingPanda.`} />
        {page.seo?.ogImage && <meta name="twitter:image" content={page.seo.ogImage} />}
      </Helmet>

      {/* Render Page Sections */}
      <div className="py-12">
        {sections.map((sec: any) => (
          <div key={sec.id} className="relative">
            {/* 1. Hero Block */}
            {sec.type === 'hero' && (
              <section className="py-20 md:py-28 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
                {sec.content?.badgeText && (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    {sec.content.badgeText}
                  </span>
                )}
                <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-tight max-w-4xl">
                  {sec.content?.headline || page.title}
                </h1>
                <p className="text-sm sm:text-lg text-text-secondary mt-6 leading-relaxed max-w-2xl">
                  {sec.content?.description}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                  {sec.content?.primaryBtnText && (
                    <Link to={sec.content?.primaryBtnUrl || '/contact'}>
                      <Button variant="gradient" size="lg">
                        {sec.content.primaryBtnText}
                      </Button>
                    </Link>
                  )}
                  {sec.content?.secondaryBtnText && (
                    <Link to={sec.content?.secondaryBtnUrl || '/case-studies'}>
                      <Button variant="secondary" size="lg">
                        {sec.content.secondaryBtnText}
                      </Button>
                    </Link>
                  )}
                </div>
              </section>
            )}

            {/* 2. Services Grid */}
            {sec.type === 'services_grid' && (
              <section className="py-20 max-w-7xl mx-auto px-6 text-center border-t border-border/40">
                <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                  {sec.content?.badge || 'SERVICES'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                  {sec.content?.heading || 'Engineered Offerings'}
                </h2>
                <p className="text-sm text-text-secondary mt-3 max-w-2xl mx-auto">
                  {sec.content?.subheading}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                  {[
                    { title: 'Custom App Development', desc: 'Cross-platform iOS and Android apps.' },
                    { title: 'Enterprise Software', desc: 'Secure decoupled microservice APIs.' },
                    { title: 'AI Automation', desc: 'Autonomous pipelines and smart workflows.' }
                  ].map((item) => (
                    <Card key={item.title} hoverEffect="glow" className="p-6 rounded-3xl bg-card border border-border flex flex-col gap-3">
                      <Code className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* 3. Value Pillars */}
            {sec.type === 'value_pillars' && (
              <section className="py-20 max-w-7xl mx-auto px-6 text-center border-t border-border/40">
                <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                  {sec.content?.badge || 'CORE VALUES'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                  {sec.content?.heading || 'Built for Reliability'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
                  {[
                    { title: 'Fast Milestones', desc: 'Continuous delivery on weekly agile sprints.' },
                    { title: 'Guaranteed SLA', desc: 'Full warranty and maintenance coverage.' },
                    { title: '100% Code Ownership', desc: 'You own your repositories and databases.' }
                  ].map((pil) => (
                    <div key={pil.title} className="p-6 rounded-2xl bg-surface border border-border">
                      <CheckCircle2 className="w-6 h-6 text-primary mb-3" />
                      <h4 className="text-base font-bold text-text-primary">{pil.title}</h4>
                      <p className="text-xs text-text-secondary mt-2 leading-relaxed">{pil.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. CTA Banner */}
            {sec.type === 'cta_banner' && (
              <section className="py-16 max-w-5xl mx-auto px-6">
                <div className="p-10 rounded-3xl bg-gradient-to-r from-primary/15 via-accent-orange/10 to-primary/15 border border-primary/30 text-center flex flex-col items-center gap-4 shadow-xl">
                  <h3 className="text-3xl font-black text-text-primary tracking-tight">
                    {sec.content?.heading || 'Ready to start your project?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
                    {sec.content?.subheading || 'Get in touch with our engineering directors today.'}
                  </p>
                  <Link to={sec.content?.buttonUrl || sec.content?.primaryBtnUrl || '/contact'}>
                    <Button variant="gradient" size="md" className="mt-2">
                      {sec.content?.buttonText || sec.content?.primaryBtnText || 'Contact Us'}
                    </Button>
                  </Link>
                </div>
              </section>
            )}

            {/* Generic Custom Section Fallback */}
            {!['hero', 'services_grid', 'value_pillars', 'cta_banner'].includes(sec.type) && (
              <section className="py-16 border-t border-border/40 max-w-5xl mx-auto px-6 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-primary block mb-2">
                  {sec.content?.badge || sec.content?.badgeText || sec.type}
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-text-primary">
                  {sec.content?.heading || sec.content?.headline || sec.name}
                </h3>
                <p className="text-xs sm:text-base text-text-secondary mt-4 leading-relaxed max-w-3xl mx-auto">
                  {sec.content?.description || sec.content?.subheading || sec.content?.bodyText}
                </p>
                {sec.content?.primaryBtnText && (
                  <div className="mt-6">
                    <Link to={sec.content?.primaryBtnUrl || '/contact'}>
                      <Button variant="gradient" size="md">
                        {sec.content.primaryBtnText}
                      </Button>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicPage;
