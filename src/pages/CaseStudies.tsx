import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { portfolioData } from "../data/portfolioData";
import { Button } from "../components/ui/Button";

export const CaseStudies: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio & Case Studies | HangingPanda Success Metrics</title>
        <meta
          name="description"
          content="Explore our case studies. HangingPanda builds custom app developments and software databases that increase conversion rates and support user scaling."
        />
        <link rel="canonical" href="https://hangingpanda.com/case-studies" />
        <meta property="og:title" content="Portfolio & Case Studies | HangingPanda Success Metrics" />
        <meta property="og:description" content="Explore our case studies. HangingPanda builds custom app developments and software databases that increase conversion rates and support user scaling." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/case-studies" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio & Case Studies | HangingPanda Success Metrics" />
        <meta name="twitter:description" content="Explore our case studies. HangingPanda builds custom app developments and software databases that increase conversion rates and support user scaling." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Our Success Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Software Products that Deliver <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Real Business Value</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
            Review detailed case study profiles of custom software, cross-platform apps, and enterprise tools engineered by HangingPanda.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col gap-16">
          {portfolioData.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={project.id}
                id={project.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-border/80 p-6 sm:p-10 bg-card rounded-3xl shadow-xl transition-all duration-300 hover:border-primary/20 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                <div className={`lg:col-span-7 flex flex-col items-start text-left gap-4 ${
                  isEven ? "" : "lg:order-2"
                }`}>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
                    {project.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex gap-4 flex-wrap mt-2">
                    {project.tags.map((t) => (
                      <span key={t} className="px-3 py-1 bg-surface border border-border text-xs font-semibold rounded-lg text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6 mt-6 w-full pt-6 border-t border-border">
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black text-text-primary">
                          {m.value}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-text-muted mt-1 leading-none">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`lg:col-span-5 w-full ${
                  isEven ? "" : "lg:order-1"
                }`}>
                  <div className={`aspect-video w-full rounded-2xl bg-gradient-to-tr ${project.highlightColor} border border-white/10 p-8 flex flex-col justify-between text-white shadow-lg`}>
                    <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold">
                      HP
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white/70 uppercase">Engineered Architecture</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold rounded-md text-white">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 bg-surface text-text-primary border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Build Your Own Success Story
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg">
            Consult our developers to outline your app requirement blueprint and establish exact milestones.
          </p>
          <Link to="/app-cost-calculator">
            <Button variant="gradient" size="lg">
              Get App Estimate
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default CaseStudies;
