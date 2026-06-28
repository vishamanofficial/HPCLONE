import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Calculator, Palette, Code, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

interface StepData {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  badgeText?: string;
  badgeClass?: string;
  accentClass: string;
  gradientClass: string;
  hoverBorderColor: string;
  hasCTA?: boolean;
}

const MilestoneCircle: React.FC<{ index: number }> = ({ index }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative z-10 w-[72px] h-[72px] flex items-center justify-center rounded-full bg-card/65 backdrop-blur-xl border border-border/70 shadow-[0_8px_16px_rgba(0,0,0,0.04)] group cursor-pointer"
    >
      <span className="text-sm font-black text-text-secondary transition-colors duration-300 group-hover:text-primary relative z-10">
        0{index + 1}
      </span>
    </motion.div>
  );
};

const CardWrapper: React.FC<{ card: StepData }> = ({
  card
}) => {
  const Icon = card.icon;
  const shouldReduceMotion = useReducedMotion();

  const fadeInUpVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <motion.div
      {...fadeInUpVariants}
      whileHover="hover"
      variants={{
        hover: {
          y: shouldReduceMotion ? 0 : -5,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12), 0 0 20px rgba(var(--hp-color-primary), 0.02)",
          borderColor: card.hoverBorderColor
        }
      }}
      className="bg-card/45 backdrop-blur-xl border border-border/80 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 w-full shadow-[0_6px_24px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.03)] cursor-pointer"
    >
      <div className="flex items-center gap-3.5">
        <div className={`p-2.5 rounded-xl bg-surface border border-border/80 flex items-center justify-center shadow-inner ${card.accentClass}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
        <div className="flex flex-col text-left">
          <h4 className="font-extrabold text-sm sm:text-base text-text-primary tracking-tight">
            {card.title}
          </h4>
          {card.badgeText && (
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border self-start mt-1 ${card.badgeClass}`}>
              {card.badgeText}
            </span>
          )}
        </div>
      </div>

      <div className="relative h-[2px] w-12 overflow-hidden rounded-full bg-border/40">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${card.gradientClass}`}
        />
      </div>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed text-left">
        {card.description}
      </p>

      {card.hasCTA && (
        <div className="mt-1 text-left z-10">
          <Link to="/app-cost-calculator">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Estimate Cost
            </Button>
          </Link>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent overflow-hidden">
        <motion.div
          variants={{ hover: { width: "100%" } }}
          initial={{ width: "0%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${card.gradientClass}`}
        />
      </div>
    </motion.div>
  );
};

