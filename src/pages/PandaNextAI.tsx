import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BrainCircuit,
  MessageSquare,
  Network,
  Bot,
  Database,
  Terminal,
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const PandaNextAI: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>PandaNext AI | Custom Enterprise AI & Autonomous Agents</title>
        <meta
          name="description"
          content="Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms."
        />
        <link rel="canonical" href="https://hangingpanda.com/pandanextai" />
        <meta property="og:title" content="PandaNext AI | Custom Enterprise AI & Autonomous Agents" />
        <meta property="og:description" content="Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/pandanextai" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PandaNext AI | Custom Enterprise AI & Autonomous Agents" />
        <meta name="twitter:description" content="Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg text-text-primary py-24 sm:py-32 relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.08),transparent_45%)]" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-bold text-xs rounded-full uppercase tracking-wider mb-6">
              <BrainCircuit className="w-4.5 h-4.5 text-primary animate-spin" />
              PandaNext Intelligent Labs
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Deploy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Autonomous AI Agents</span> Inside Your Workflow.
            </h1>
            <p className="text-sm sm:text-lg text-text-secondary mt-6 max-w-xl leading-relaxed">
              We design and embed customized machine learning models and task-oriented agents that take actions directly in your database systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full justify-center">
                  Deploy AI Agents
                </Button>
              </Link>
              <Link to="/app-cost-calculator" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full justify-center">
                  Estimate AI Build
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 border border-border bg-card/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col gap-6 relative shadow-xl">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="w-3.5 h-3.5 rounded-full bg-primary" />
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                Agent execution dashboard
              </span>
            </div>
            <div className="flex flex-col gap-3 font-mono text-xs text-primary">
              <div className="flex gap-2">
                <span className="text-text-muted">[08:42:01]</span>
                <span>Agent-1: Scanning pipeline logs...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-text-muted">[08:42:03]</span>
                <span>Agent-1: Detected memory leak in batch-3!</span>
              </div>
              <div className="flex gap-2">
                <span className="text-text-muted">[08:42:04]</span>
                <span>Agent-1: Initializing custom hot-patch...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-text-muted">[08:42:07]</span>
                <span>Agent-1: Commit pushed, tests compiling...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-text-muted">[08:42:10]</span>
                <span>Agent-1: Build passed. System back to 100% SLA.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface text-text-primary border-y border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Our Capability Matrices
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Decoupled AI Architectures built for Startups
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            <Card hoverEffect="glow" className="bg-card border-border p-8 flex flex-col gap-5">
              <span className="p-3 bg-primary/10 text-primary rounded-2xl w-fit inline-block">
                <Bot className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">Task-Oriented Workflow Agents</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We design AI agents that can trigger database transactions, inspect telemetry outputs, patch servers, and interface with email grids without human supervision.
              </p>
            </Card>

            <Card hoverEffect="glow" className="bg-card border-border p-8 flex flex-col gap-5">
              <span className="p-3 bg-primary/10 text-primary rounded-2xl w-fit inline-block">
                <MessageSquare className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">Contextual Chat Assistants</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Connect LLMs directly to your internal documents. We establish Vector Indexes (Pinecone, pgvector) to enable fast, secure lookup of customer details and support guides.
              </p>
            </Card>

            <Card hoverEffect="glow" className="bg-card border-border p-8 flex flex-col gap-5">
              <span className="p-3 bg-primary/10 text-primary rounded-2xl w-fit inline-block">
                <Network className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">Custom Predictive Pipelines</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Make data-driven projections. We write machine learning models that analyze historical records to project demand limits, detect anomalies, and track retail habits.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 text-text-primary grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 text-left flex flex-col items-start gap-4">
          <span className="block text-xs font-black text-primary tracking-widest uppercase">
            Modern Stack Integrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
            Security-First LLM Architecture
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            AI software requires secure pipelines. We implement API guardrails that mask PII data before forwarding it to LLM endpoints.
          </p>
          <div className="flex flex-col gap-3 mt-4 w-full">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">LangChain & LlamaIndex orchestrations</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Pinecone & pgvector index clusters</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">FastAPI backend logic, Docker containers</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 bg-surface border border-border p-8 rounded-3xl text-left flex flex-col gap-5">
          <h3 className="font-bold text-lg text-text-primary border-b border-border pb-3">
            PandaNext AI Delivery Method
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every custom AI project begins with a 2-week feasibility audit. Our engineers set up a proof-of-concept using mock data so you can verify token costs and accuracy metrics before committing to full scale builds.
          </p>
          <Link to="/contact">
            <Button variant="gradient" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Request Feasibility Audit
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default PandaNextAI;
