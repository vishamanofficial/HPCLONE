import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
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
  Layers,
  Send,
  Zap,
  Award,
  Clock,
  ThumbsUp
} from "lucide-react";
import { servicesData } from "../data/servicesData";
import { portfolioData } from "../data/portfolioData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Accordion } from "../components/ui/Accordion";
import { EngineeringJourney } from "../components/EngineeringJourney";

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

const techCategories = ["Frontend", "Backend", "Mobile", "Databases", "Cloud & DevOps"];
const techData: Record<string, Array<{ name: string; desc: string; highlight: string }>> = {
  Frontend: [
    { name: "React", desc: "For dynamic single-page applications and component architectures.", highlight: "Virtual DOM & Hooks" },
    { name: "Next.js", desc: "Used for server-side rendering, static site generation, and optimized web content.", highlight: "SSR & Edge Routing" },
    { name: "TypeScript", desc: "Ensures type safety, prevents runtime failures, and keeps codebases clean.", highlight: "Type Safe Compiler" },
    { name: "Tailwind CSS", desc: "Lightweight styles for responsive layouts and extremely fast page loading.", highlight: "Utility-First Styling" }
  ],
  Backend: [
    { name: "Node.js", desc: "Event-driven asynchronous I/O serving high-concurrency requests.", highlight: "High Throughput API" },
    { name: "Python", desc: "Powerful platform for batch processing, microservices, and AI algorithms.", highlight: "Fast Prototyping" },
    { name: "Java Spring", desc: "Robust framework for secure enterprise-grade systems.", highlight: "Multithreaded Scale" },
    { name: "FastAPI", desc: "High-performance API engine with automatic OpenAPI documentation.", highlight: "Asynchronous ASGI" }
  ],
  Mobile: [
    { name: "React Native", desc: "Cross-platform mobile apps targeting iOS & Android from one codebase.", highlight: "Native Bridge" },
    { name: "Flutter", desc: "High-performance widgets for fluid, paint-level canvas graphics.", highlight: "Skia Graphics Engine" },
    { name: "SwiftUI", desc: "Clean native Apple application interfaces utilizing modern state trees.", highlight: "Native iOS Speed" },
    { name: "Jetpack Compose", desc: "Modern Android UI toolkit for lightweight, robust native mobile apps.", highlight: "Declarative Android UI" }
  ],
  Databases: [
    { name: "PostgreSQL", desc: "ACID-compliant relational database cluster for critical business records.", highlight: "Advanced Indexing" },
    { name: "MongoDB", desc: "Flexible document-based NoSQL storage for fast-evolving schemas.", highlight: "Horizontal Sharding" },
    { name: "pgvector", desc: "Vector similarity engine enabling local semantic search indices.", highlight: "RAG Similarity Indexes" },
    { name: "Redis", desc: "High-speed in-memory data store for caching and pub/sub queues.", highlight: "Sub-millisecond Latency" }
  ],
  "Cloud & DevOps": [
    { name: "AWS", desc: "Comprehensive cloud platform for serverless and managed container clusters.", highlight: "Multi-Region Redundancy" },
    { name: "Docker", desc: "Standardized containerization guaranteeing consistent build compilation.", highlight: "Isolated Environments" },
    { name: "Kubernetes", desc: "Orchestration system to manage self-healing container workloads.", highlight: "Automated Scaling & Healing" },
    { name: "Terraform", desc: "Infrastructure as code to safely repeat server setup setups.", highlight: "Declarative Provisioning" }
  ]
};