export const EngineeringJourney: React.FC = () => {
  const steps: StepData[] = useMemo(
    () => [
      {
        title: "Blueprints & Scope Scoping",
        description:
          "We sit down to detail your app's core architecture, data schema, technical roadmap, and estimate cost using our proprietary App Cost Calculator.",
        icon: Calculator,
        accentClass: "text-primary",
        gradientClass: "from-primary to-accent-orange",
        hoverBorderColor: "rgba(239, 68, 68, 0.35)",
        hasCTA: true
      },
      {
        title: "Iterative UI/UX Prototyping",
        description:
          "Our designers build high-fidelity interfaces, interactive prototypes and scalable design systems before development begins.",
        icon: Palette,
        badgeText: "Figma Centric",
        badgeClass: "bg-accent-orange/10 border-accent-orange/20 text-accent-orange",
        accentClass: "text-accent-orange",
        gradientClass: "from-accent-orange to-accent-pink",
        hoverBorderColor: "rgba(220, 38, 38, 0.35)"
      },
      {
        title: "Milestone Development & QA",
        description:
          "Senior engineers build production-grade software with TypeScript, React, Swift and Python backed by automated testing and sprint-based QA.",
        icon: Code,
        badgeText: "SLA Penalties",
        badgeClass: "bg-accent-pink/10 border-accent-pink/20 text-accent-pink",
        accentClass: "text-accent-pink",
        gradientClass: "from-accent-pink to-[#22c55e]",
        hoverBorderColor: "rgba(239, 68, 68, 0.35)"
      },
      {
        title: "Deployment, IP & Maintenance",
        description:
          "After approval, we transfer the complete source code and ownership while providing long-term maintenance, monitoring and continuous improvements.",
        icon: ShieldCheck,
        badgeText: "100% IP Transfer",
        badgeClass: "bg-green-500/10 border-green-500/20 text-green-500",
        accentClass: "text-green-500",
        gradientClass: "from-[#22c55e] to-primary",
        hoverBorderColor: "rgba(34, 197, 94, 0.35)"
      }
    ],
    []
  );

  const shouldReduceMotion = useReducedMotion();
  const pathD = "M 125,40 C 250,40 250,160 375,160 C 500,160 500,280 625,280 C 750,280 750,400 875,400";

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-bg">
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] rounded-full bg-accent-orange/3 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-accent-pink/4 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_75%,rgba(var(--hp-color-bg),0.75))]" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-primary/10 blur-[0.5px] animate-bounce" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-accent-orange/15 blur-[0.5px] animate-bounce" style={{ animationDuration: "9s" }} />
        <div className="absolute bottom-1/3 left-16 w-2 h-2 rounded-full bg-accent-pink/10 blur-[0.5px] animate-bounce" style={{ animationDuration: "11s" }} />
        <div className="absolute bottom-12 right-1/4 w-2 h-2 rounded-full bg-[#22c55e]/10 blur-[0.5px] animate-bounce" style={{ animationDuration: "8s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-12 lg:mb-0 flex flex-col items-center"
        >
          <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
            HOW WE WORK
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Our 4-Step Engineering Lifecycle
          </h2>
          <div className="h-[3px] w-24 bg-gradient-to-r from-primary via-accent-orange to-accent-pink rounded-full mt-4 mb-2 animate-pulse" />
          <p className="text-text-secondary text-sm sm:text-base mt-4 max-w-xl mx-auto">
            From design systems to production-grade deployments, we ensure structured delivery at every stage.
          </p>
        </motion.div>

        <div className="relative mt-8 lg:mt-0 w-full">
          <div className="hidden lg:block relative w-full h-[720px] mb-12">
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <svg className="w-full h-full" viewBox="0 0 1000 720" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="journey-path-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--hp-color-primary))" />
                    <stop offset="33%" stopColor="rgb(var(--hp-color-accent-orange))" />
                    <stop offset="66%" stopColor="rgb(var(--hp-color-accent-pink))" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>

                <path d={pathD} fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="5" strokeLinecap="round" />

                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="url(#journey-path-gradient)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                <g>
                  <animateMotion dur="6s" repeatCount="indefinite" path={pathD} />
                  <circle r="6" fill="rgb(var(--hp-color-primary))" opacity="0.8" className="blur-[2px]" />
                  <circle r="3" fill="#ffffff" />
                </g>
              </svg>
            </div>

            <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <div className="grid grid-cols-4 gap-12 w-full h-full relative z-10">
                {steps.map((step, idx) => {
                  const topPos = ["pt-[4px]", "pt-[124px]", "pt-[244px]", "pt-[364px]"];
                  return (
                    <div key={idx} className={`${topPos[idx]} flex flex-col items-center w-full`}>
                      <MilestoneCircle index={idx} />
                      <div className="mt-14 w-full pointer-events-auto">
                        <CardWrapper card={step} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:hidden flex flex-col relative pl-10 pr-2 gap-6 max-w-xl mx-auto text-left mb-8">
            <div className="absolute left-[18px] top-4 bottom-4 w-[2px] pointer-events-none">
              <div className="w-full h-full bg-gradient-to-b from-primary via-accent-orange to-[#22c55e] opacity-35 rounded-full" />
            </div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative w-full">
                <div className="absolute left-0 top-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-card/75 backdrop-blur-md border border-border/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  <span className="text-[11px] font-black text-text-secondary">0{idx + 1}</span>
                </div>
                <div className="w-full pl-14">
                  <CardWrapper card={step} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringJourney;

