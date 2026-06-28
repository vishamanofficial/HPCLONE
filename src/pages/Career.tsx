import React from "react";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users2,
  Award,
  Briefcase,
  Compass,
  HeartHandshake,
  Monitor,
  BookOpen,
  Heart,
  Globe
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const Career: React.FC = () => {
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

  const recruitmentSteps = [
    { title: "Resume & Commit Review", desc: "Our tech directors audit your past repository code commits, project complexity, and tech stacks." },
    { title: "Live Tech Problem Solving", desc: "Solve visual architecture and API scaling problems in real-time with team leaders." },
    { title: "System Engineering Review", desc: "Detailed discussion about reducing code debt, Postgres indexes, and microservice decoupling rules." },
    { title: "Onboarding & Alignment", desc: "Understand team timelines, SLA guarantees, and final sprint schedule coordination." }
  ];

  const teamPerks = [
    { title: "Remote-First Environment", desc: "Choose to work remote or join our Noida Sector 63 team center.", icon: Globe },
    { title: "Learning Allowance", desc: "Monthly budget credits for learning LangChain, cloud infrastructure, or advanced dev certifications.", icon: BookOpen },
    { title: "Hardware Reimbursement", desc: "Receive allowances for modern laptops, smart screens, and home office set-ups.", icon: Monitor },
    { title: "Health Coverage", desc: "Comprehensive health insurance covering key diagnostic audits and recovery support.", icon: Heart }
  ];

  const jobs = [
    {
      title: "Senior Full-Stack React / Node.js Developer",
      type: "Full-time (Remote / Noida Office)",
      experience: "5+ Years",
      description: "Looking for an engineer experienced in React 19, TypeScript, Express API optimization, and database query indexing. Will lead product architecture boards."
    },
    {
      title: "Cross-Platform Mobile App Engineer (Flutter & React Native)",
      type: "Full-time (Noida Office)",
      experience: "3+ Years",
      description: "Join our mobile app squad. Responsibilities include setting up device telemetry channels, managing stores builds, and tuning UI framerates."
    },
    {
      title: "AI Integrations & Python Software Engineer",
      type: "Full-time (Remote)",
      experience: "4+ Years",
      description: "Focus on LLM workflows, context vector databases (Pinecone, pgvector), anomaly trackers, and model API integrations."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Careers | Join HangingPanda Tech Labs</title>
        <meta
          name="description"
          content="Explore job openings at HangingPanda. We hire certified React developers, mobile engineers, and database architects. Flexible work culture."
        />
        <link rel="canonical" href="https://hangingpanda.com/career" />
        <meta property="og:title" content="Careers | Join HangingPanda Tech Labs" />
        <meta property="og:description" content="Explore job openings at HangingPanda. We hire certified React developers, mobile engineers, and database architects. Flexible work culture." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/career" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Careers | Join HangingPanda Tech Labs" />
        <meta name="twitter:description" content="Explore job openings at HangingPanda. We hire certified React developers, mobile engineers, and database architects. Flexible work culture." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Work With Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Build Software that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Empowers Users</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
            HangingPanda is scaling. We seek engineers who value clean architectures, type safety, and direct client coordination grids.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            Company Culture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Why Code with HangingPanda?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect="shadow" className="flex flex-col gap-4 text-left p-6 sm:p-8">
            <span className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit">
              <Users2 className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-lg text-text-primary">Collaborative Squads</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We group developers in tight product squads. You coordinate directly with project designers, avoiding bloated middle management filters.
            </p>
          </Card>

          <Card hoverEffect="shadow" className="flex flex-col gap-4 text-left p-6 sm:p-8">
            <span className="p-2.5 bg-accent-orange/10 rounded-xl text-accent-orange w-fit">
              <Compass className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-lg text-text-primary">Skill Augmentation</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every month we host technical learning sprints. Learn LangChain, Rust web servers, or Tailwind v4 optimization rules with team credits.
            </p>
          </Card>

          <Card hoverEffect="shadow" className="flex flex-col gap-4 text-left p-6 sm:p-8">
            <span className="p-2.5 bg-green-500/10 rounded-xl text-green-500 w-fit">
              <HeartHandshake className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-lg text-text-primary">Healthy Work Balance</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We offer hybrid/remote options, flexible logging hours, and set clear milestone boundaries to prevent developer burnout.
            </p>
          </Card>
        </div>
      </section>

      {/* The 4-Step Hiring Funnel */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div {...fadeInUp}>
              <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
                HIRING LOOP
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                Our Recruitment Process
              </h2>
              <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
                We value your time. We aim to complete our full technical review loop within 7 business days.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {recruitmentSteps.map((step, idx) => (
              <motion.div key={idx} {...fadeInUp}>
                <Card hoverEffect="glow" className="flex flex-col gap-4 p-6 bg-card border border-border/80 h-full relative">
                  <span className="absolute top-4 right-4 text-xs font-black text-primary/20">
                    0{idx + 1}
                  </span>
                  <h3 className="font-extrabold text-sm text-text-primary mt-2">{step.title}</h3>
                  <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                    {step.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              Active Vacancies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              We are actively hiring for these positions
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex flex-col gap-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">{job.title}</h3>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold text-text-muted">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.type}</span>
                    <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" />{job.experience}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
                    {job.description}
                  </p>
                </div>
                <a href="mailto:vishamanofficial.business@gmail.com?subject=Job Application" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full justify-center">
                    Apply Now &rarr;
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Perks & Benefits Grid */}
      <section className="py-20 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div {...fadeInUp}>
              <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
                COMPENSATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                Benefits & Workspace Perks
              </h2>
              <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
                We believe in providing the resources you need to focus on engineering high-fidelity software products.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {teamPerks.map((perk, idx) => {
              const PerkIcon = perk.icon;
              return (
                <motion.div key={idx} {...fadeInUp}>
                  <Card hoverEffect="shadow" className="flex flex-col gap-4 p-6 bg-card border border-border/80 h-full">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <PerkIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm text-text-primary">{perk.title}</h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      {perk.desc}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-black text-text-primary tracking-tight mb-2">
          Don't see a matching position?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto mb-6">
          Submit your CV anyway. We regularly review speculative engineering profiles for future contract sprints.
        </p>
        <a href="mailto:vishamanofficial.business@gmail.com?subject=Speculative Technical CV Application">
          <Button variant="gradient">
            Email Your Resume
          </Button>
        </a>
      </section>
    </>
  );
};
export default Career;
