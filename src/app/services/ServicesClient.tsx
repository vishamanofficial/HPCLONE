"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Code,
  Globe,
  Palette,
  Megaphone,
  Cpu,
  Compass,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Layers,
  HelpCircle,
  Search,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Sparkles,
  Clock,
  Shield,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

const serviceIcons: Record<string, React.ComponentType<any>> = {
  Smartphone,
  Code,
  Globe,
  Palette,
  Megaphone,
  Cpu,
  Compass,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Layers,
  HelpCircle,
};

interface ServicesClientProps {
  services: any[];
}

export const ServicesClient: React.FC<ServicesClientProps> = ({ services }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.4 },
      }
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };

  const categories = [
    { id: "all", label: "All Engineering Services" },
    { id: "apps", label: "Mobile & Web Apps" },
    { id: "enterprise", label: "Enterprise Software" },
    { id: "cloud", label: "Cloud & DevOps" },
    { id: "design", label: "Branding & UX" },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const title = (service.title || "").toLowerCase();
      const desc = (service.shortDesc || "").toLowerCase();
      const tech = Array.isArray(service.techStack)
        ? service.techStack.join(" ").toLowerCase()
        : "";
      const query = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        tech.includes(query);

      if (!matchesQuery) return false;

      if (selectedCategory === "all") return true;
      if (selectedCategory === "apps") {
        return (
          title.includes("app") ||
          title.includes("web") ||
          title.includes("mobile")
        );
      }
      if (selectedCategory === "enterprise") {
        return (
          title.includes("software") ||
          title.includes("transformation") ||
          title.includes("consulting")
        );
      }
      if (selectedCategory === "cloud") {
        return (
          title.includes("managed") ||
          title.includes("iot") ||
          tech.includes("aws") ||
          tech.includes("docker")
        );
      }
      if (selectedCategory === "design") {
        return (
          title.includes("brand") ||
          title.includes("design") ||
          title.includes("marketing")
        );
      }
      return true;
    });
  }, [services, searchQuery, selectedCategory]);

  const renderIcon = (name: string) => {
    const IconComp = serviceIcons[name] || Code;
    return <IconComp className="w-6 h-6 text-primary" />;
  };

  const guarantees = [
    {
      icon: Clock,
      title: "5% Weekly Delay Penalty",
      desc: "Guaranteed milestone delivery dates backed by financial performance penalties in our contract.",
    },
    {
      icon: Shield,
      title: "2.5 Years Free Maintenance",
      desc: "Zero-cost bug repairs, security patching, and server health checks for 30 months after launch.",
    },
    {
      icon: FileCheck,
      title: "100% IP & Code Ownership",
      desc: "Full copyright transfer, repository access, and architectural schemas transferred upon sign-off.",
    },
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-surface border-b border-border py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary">Services</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.06),transparent_40%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Engineering Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Software & App Services</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-5 leading-relaxed max-w-2xl mx-auto">
            From zero-defect mobile applications to microservice cloud architectures, {siteConfig.name} delivers production-ready systems backed by enforceable SLAs and dedicated engineering squads.
          </p>

          {/* Quick Action Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/app-cost-calculator">
              <Button variant="primary" size="md" leftIcon={<Calculator className="w-4 h-4" />}>
                Calculate Project Cost
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="md">
                Consult an Architect
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guarantees Strip */}
      <section className="py-8 bg-surface/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {guarantees.map((g, i) => (
            <div key={i} className="flex items-start gap-3.5 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <g.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-primary">{g.title}</span>
                <span className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{g.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Search & Filter Controls */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-primary/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-2xl p-8">
            <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-text-primary">No services found</h3>
            <p className="text-xs text-text-secondary mt-1">
              Try adjusting your search criteria or explore our full engineering catalog.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service: any) => {
              const slug = service.slug || service.id;
              return (
                <motion.div key={slug} {...fadeInUp}>
                  <Card
                    hoverEffect="glow"
                    className="flex flex-col justify-between h-full bg-card border border-border/80 p-6 sm:p-7 rounded-2xl group transition-all"
                  >
                    <div>
                      {/* Service Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {renderIcon(service.iconName)}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                          Enterprise Ready
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors tracking-headline mb-2">
                        {service.title}
                      </h3>

                      <p className="text-xs text-text-secondary leading-relaxed mb-5 line-clamp-3">
                        {service.shortDesc}
                      </p>

                      {/* Benefits Bullets */}
                      {Array.isArray(service.benefits) && service.benefits.length > 0 && (
                        <div className="space-y-2 mb-5">
                          {service.benefits.slice(0, 3).map((b: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Tags */}
                      {Array.isArray(service.techStack) && service.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {service.techStack.slice(0, 4).map((tech: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface border border-border text-text-secondary"
                            >
                              {tech}
                            </span>
                          ))}
                          {service.techStack.length > 4 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 text-text-muted">
                              +{service.techStack.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                      <Link
                        href={`/services/${slug}`}
                        className="text-xs font-bold text-primary hover:text-accent-orange transition-colors inline-flex items-center gap-1.5 group/link"
                      >
                        Explore Architecture
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>

                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}`}
                        className="text-[11px] font-semibold text-text-muted hover:text-text-primary transition-colors"
                      >
                        Book Call &rarr;
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-surface border-t border-border mt-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="w-6 h-6" />
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
            Need a Bespoke Engineering Architecture?
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
            Every software product is unique. Let our senior system architects analyze your app requirements, verify technical feasibility, and deliver an interactive blueprint within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <Link href="/app-cost-calculator">
              <Button variant="primary" size="lg" className="w-full justify-center">
                Calculate App Cost & Timeline
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full justify-center">
                Book a Scoping Session
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
