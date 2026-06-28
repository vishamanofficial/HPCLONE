import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Star,
  Users,
  CheckCircle,
  Code,
  HelpCircle,
  Smartphone,
  Globe,
  Palette,
  Megaphone,
  Compass,
  BrainCircuit,
  Layers
} from "lucide-react";
import { servicesData } from "../data/servicesData";
import { portfolioData } from "../data/portfolioData";
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

export const Home: React.FC = () => {
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    const IconComponent = serviceIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const [activeTab, setActiveTab] = useState("Fintech");

  const industries = ["Fintech", "Healthcare", "E-commerce", "Education", "Logistics"];

  const activePortfolio = portfolioData.find((p) => p.category === activeTab) || portfolioData[0];

  const techLogos = [
    "React", "Node.js", "Python", "TypeScript", "Next.js", "Vite",
    "Java", "PostgreSQL", "MongoDB", "Flutter", "Swift", "Kotlin",
    "AWS", "Docker", "Kubernetes", "Firebase"
  ];

  const faqItems = [
    {
      title: "What are your core engineering models?",
      content: "We support three engagement pathways: Fixed Price Contracts (best for defined MVPs), Hourly Dedicated Developers (starting at $20/hour for flexible backlog sprints), and Dedicated Offshore Teams (for scaling enterprise systems)."
    },
    {
      title: "Do I own the source code of my application?",
      content: "Yes, absolutely. Once final deliverables are approved and milestones completed, full IP ownership, source repository access, and code assets are transferred to your company under our standard agreement rules."
    },
    {
      title: "How do you guarantee project delivery dates?",
      content: "We implement 5% weekly SLA penalties for delayed milestones and back our delivery timelines with a financial performance guarantee. We also supply real-time live code tracking logs so you see every commit."
    },
    {
      title: "Do you offer post-release support & maintenance?",
      content: "Yes. Every custom build includes 2.5 years of comprehensive bug-fix maintenance, server health monitoring, and security patch updates at zero extra charge to guarantee product longevity."
    }
  ];

  return (
    <>
      <Helmet>
        <title>HangingPanda | AI-Powered Custom Software & Mobile App Development</title>
        <meta
          name="description"
          content="HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms. Get your development quote using our App Cost Calculator."
        />
        <link rel="canonical" href="https://hangingpanda.com/" />
        <meta property="og:title" content="HangingPanda | AI-Powered Custom Software & Mobile App Development" />
        <meta property="og:description" content="HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms. Get your development quote using our App Cost Calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HangingPanda | AI-Powered Custom Software & Mobile App Development" />
        <meta name="twitter:description" content="HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms. Get your development quote using our App Cost Calculator." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="relative overflow-hidden py-8 md:py-16 bg-gradient-to-b from-surface to-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.06),transparent_45%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Next-Gen Software Engineering
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-tight"
            >
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Software Development</span> for Leaders.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-secondary mt-6 max-w-2xl leading-relaxed"
            >
              Recreating digital landscapes with secure native mobile apps, web design tokens, and modular enterprise algorithms. Backed by 2.5 years of free maintenance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-10 w-full sm:w-auto"
            >
              <Link to="/app-cost-calculator" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full justify-center">
                  Consult Our Experts
                </Button>
              </Link>
              <Link to="/case-studies" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View Portfolio
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent-orange/10 rounded-3xl rotate-3 scale-105 filter blur-xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative bg-card border border-border shadow-2xl rounded-3xl p-8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Live Project Metrics
                </span>
                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold text-[10px] animate-pulse">
                  Connected
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary">App Speed Index</span>
                  <span className="text-sm font-bold text-primary">98/100</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[98%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary">API Latency Target</span>
                  <span className="text-sm font-bold text-accent-orange">&lt;180ms</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent-orange w-[88%]" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary">SLA Compliance Guarantee</span>
                  <span className="text-sm font-bold text-green-500">100%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[100%]" />
                </div>
              </div>
              <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 flex items-center gap-3">
                <Code className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Free Maintenance</span>
                  <span className="text-[10px] text-text-secondary">2.5 Years post release support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-card border-y border-border py-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Leveraging Modern Frameworks
          </span>
        </div>
        <div className="flex w-[200%] gap-12 items-center animate-scroll-strip">
          {[...techLogos, ...techLogos].map((tech, index) => (
            <div
              key={index}
              className="flex items-center justify-center bg-surface border border-border px-6 py-3 rounded-full text-sm font-bold text-text-secondary shadow-sm"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
              Your Specialized Digital Innovation Partner
            </h2>
            <p className="text-text-secondary mt-6 text-sm sm:text-base leading-relaxed">
              At HangingPanda, we reject generic one-size-fits-all coding templates. We audit your workflows and formulate exact web, mobile, and automation tools that scale operations.
            </p>
            <div className="flex flex-col gap-4 mt-8 w-full">
              {[
                "Custom built architectures, zero code templates",
                "Senior developer staff with over 7+ years track records",
                "Robust SLA contracts with clear timelines"
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-text-primary">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card hoverEffect="scale" className="flex flex-col gap-4">
              <TrendingUp className="w-10 h-10 text-primary" />
              <h3 className="font-bold text-lg text-text-primary">Performance Driven</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our frontends score &gt;95 on lighthouse speed tests to ensure customer conversion.
              </p>
            </Card>
            <Card hoverEffect="scale" className="flex flex-col gap-4">
              <Cpu className="w-10 h-10 text-accent-orange" />
              <h3 className="font-bold text-lg text-text-primary">Scalable Backends</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Microservice APIs decoupled to support horizontal scaling on server loads.
              </p>
            </Card>
            <Card hoverEffect="scale" className="flex flex-col gap-4">
              <ShieldCheck className="w-10 h-10 text-green-500" />
              <h3 className="font-bold text-lg text-text-primary">Secured Infrastructure</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Security-first builds incorporating GDPR compliance, SSL, and data hashes.
              </p>
            </Card>
            <Card hoverEffect="scale" className="flex flex-col gap-4">
              <Users className="w-10 h-10 text-accent-pink" />
              <h3 className="font-bold text-lg text-text-primary">Transparent Sprints</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Direct access to developers with live Git commits and daily status logs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Core Service Offerings
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight max-w-3xl mx-auto">
            Dynamic Solutions Engineered for Scale
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Discover how HangingPanda develops, secures, and markets customized software frameworks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
            {servicesData.slice(0, 6).map((service) => (
              <Card key={service.slug} hoverEffect="glow" className="flex flex-col justify-between h-full group">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {renderIcon(service.iconName, "w-6 h-6")}
                    </span>
                    <h3 className="font-bold text-lg text-text-primary">{service.title}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-2">
                    {service.shortDesc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold">
                  <Link to={`/services/${service.slug}`} className="text-primary hover:underline flex items-center gap-1">
                    Explore Service &rarr;
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Industries We Serve
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Tailored Domain Expertise
          </h2>
        </div>

        <div role="tablist" className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {industries.map((ind) => (
            <button
              key={ind}
              id={`industry-tab-${ind}`}
              role="tab"
              aria-selected={activeTab === ind}
              aria-controls={`industry-panel-${ind}`}
              onClick={() => setActiveTab(ind)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${activeTab === ind
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-card text-text-secondary border-border hover:bg-surface"
                }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <div
          id={`industry-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`industry-tab-${activeTab}`}
          className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Success Highlight ({activePortfolio.category})
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              {activePortfolio.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {activePortfolio.description}
            </p>
            <div className="flex gap-4 flex-wrap mt-2">
              {activePortfolio.tags.map((t) => (
                <span key={t} className="px-3 py-1 bg-surface border border-border text-xs font-semibold rounded-lg text-text-secondary">
                  {t}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6 w-full pt-6 border-t border-border">
              {activePortfolio.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
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
          <div className="lg:col-span-5">
            <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-primary/10 to-accent-orange/10 border border-border p-6 flex flex-col justify-between">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                HP
              </span>
              <div>
                <span className="text-xs font-bold text-text-muted uppercase">Engineered Stack</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activePortfolio.techStack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 bg-card border border-border text-[10px] font-bold rounded-md text-text-primary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-12">
            Trusted by Modern Startups
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <Card hoverEffect="shadow" className="flex flex-col justify-between p-6">
              <div className="flex flex-col gap-4">
                <div className="flex text-primary gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  "HangingPanda helped rebuild our legacy inventory dashboard. Code execution rates jumped, latency dropped, and their developers handled our MQTT telemetry with ease."
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-6 border-t border-border/40 pt-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  WS
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">Waves Services</span>
                  <span className="text-[10px] font-semibold text-text-muted">Operations Director</span>
                </div>
              </div>
            </Card>

            <Card hoverEffect="shadow" className="flex flex-col justify-between p-6">
              <div className="flex flex-col gap-4">
                <div className="flex text-primary gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  "The App Cost Calculator gave us an exact ballpark in minutes. Their cross-platform Swift and Kotlin delivery was on time, saving us 30% compared to local design shops."
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-6 border-t border-border/40 pt-4">
                <div className="w-10 h-10 rounded-full bg-accent-orange/20 flex items-center justify-center font-bold text-accent-orange">
                  QE
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">Quantum Edge</span>
                  <span className="text-[10px] font-semibold text-text-muted">Technical Lead</span>
                </div>
              </div>
            </Card>

            <Card hoverEffect="shadow" className="flex flex-col justify-between p-6">
              <div className="flex flex-col gap-4">
                <div className="flex text-primary gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed">
                  "Their post-release maintenance of 2.5 years has kept our database clusters secure. They function as a true engineering partner, not just a service provider."
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-6 border-t border-border/40 pt-4">
                <div className="w-10 h-10 rounded-full bg-accent-pink/20 flex items-center justify-center font-bold text-accent-pink">
                  HM
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">Horizon Marketing</span>
                  <span className="text-[10px] font-semibold text-text-muted">Product Owner</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Frequently Asked Queries
          </h2>
        </div>
        <Accordion items={faqItems} />
      </section>

      <section className="py-20 bg-surface text-text-primary border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.1),transparent_40%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Build Your App?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl">
            Get an instant cost assessment or contact our engineering team to draft custom software blueprints.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link to="/app-cost-calculator" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full justify-center">
                Calculate App Cost
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full justify-center">
                Contact Experts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
