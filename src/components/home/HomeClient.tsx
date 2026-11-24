"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  ThumbsUp,
  Sparkles
} from "lucide-react";
import { servicesData } from "@/data/servicesData";
import { portfolioData } from "@/data/portfolioData";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import { siteConfig } from "@/config/site";
const EngineeringJourney = dynamic(
  () => import("@/components/EngineeringJourney").then((m) => m.EngineeringJourney),
  {
    loading: () => (
      <div className="py-20 flex justify-center items-center text-text-muted text-sm">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    ),
  }
);
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TechBackground } from "@/components/TechBackground";
import { nextApi } from "@/lib/api";
import { useToast } from "@/components/admin/Toast";

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

interface HomeClientProps {
  pageData?: any;
  sections?: any[];
  dynamicServices?: any[];
  dynamicPortfolio?: any[];
}

export const HomeClient: React.FC<HomeClientProps> = ({
  sections = [],
  dynamicServices,
  dynamicPortfolio
}) => {
  const { error: toastError, success: toastSuccess } = useToast();
  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    const IconComponent = serviceIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const servicesList = dynamicServices && dynamicServices.length > 0 ? dynamicServices : servicesData;
  const portfolioList = dynamicPortfolio && dynamicPortfolio.length > 0 ? dynamicPortfolio : portfolioData;

  // Section content helpers
  const getSection = (type: string) => sections.find((s) => s.type === type);
  const heroSec = getSection('hero')?.content;
  const servicesSec = getSection('services_grid')?.content;
  const pillarsSec = getSection('value_pillars')?.content;
  const industriesSec = getSection('industry_tabs')?.content;
  const testimonialsSec = getSection('testimonials_slider')?.content;
  const faqSec = getSection('faq_accordion')?.content;
  const ctaSec = getSection('cta_banner')?.content;

  const [activeTab, setActiveTab] = useState("Fintech");
  const [selectedTechCategory, setSelectedTechCategory] = useState("Frontend");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    isWhatsApp: true,
    budget: "$5k - $15k",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const formErrors: Record<string, string> = {};
    if (!formData.name.trim()) formErrors.name = "Name is required";
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      formErrors.phone = "Phone number is required";
    } else if (!/^\d{6,15}$/.test(cleanPhone.replace(/[\s()-]/g, ""))) {
      formErrors.phone = "Please enter a valid phone number (6 to 15 digits)";
    }
    if (!formData.message.trim()) {
      formErrors.message = "Concept description is required";
    } else if (formData.message.trim().length < 10) {
      formErrors.message = "Concept must be at least 10 characters long";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormLoading(true);
    setSubmitError("");

    try {
      await nextApi.submitInquiry({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        isWhatsApp: formData.isWhatsApp,
        budget: formData.budget,
        message: formData.message,
        source: 'homepage_blueprint'
      });

      setFormLoading(false);
      setFormSubmitted(true);
      toastSuccess("Thank you! Your blueprint inquiry has been received. Our team will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        isWhatsApp: true,
        budget: "$5k - $15k",
        message: ""
      });
      setErrors({});
    } catch (error: any) {
      console.error(error);
      setFormLoading(false);
      const friendlyMsg = error.message || "There was an error sending your request. Please check your network and try again.";
      setSubmitError(friendlyMsg);
      toastError(friendlyMsg);
    }
  };

  const industries = ["Fintech", "Healthcare", "E-commerce", "Education", "Logistics"];
  const activePortfolio = portfolioList.find((p: any) => p.category === activeTab) || portfolioList[0];

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
      {/* Redesigned Cinematic Tech Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-16 sm:pt-12 sm:pb-24 md:pt-16 md:pb-32 min-h-[80vh] flex items-center justify-center bg-bg">
        <TechBackground />

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
          {/* Monumental Display Headline - Instantly visible on mount for optimal FCP/LCP */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary tracking-display leading-[1.08] sm:leading-[1.04] max-w-5xl">
            {heroSec?.headline ? (
              <span>{heroSec.headline}</span>
            ) : (
              <>
                Engineering Intelligent Software At{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-orange to-accent-pink drop-shadow-sm">
                  Uncompromising Scale.
                </span>
              </>
            )}
          </h1>

          {/* High-Precision Subheading */}
          <p className="text-sm sm:text-lg md:text-xl text-text-secondary mt-4 sm:mt-6 max-w-3xl leading-relaxed tracking-body font-normal">
            {heroSec?.description ||
              "We build custom web platforms, mobile applications, and smart AI automation tools tailored to your business goals. Backed by 2.5 years of free maintenance."}
          </p>

          {/* Value Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5 sm:mt-8 max-w-3xl">
            {[
              { label: "Lightning-Fast Performance", icon: Zap },
              { label: "Smart AI Solutions", icon: BrainCircuit },
              { label: "100% Private & Secure", icon: ShieldCheck },
              { label: "iOS & Android Apps", icon: Smartphone },
              { label: "2.5 Years Free Maintenance", icon: Award }
            ].map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <div
                  key={idx}
                  className="apple-glass-clear px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-text-primary border border-border/80 flex items-center gap-1.5 transition-all duration-200 hover:border-primary/40 hover:scale-[1.02] cursor-default"
                >
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{chip.label}</span>
                </div>
              );
            })}
          </div>

          {/* Action Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-7 sm:mt-10 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link href={heroSec?.primaryBtnUrl || "/app-cost-calculator"} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-md shadow-primary/20 min-h-[48px]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {heroSec?.primaryBtnText || "Consult Our Experts"}
              </Button>
            </Link>
            <Link href={heroSec?.secondaryBtnUrl || "/case-studies"} className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="lg"
                className="w-full justify-center min-h-[48px]"
                leftIcon={<Sparkles className="w-4 h-4 text-accent-orange" />}
              >
                {heroSec?.secondaryBtnText || "View Our Portfolio"}
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees Panel */}
          <div className="w-full max-w-4xl mt-10 sm:mt-14 apple-glass rounded-2xl p-4 sm:p-5 border border-border/80 shadow-xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3.5 sm:mb-4 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-text-primary tracking-tight">
                  {heroSec?.badgeText || `${siteConfig.name} Service Commitments`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold text-green-500">
                  Guaranteed Standards
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 text-left">
              <div className="p-3 sm:p-3.5 rounded-xl bg-surface/70 border border-border/60 flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider">Delivery</span>
                <span className="text-sm sm:text-base font-extrabold text-primary">On-Time Milestones</span>
                <span className="text-[10px] sm:text-xs text-text-secondary leading-tight mt-0.5">Strict weekly SLA schedule</span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface/70 border border-border/60 flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider">Reliability</span>
                <span className="text-sm sm:text-base font-extrabold text-green-500">99.9% Uptime</span>
                <span className="text-[10px] sm:text-xs text-text-secondary leading-tight mt-0.5">Zero downtime architecture</span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface/70 border border-border/60 flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider">Support</span>
                <span className="text-sm sm:text-base font-extrabold text-accent-orange">2.5 Years Free</span>
                <span className="text-[10px] sm:text-xs text-text-secondary leading-tight mt-0.5">Comprehensive bug fixes included</span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-surface/70 border border-border/60 flex flex-col gap-0.5">
                <span className="text-[10px] sm:text-xs text-text-muted uppercase font-bold tracking-wider">Ownership</span>
                <span className="text-sm sm:text-base font-extrabold text-text-primary">100% Code IP</span>
                <span className="text-[10px] sm:text-xs text-text-secondary leading-tight mt-0.5">You own all source code</span>
              </div>
            </div>
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

      {/* Stats & Track Record Section */}
      <section className="py-10 sm:py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              Our Track Record
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              Engineered to Deliver Real Impact
            </h2>
            <p className="text-text-secondary text-xs sm:text-base mt-2 sm:mt-4 max-w-xl mx-auto">
              We stand by our metrics. Our engagement terms include concrete performance standards and delivery milestones.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-3.5 sm:p-7 border border-border/80 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-6">
                  <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-4xl font-black text-text-primary tracking-tight mb-1 sm:mb-2">180ms</span>
                <h3 className="font-bold text-xs sm:text-sm text-text-primary mb-1 sm:mb-2 leading-tight">Avg API Latency</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Optimized databases and edge-CDN infrastructure ensuring real-time response speeds.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-3.5 sm:p-7 border border-border/80 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-3 sm:mb-6">
                  <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-4xl font-black text-text-primary tracking-tight mb-1 sm:mb-2">99.9%</span>
                <h3 className="font-bold text-xs sm:text-sm text-text-primary mb-1 sm:mb-2 leading-tight">Service Uptime</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Decoupled serverless microservices providing continuous operations under load.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-3.5 sm:p-7 border border-border/80 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-accent-pink/10 flex items-center justify-center text-accent-pink mb-3 sm:mb-6">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-4xl font-black text-text-primary tracking-tight mb-1 sm:mb-2">2.5 Yrs</span>
                <h3 className="font-bold text-xs sm:text-sm text-text-primary mb-1 sm:mb-2 leading-tight">Free Warranty</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Comprehensive security patches, bug fixes, and health checks at zero extra cost.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-3.5 sm:p-7 border border-border/80 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-3 sm:mb-6">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-4xl font-black text-text-primary tracking-tight mb-1 sm:mb-2">7+ Yrs</span>
                <h3 className="font-bold text-xs sm:text-sm text-text-primary mb-1 sm:mb-2 leading-tight">Engineer Track Record</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Staffed solely by senior engineering professionals. No interns or placeholders.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <motion.div {...fadeInUp} className="lg:col-span-5 flex flex-col items-start text-left">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              {pillarsSec?.badge || "Who We Are"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
              {pillarsSec?.heading || "Your Specialized Digital Innovation Partner"}
            </h2>
            <p className="text-text-secondary mt-3 sm:mt-6 text-xs sm:text-base leading-relaxed">
              {pillarsSec?.subheading || `At ${siteConfig.name}, we reject generic one-size-fits-all coding templates. We audit your workflows and formulate exact web, mobile, and automation tools that scale operations.`}
            </p>
            <div className="flex flex-col gap-2.5 sm:gap-4 mt-5 sm:mt-8 w-full">
              {[
                "Custom built architectures, zero code templates",
                "Senior developer staff with over 7+ years track records",
                "Robust SLA contracts with clear timelines"
              ].map((val, idx) => (
                <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-text-primary">{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-6 mt-4 sm:mt-0"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-2 sm:gap-4 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10 text-primary" />
                <h3 className="font-bold text-xs sm:text-lg text-text-primary leading-tight">Performance Driven</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Our frontends score &gt;95 on lighthouse speed tests to ensure customer conversion.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-2 sm:gap-4 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <Cpu className="w-6 h-6 sm:w-10 sm:h-10 text-accent-orange" />
                <h3 className="font-bold text-xs sm:text-lg text-text-primary leading-tight">Scalable Backends</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Microservice APIs decoupled to support horizontal scaling on server loads.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-2 sm:gap-4 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <ShieldCheck className="w-6 h-6 sm:w-10 sm:h-10 text-green-500" />
                <h3 className="font-bold text-xs sm:text-lg text-text-primary leading-tight">Secured Builds</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Security-first builds incorporating GDPR compliance, SSL, and data hashes.
                </p>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="scale" className="flex flex-col gap-2 sm:gap-4 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <Users className="w-6 h-6 sm:w-10 sm:h-10 text-accent-pink" />
                <h3 className="font-bold text-xs sm:text-lg text-text-primary leading-tight">Transparent Sprints</h3>
                <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  Direct access to developers with live Git commits and daily status logs.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Service Offerings */}
      <section className="py-10 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              {servicesSec?.badge || "Core Service Offerings"}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight max-w-3xl mx-auto">
              {servicesSec?.heading || "Dynamic Solutions Engineered for Scale"}
            </h2>
            <p className="text-text-secondary text-xs sm:text-base mt-2 sm:mt-4 max-w-xl mx-auto">
              {servicesSec?.subheading || `Discover how ${siteConfig.name} develops, secures, and markets customized software frameworks.`}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 mt-8 sm:mt-12 text-left"
          >
            {servicesList.slice(0, 6).map((service: any) => (
              <motion.div key={service.slug || service.id} variants={fadeInUp}>
                <Card hoverEffect="glow" className="flex flex-col justify-between h-full group p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="p-2 sm:p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {renderIcon(service.iconName, "w-5 h-5 sm:w-6 sm:h-6")}
                      </span>
                      <h3 className="font-bold text-sm sm:text-lg text-text-primary leading-tight">{service.title}</h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-snug sm:leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold">
                    <Link
                      href={`/services/${service.slug || service.id}`}
                      className="text-primary hover:underline flex items-center gap-1"
                      aria-label={`Explore ${service.title} service`}
                    >
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
      <section className="py-10 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              TECHNICAL DEPTH
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              Frameworks & Cloud Infrastructures
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm mt-2 sm:mt-4 max-w-xl mx-auto">
              We leverage reliable and scalable technologies to ensure product longevity, low maintenance overhead, and fast execution.
            </p>
          </motion.div>
        </div>

        <div className="flex justify-center mb-6 sm:mb-10 px-2">
          <div className="p-1 rounded-2xl sm:rounded-full bg-surface border border-border inline-flex flex-wrap gap-1 shadow-xs max-w-full justify-center">
            {techCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTechCategory(cat)}
                className={`min-h-[38px] px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  selectedTechCategory === cat
                    ? "bg-card text-text-primary shadow-xs font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-card/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTechCategory}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 text-left"
          >
            {techData[selectedTechCategory].map((tech, idx) => (
              <Card key={idx} hoverEffect="glow" className="flex flex-col justify-between h-full bg-card p-3 sm:p-6 border border-border/80 rounded-xl sm:rounded-2xl">
                <div className="flex flex-col gap-1.5 sm:gap-3">
                  <span className="text-[9px] sm:text-[10px] font-black text-primary tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-md w-fit">
                    {tech.highlight}
                  </span>
                  <h3 className="font-bold text-xs sm:text-lg text-text-primary mt-1 sm:mt-2 leading-tight">{tech.name}</h3>
                  <p className="text-[10px] sm:text-xs text-text-secondary leading-snug sm:leading-relaxed mt-0.5 line-clamp-3 sm:line-clamp-none">
                    {tech.desc}
                  </p>
                </div>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 4-Step Engineering Journey */}
      <EngineeringJourney />

      {/* Industries We Serve */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              {industriesSec?.badge || "Industries We Serve"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
              {industriesSec?.heading || "Tailored Domain Expertise"}
            </h2>
          </motion.div>
        </div>

        <div className="flex justify-center mb-10 px-2">
          <div role="tablist" className="p-1 rounded-2xl sm:rounded-full bg-surface border border-border inline-flex flex-wrap gap-1 shadow-xs max-w-full justify-center">
            {industries.map((ind) => (
              <button
                key={ind}
                id={`industry-tab-${ind}`}
                role="tab"
                aria-selected={activeTab === ind}
                aria-controls={`industry-panel-${ind}`}
                onClick={() => setActiveTab(ind)}
                className={`min-h-[40px] px-4 sm:px-6 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === ind
                    ? "bg-card text-text-primary shadow-xs font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-card/50"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
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
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
          >
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-2.5 sm:gap-4">
              <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-widest">
                Success Highlight ({activePortfolio.category})
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-text-primary tracking-tight">
                {activePortfolio.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {activePortfolio.description}
              </p>
              <div className="flex gap-2 sm:gap-3 flex-wrap mt-1 sm:mt-2">
                {activePortfolio.tags.map((t: string) => (
                  <span key={t} className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-surface border border-border text-[11px] sm:text-xs font-semibold rounded-lg text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-4 sm:mt-6 w-full pt-4 sm:pt-6 border-t border-border">
                {activePortfolio.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-base sm:text-2xl font-black text-text-primary">
                      {m.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-text-muted mt-0.5 sm:mt-1 leading-tight">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-video w-full rounded-xl sm:rounded-2xl bg-gradient-to-tr from-primary/10 to-accent-orange/10 border border-border p-4 sm:p-6 flex flex-col justify-between">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                  HP
                </span>
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-text-muted uppercase">Engineered Stack</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 sm:mt-2">
                    {activePortfolio.techStack.map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-card border border-border text-[9px] sm:text-[10px] font-bold rounded-md text-text-primary">
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
      <section className="py-10 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              {testimonialsSec?.badge || "Client Testimonials"}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight mb-8 sm:mb-12">
              {testimonialsSec?.heading || "Trusted by Modern Startups"}
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 text-left"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <div className="flex flex-col gap-2.5 sm:gap-4">
                  <div className="flex text-primary gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
                    &ldquo;{siteConfig.name} helped rebuild our legacy inventory dashboard. Code execution rates jumped, latency dropped, and their developers handled our MQTT telemetry with ease.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3.5 mt-4 sm:mt-6 border-t border-border/40 pt-3 sm:pt-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs sm:text-sm text-primary shrink-0">
                    WS
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-text-primary">Waves Services</span>
                    <span className="text-[10px] font-semibold text-text-muted">Operations Director</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <div className="flex flex-col gap-2.5 sm:gap-4">
                  <div className="flex text-primary gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
                    &ldquo;The App Cost Calculator gave us an exact ballpark in minutes. Their cross-platform Swift and Kotlin delivery was on time, saving us 30% compared to local design shops.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3.5 mt-4 sm:mt-6 border-t border-border/40 pt-3 sm:pt-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-orange/20 flex items-center justify-center font-bold text-xs sm:text-sm text-accent-orange shrink-0">
                    QE
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-text-primary">Quantum Edge</span>
                    <span className="text-[10px] font-semibold text-text-muted">Technical Lead</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="shadow" className="flex flex-col justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl h-full">
                <div className="flex flex-col gap-2.5 sm:gap-4">
                  <div className="flex text-primary gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
                    &ldquo;Their post-release maintenance of 2.5 years has kept our database clusters secure. They function as a true engineering partner, not just a service provider.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2.5 sm:gap-3.5 mt-4 sm:mt-6 border-t border-border/40 pt-3 sm:pt-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent-pink/20 flex items-center justify-center font-bold text-xs sm:text-sm text-accent-pink shrink-0">
                    HM
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-text-primary">Horizon Marketing</span>
                    <span className="text-[10px] font-semibold text-text-muted">Product Owner</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Security & Compliance Section */}
      <section className="py-10 sm:py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              ENTERPRISE SHIELD
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight">
              Bank-Grade Security & Compliance
            </h2>
            <p className="text-text-secondary text-xs sm:text-base mt-2 sm:mt-4 max-w-xl mx-auto">
              We design and construct digital assets focusing strictly on threat mitigation, data privacy, and industry regulatory frameworks.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-4 sm:p-8 border border-border/80 text-left rounded-xl sm:rounded-2xl">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-6">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-lg text-text-primary mb-1.5 sm:mb-3">Data Isolation & Encryption</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  We deploy salted cryptography models, SHA hashes, and AES-256 database storage options. Access credentials are fully segregated.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-4 sm:p-8 border border-border/80 text-left rounded-xl sm:rounded-2xl">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-accent-orange/10 flex items-center justify-center text-accent-orange mb-3 sm:mb-6">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-lg text-text-primary mb-1.5 sm:mb-3">Compliance Ready</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  All custom builds follow security guidelines compliant with standard regulations like GDPR data consent paths, HIPAA schemas, and SOC 2 audits.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hoverEffect="glow" className="flex flex-col h-full bg-card p-4 sm:p-8 border border-border/80 text-left rounded-xl sm:rounded-2xl">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-3 sm:mb-6">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-lg text-text-primary mb-1.5 sm:mb-3">Vulnerability Scanning</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Our integration lines deploy automatic security scanners (SAST) to inspect packages, prevent SQL injections, and avoid XSS vulnerabilities.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Common Questions */}
      <section className="py-10 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 border-b border-border">
        <div className="text-center mb-8 sm:mb-12">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-2 sm:mb-3">
              {faqSec?.badge || "Common Questions"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
              {faqSec?.heading || "Frequently Asked Queries"}
            </h2>
          </motion.div>
        </div>
        <motion.div {...fadeInUp}>
          <Accordion items={faqItems} />
        </motion.div>
      </section>

      {/* Blueprint / Lead Capture Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-bg to-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.04),transparent_40%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
          <motion.div {...fadeInUp} className="lg:col-span-6 flex flex-col items-start text-left gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider">
              Consultation blueprint
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-primary tracking-tight leading-tight">
              Get Your Bespoke Software Blueprint in 24 Hours
            </h2>
            <p className="text-xs sm:text-base text-text-secondary leading-relaxed">
              Skip standard sales fluff. Share your concept, choose a budget range, and our senior engineers will formulate exact structural design blueprints, recommended tech stacks, and a breakdown of milestones.
            </p>

            <div className="flex flex-col gap-3 sm:gap-4 w-full mt-2 sm:mt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Fast Turnaround</span>
                  <span className="text-[11px] text-text-secondary">Direct engineering feedback within 1 business day.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card border border-border flex items-center justify-center text-accent-orange flex-shrink-0">
                  <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-primary">Zero Obligation Blueprint</span>
                  <span className="text-[11px] text-text-secondary">Keep the schema and logic breakdown even if you choose not to build with us.</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="lg:col-span-6 w-full">
            <Card hoverEffect="none" className="bg-card border border-border/80 p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden">
              <h3 className="text-lg sm:text-2xl font-extrabold text-text-primary tracking-headline mb-1.5 sm:mb-2">Book a Scoping Session</h3>
              <p className="text-xs text-text-secondary mb-4 sm:mb-6 tracking-body">Let our senior software architects analyze your app requirements and supply draft system diagrams.</p>
              
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary tracking-headline">Blueprint Scheduled!</h4>
                  <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                    Thank you! Our engineering team has received your application. We will reach out to you within 24 hours at your email.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setFormSubmitted(false)}>
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-left">
                  <Input
                    label="Your Name"
                    id="form-name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    error={errors.name}
                  />
                  
                  <Input
                    label="Work Email"
                    id="form-email"
                    type="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setErrors({ ...errors, email: "" });
                    }}
                    error={errors.email}
                  />

                  <div className="flex flex-col w-full text-left">
                    <PhoneInput
                      label="Phone Number"
                      countryCode={formData.countryCode}
                      phone={formData.phone}
                      onChange={({ countryCode, phone }) => {
                        setFormData((prev) => ({ ...prev, countryCode, phone }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      error={errors.phone}
                    />
                    <div className="flex items-start gap-2.5 mt-2 w-full text-left">
                      <input
                        id="home-whatsapp"
                        name="isWhatsApp"
                        type="checkbox"
                        checked={formData.isWhatsApp}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isWhatsApp: e.target.checked }))}
                        className="w-4 h-4 text-primary border-border focus:ring-primary rounded mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="home-whatsapp" className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                        This is also my WhatsApp number for faster communications.
                      </label>
                    </div>
                  </div>

                  <Select
                    label="Est. Project Budget"
                    id="form-budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    options={[
                      { value: "Under $5k", label: "Under $5k" },
                      { value: "$5k - $15k", label: "$5k - $15k" },
                      { value: "$15k - $50k", label: "$15k - $50k" },
                      { value: "$50k+", label: "$50k+" },
                    ]}
                  />

                  <Textarea
                    label="Brief Project Concept"
                    id="form-message"
                    rows={3}
                    placeholder="Describe what you want to build (e.g. mobile app, web dashboard, SaaS architecture)..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      setErrors({ ...errors, message: "" });
                    }}
                    error={errors.message}
                  />

                  {submitError && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold leading-relaxed">
                      {submitError}
                    </div>
                  )}

                  <Button variant="primary" size="md" className="w-full mt-2 justify-center shadow-sm" type="submit" isLoading={formLoading} rightIcon={<Send className="w-4 h-4" />}>
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
          <motion.div {...fadeInUp} className="flex flex-col items-center gap-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {ctaSec?.heading || "Ready to Build Your App?"}
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-xl">
              {ctaSec?.subheading || "Get an instant cost assessment or contact our engineering team to draft custom software blueprints."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mt-4">
              <Link href={ctaSec?.buttonUrl || ctaSec?.primaryBtnUrl || "/app-cost-calculator"} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full justify-center shadow-sm">
                  {ctaSec?.buttonText || ctaSec?.primaryBtnText || "Calculate App Cost"}
                </Button>
              </Link>
              <Link href={ctaSec?.secondaryButtonUrl || "/contact"} className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full justify-center">
                  {ctaSec?.secondaryButtonText || "Contact Experts"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
export default HomeClient;
