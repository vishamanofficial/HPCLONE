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
import { motion, useReducedMotion } from "framer-motion";
import { servicesData } from "../data/servicesData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Accordion } from "../components/ui/Accordion";

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

  const shouldReduceMotion = useReducedMotion();
  const fadeInUp = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.4 }
      }
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" as const }
      };

  const roadmapPhases = [
    { title: "Sprint 1: Scope & Wireframe", duration: "Weeks 1-2", desc: "We align on database schemas, project backlogs, and draw clickable Figma design layouts." },
    { title: "Sprint 2: Core Engineering", desc: "Developers set up Docker containers, establish DB query indexes, and configure API endpoints.", duration: "Weeks 3-6" },
    { title: "Sprint 3: Interface Integration", desc: "Integrate React components, manage dynamic state inputs, and run automated telemetry tests.", duration: "Weeks 7-10" },
    { title: "Sprint 4: QA & IP Transfer", desc: "Complete security vulnerability scans, transfer owners credentials, and transition to maintenance support.", duration: "Weeks 11-12" }
  ];

  const serviceFaqs = [
    { title: "How do you estimate this service's milestones?", content: "We analyze scope requirements, map deliverables to 2-week agile sprints, and outline exact timelines inside our standard SLA contracts." },
    { title: "Will I have direct communication channels with the engineers?", content: "Yes. We create shared Slack channels, establish bi-weekly staging review calls, and give you access to our active Git repositories." },
    { title: "What support options are included after release?", content: "Every build comes with 2.5 years of free maintenance. This covers software regressions, server health diagnostics, and compliance path audits." }
  ];

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

      {/* Dynamic Development Roadmap */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div {...fadeInUp}>
              <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
                BUILD LIFECYCLE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                Development Roadmap & Sprints
              </h2>
              <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
                We organize our engineering lifecycle into clear, bi-weekly sprints with bi-weekly demos.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {roadmapPhases.map((phase, idx) => (
              <motion.div key={idx} {...fadeInUp}>
                <Card hoverEffect="glow" className="flex flex-col gap-4 p-6 bg-card border border-border/80 h-full relative">
                  <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded w-fit">
                    {phase.duration}
                  </span>
                  <h3 className="font-extrabold text-sm text-text-primary mt-2">{phase.title}</h3>
                  <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                    {phase.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service-Specific FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-6 border-b border-border text-center">
        <div className="text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              COMMON QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              Service FAQ
            </h2>
          </motion.div>
        </div>
        <motion.div {...fadeInUp} className="text-left">
          <Accordion items={serviceFaqs} />
        </motion.div>
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