export const Home: React.FC = () => {
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    const IconComponent = serviceIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const [activeTab, setActiveTab] = useState("Fintech");
  const [selectedTechCategory, setSelectedTechCategory] = useState("Frontend");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "$5k - $15k",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      setFormData({ name: "", email: "", budget: "$5k - $15k", message: "" });
    }, 1200);
  };

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

  // Motion variants configuration
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
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
      };



  const staggerContainer = shouldReduceMotion
    ? {
        initial: {},
        whileInView: {},
        viewport: { once: true }
      }
    : {
        initial: {},
        whileInView: { transition: { staggerChildren: 0.1 } },
        viewport: { once: true, margin: "-80px" }
      };

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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-24 bg-gradient-to-b from-surface to-bg">
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary">API Latency Target</span>
                  <span className="text-sm font-bold text-accent-orange">&lt;180ms</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                    className="h-full bg-accent-orange"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-secondary">SLA Compliance Guarantee</span>
                  <span className="text-sm font-bold text-green-500">100%</span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>
              <div className="bg-surface/50 border border-border/60 rounded-2xl p-4 flex items-center gap-3">
                <Code className="w-8 h-8 text-primary animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Free Maintenance</span>
                  <span className="text-[10px] text-text-secondary">2.5 Years post release support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Logo Marquee */}
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
              className="flex items-center justify-center bg-surface border border-border px-6 py-3 rounded-full text-sm font-bold text-text-secondary shadow-sm transition-transform duration-300 hover:scale-105 hover:border-primary/30"
            >
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Stats & Trust Section */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            {...fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Our Track Record
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              Engineered to Deliver Real Impact
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
              We stand by our metrics. Our engagement terms include concrete performance standards and delivery milestones.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-text-primary tracking-tight mb-2">180ms</span>
                <h3 className="font-bold text-sm text-text-primary mb-2">Avg API Latency Target</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Highly optimized databases and edge-CDN infrastructure ensuring real-time response speeds.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-text-primary tracking-tight mb-2">99.9%</span>
                <h3 className="font-bold text-sm text-text-primary mb-2">Core Service Uptime</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Decoupled serverless API microservices providing continuous operations under load.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-accent-pink/10 flex items-center justify-center text-accent-pink mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-text-primary tracking-tight mb-2">2.5 Yrs</span>
                <h3 className="font-bold text-sm text-text-primary mb-2">Free Maintenance Warranty</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Comprehensive security patches, bug fixes, and system health checks at zero extra cost.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-4xl font-black text-text-primary tracking-tight mb-2">7+ Yrs</span>
                <h3 className="font-bold text-sm text-text-primary mb-2">Average Engineer Track Record</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Staffed solely by senior engineering professionals. No interns, no cut corners, no placeholders.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            {...fadeInUp}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >
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
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-4">
                <TrendingUp className="w-10 h-10 text-primary" />
                <h3 className="font-bold text-lg text-text-primary">Performance Driven</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Our frontends score &gt;95 on lighthouse speed tests to ensure customer conversion.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-4">
                <Cpu className="w-10 h-10 text-accent-orange" />
                <h3 className="font-bold text-lg text-text-primary">Scalable Backends</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Microservice APIs decoupled to support horizontal scaling on server loads.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-4">
                <ShieldCheck className="w-10 h-10 text-green-500" />
                <h3 className="font-bold text-lg text-text-primary">Secured Infrastructure</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Security-first builds incorporating GDPR compliance, SSL, and data hashes.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-4">
                <Users className="w-10 h-10 text-accent-pink" />
                <h3 className="font-bold text-lg text-text-primary">Transparent Sprints</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Direct access to developers with live Git commits and daily status logs.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Service Offerings */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Core Service Offerings
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight max-w-3xl mx-auto">
              Dynamic Solutions Engineered for Scale
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
              Discover how HangingPanda develops, secures, and markets customized software frameworks.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left"
          >
            {servicesData.slice(0, 6).map((service) => (
              <motion.div key={service.slug} variants={fadeInUp}>
                <Card hoverEffect="glow" className="flex flex-col justify-between h-full group">
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Explorer Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              TECHNICAL DEPTH
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              Frameworks & Cloud Infrastructures
            </h2>
            <p className="text-text-secondary text-sm mt-4 max-w-xl mx-auto">
              We leverage reliable and scalable technologies to ensure product longevity, low maintenance overhead, and fast execution.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {techCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedTechCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                selectedTechCategory === cat
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-text-secondary border-border hover:bg-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTechCategory}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
          >
            {techData[selectedTechCategory].map((tech, idx) => (
              <Card key={idx} hoverEffect="glow" className="flex flex-col justify-between h-full bg-card p-6 border border-border/80">
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black text-primary tracking-wider uppercase bg-primary/10 px-2.5 py-1 rounded-md w-fit">
                    {tech.highlight}
                  </span>
                  <h3 className="font-bold text-lg text-text-primary mt-2">{tech.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {tech.desc}
                  </p>
                </div>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Our Process Section */}
      <EngineeringJourney />

      {/* Industries We Serve */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Industries We Serve
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              Tailored Domain Expertise
            </h2>
          </motion.div>
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
              className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                activeTab === ind
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-text-secondary border-border hover:bg-surface"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
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
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight mb-12">
              Trusted by Modern Startups
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-6 h-full">
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
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-6 h-full">
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
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-6 h-full">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Security & Compliance Section */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              ENTERPRISE SHIELD
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              Bank-Grade Security & Compliance
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
              We design and construct digital assets focusing strictly on threat mitigation, data privacy, and industry regulatory frameworks.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80 text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-text-primary mb-3">Data Isolation & Encryption</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  We deploy salted cryptography models, SHA hashes, and AES-256 database storage options. Access credentials are fully segregated to avoid leakage risks.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80 text-left">
                <div className="w-12 h-12 rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-text-primary mb-3">Compliance Ready Frameworks</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  All custom builds follow security guidelines compliant with standard regulations like GDPR data consent paths, HIPAA telemetry schemas, and SOC 2 audits.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-8 border border-border/80 text-left">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-text-primary mb-3">Vulnerability Scanning</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Our integration lines deploy automatic security scanners (SAST) to inspect packages, prevent SQL injections, and avoid cross-site scripting vulnerabilities.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-20 max-w-4xl mx-auto px-6 border-b border-border">
        <div className="text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Frequently Asked Queries
            </h2>
          </motion.div>
        </div>
        <motion.div {...fadeInUp}>
          <Accordion items={faqItems} />
        </motion.div>
      </section>

      {/* Direct Consultation / Lead Capture Section */}
      <section className="py-20 bg-gradient-to-b from-bg to-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.04),transparent_40%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            {...fadeInUp}
            className="lg:col-span-6 flex flex-col items-start text-left gap-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
              Consultation blueprint
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Get Your Bespoke Software Blueprint in 24 Hours
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Skip standard sales fluff. Share your concept, choose a budget range, and our senior engineers will formulate exact structural design blueprints, recommended tech stacks, and a breakdown of milestones.
            </p>

            <div className="flex flex-col gap-4 w-full mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Fast Turnaround</span>
                  <span className="text-[11px] text-text-secondary">Direct engineering feedback within 1 business day.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-accent-orange flex-shrink-0">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Zero Obligation Blueprint</span>
                  <span className="text-[11px] text-text-secondary">Keep the schema and logic breakdown even if you choose not to build with us.</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            {...fadeInUp}
            className="lg:col-span-6 w-full"
          >
            <Card hoverEffect="none" className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-2">Book a Scoping Session</h3>
              <p className="text-xs text-text-secondary mb-6">Let us analyze your app requirements and supply draft wireframe logic.</p>
              
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary">Blueprint Scheduled!</h4>
                  <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                    Thank you! Our engineering team has received your application. We will reach out to you within 24 hours at your email.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setFormSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5" htmlFor="form-name">Your Name</label>
                    <input 
                      type="text" 
                      id="form-name" 
                      required
                      placeholder="Jane Doe" 
                      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5" htmlFor="form-email">Work Email</label>
                    <input 
                      type="email" 
                      id="form-email" 
                      required
                      placeholder="jane@company.com" 
                      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5" htmlFor="form-budget">Est. Project Budget</label>
                    <select 
                      id="form-budget"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option>Under $5k</option>
                      <option>$5k - $15k</option>
                      <option>$15k - $50k</option>
                      <option>$50k+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5" htmlFor="form-message">Brief Project Concept</label>
                    <textarea 
                      id="form-message" 
                      required
                      rows={3}
                      placeholder="Describe what you want to build (e.g. mobile app, web dashboard, SaaS architecture)..." 
                      className="w-full px-4 py-3 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button variant="gradient" size="md" className="w-full mt-2 justify-center" type="submit" isLoading={formLoading} rightIcon={<Send className="w-4 h-4" />}>
                    Get My Free Blueprint
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-surface text-text-primary border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.1),transparent_40%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
          <motion.div 
            {...fadeInUp}
            className="flex flex-col items-center gap-6"
          >
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
          </motion.div>
        </div>
      </section>
    </>
  );
};
export default Home;
