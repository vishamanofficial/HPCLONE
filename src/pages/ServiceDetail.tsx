import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  HelpCircle,
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
  Layers
} from "lucide-react";
import { servicesData } from "../data/servicesData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

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
  HelpCircle
};

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  const renderIcon = (name: string, className: string = "w-8 h-8") => {
    const IconComponent = serviceIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
  };

  return (
    <>
      <Helmet>
        <title>{`${service.title} Services | HangingPanda`}</title>
        <meta name="description" content={service.shortDesc} />
        <link rel="canonical" href={`https://hangingpanda.com/services/${service.slug}`} />
        <meta property="og:title" content={`${service.title} Services | HangingPanda`} />
        <meta property="og:description" content={service.shortDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://hangingpanda.com/services/${service.slug}`} />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${service.title} Services | HangingPanda`} />
        <meta name="twitter:description" content={service.shortDesc} />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="bg-surface border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-muted">Services</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary">{service.title}</span>
        </div>
      </div>

      <section className="py-20 bg-gradient-to-b from-surface to-bg border-b border-border">
        <div className="max-w-5xl mx-auto px-6 text-center md:text-left grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 flex flex-col items-start gap-4">
            <span className="p-3 bg-primary/10 rounded-2xl text-primary inline-flex">
              {renderIcon(service.iconName, "w-8 h-8")}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              {service.title}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mt-2">
              {service.longDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full justify-center">
                  Consult an Expert
                </Button>
              </Link>
              <Link to="/app-cost-calculator" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full justify-center">
                  Calculate Est. Cost
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 bg-card border border-border p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Core Technologies
            </span>
            <div className="flex flex-wrap gap-2">
              {service.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-bold text-text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col items-start text-left gap-4">
          <span className="text-xs font-black text-primary tracking-widest uppercase">
            Service Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight leading-tight">
            How We Add Immediate Value
          </h2>
          <div className="flex flex-col gap-4 mt-6 w-full">
            {service.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-surface p-4 rounded-xl border border-border/50">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-start text-left gap-4">
          <span className="text-xs font-black text-primary tracking-widest uppercase">
            Product Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight leading-tight">
            Built-in Architecture Deliverables
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 w-full">
            {service.features.map((feat, idx) => (
              <Card key={idx} hoverEffect="shadow" className="flex flex-col gap-2.5 bg-card">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-text-primary">{feat}</h3>
                <p className="text-[11px] text-text-secondary leading-normal">
                  Standard deployment compliance including logging traces and data hashes.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface text-text-primary border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Deploy {service.title} for Your Company
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg">
            Consult our engineering squad to draft a custom technical design document and schedule project delivery phases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full justify-center">
                Submit Inquiry Form
              </Button>
            </Link>
            <Link to="/app-cost-calculator" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full justify-center">
                Run App Estimator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default ServiceDetail;
