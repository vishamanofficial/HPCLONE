import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ShieldAlert,
  History,
  Eye,
  Award,
  Users2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export const About: React.FC = () => {
  const stats = [
    { label: "Years Experience", value: "7+", icon: <Calendar className="w-5 h-5" /> },
    { label: "Tech Professionals", value: "55+", icon: <Users2 className="w-5 h-5" /> },
    { label: "Client Retention", value: "98%", icon: <Award className="w-5 h-5" /> },
    { label: "Delivered Sprints", value: "340+", icon: <Layers className="w-5 h-5" /> }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | HangingPanda Software Engineering Guarantees</title>
        <meta
          name="description"
          content="Learn about HangingPanda, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines."
        />
        <link rel="canonical" href="https://hangingpanda.com/about" />
        <meta property="og:title" content="About Us | HangingPanda Software Engineering Guarantees" />
        <meta property="og:description" content="Learn about HangingPanda, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/about" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | HangingPanda Software Engineering Guarantees" />
        <meta name="twitter:description" content="Learn about HangingPanda, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Our Insights & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            We Build Software with Unmatched <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Engineering Guarantees</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
            HangingPanda was founded to bridge the gap between abstract startup goals and concrete, high-performance software builds. We protect our clients using contractual guarantees.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-2"
          >
            <span className="p-2.5 bg-primary/10 rounded-xl text-primary mb-1">
              {stat.icon}
            </span>
            <span className="text-3xl font-black text-text-primary tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Contractual Assurances
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Protecting Your Technical Capital
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
              We align our operational success directly with yours. Here are the core guarantees built into every contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect="scale" className="flex flex-col gap-5 p-8 bg-card">
              <span className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit inline-block">
                <ShieldAlert className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">5% SLA Weekly Penalties</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                If we miss a scheduled milestone deadline outlined in our sprint plan, we apply a 5% weekly credit deduction directly to that milestone milestone cost. We put our capital behind our commitments.
              </p>
            </Card>

            <Card hoverEffect="scale" className="flex flex-col gap-5 p-8 bg-card">
              <span className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl w-fit inline-block">
                <History className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">2.5 Years Free Maintenance</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Our services include a standard 30-month warranty period. If any code regressions, software bugs, or database dependency warnings emerge within 2.5 years of deployment, our patch team resolves them at zero cost.
              </p>
            </Card>

            <Card hoverEffect="scale" className="flex flex-col gap-5 p-8 bg-card">
              <span className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit inline-block">
                <Eye className="w-8 h-8" />
              </span>
              <h3 className="font-bold text-xl text-text-primary">Real-Time Commit Tracking</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                We grant client teams full access to our project git repositories and task boards. You can monitor daily code updates, inspect branch logs, and audit build sprints in real-time, removing execution opacity.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col items-start text-left gap-4">
          <span className="block text-xs font-black text-primary tracking-widest uppercase">
            Our Core Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
            Developing Software that Outperforms Competitors
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mt-2">
            HangingPanda's team comprises software developers, cloud architects, and UI analysts with multi-industry expertise. We focus heavily on reducing technical debt by writing modular TypeScript architectures, utilizing unit testing workflows, and selecting hosting configurations that minimize monthly cloud costs.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Whether you need a mobile application built in React Native or React elements integrated with an IoT telemetry broker, we formulate paths to deliver fast runtime execution and accessible designs.
          </p>
        </div>
        <div className="lg:col-span-6 bg-surface border border-border p-8 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl" />
          <h3 className="font-bold text-lg text-text-primary border-b border-border pb-3">
            Why start with HangingPanda?
          </h3>
          <div className="flex flex-col gap-4">
            {[
              "Clear, client-owned repository credentials",
              "Agile sprints with bi-weekly project demos",
              "Lightweight Tailwind setups for fast page loading",
              "Modular backend structures easily ported to cloud providers"
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span className="text-xs sm:text-sm font-semibold text-text-primary">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface text-text-primary border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_40%)]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Let's Shape Your Technical Architecture
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-lg leading-relaxed">
            Get in touch for a technical consultation or use our wizard estimator to evaluate ballpark requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
            <Link to="/app-cost-calculator" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="w-full justify-center">
                Calculate Cost Estimations
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Talk to our Engineers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default About;
