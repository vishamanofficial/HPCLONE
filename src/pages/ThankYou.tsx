import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Calendar, ShieldCheck, Cpu, ArrowLeft, Heart } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import type { CalculationResult } from "../data/calculatorQuestions";

interface LocationState {
  clientName?: string;
  results?: CalculationResult;
  selections?: Record<string, string | string[]>;
  contactSuccess?: boolean;
}

export const ThankYou: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { clientName = "there", results, selections } = state;

  return (
    <>
      <Helmet>
        <title>Thank You | HangingPanda Software Estimator</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="py-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
          Inquiry Received Successfully!
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-xl">
          Thank you, <span className="text-primary font-bold">{clientName}</span>. We've logged your request in our system and will reach out within 12 business hours.
        </p>

        {results && selections && (
          <div className="w-full mt-8 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl text-left flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-36 h-36 bg-primary/5 rounded-full filter blur-2xl" />
            
            <div className="border-b border-border pb-6">
              <h2 className="text-lg font-black text-text-primary uppercase tracking-wider mb-2">
                Estimated Project Breakdown
              </h2>
              <p className="text-xs text-text-secondary">
                Calculations based on selected platforms, theme animations, and admin panel parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card variant="surface" hoverEffect="none" className="flex flex-col gap-2 p-6 border-l-4 border-l-primary">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Ballpark Estimate
                </span>
                <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                  ${results.estimatedCost.toLocaleString()} - ${(Math.round(results.estimatedCost * 1.25)).toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-none">
                  Subject to detailed backlog scope revisions.
                </span>
              </Card>

              <Card variant="surface" hoverEffect="none" className="flex flex-col gap-2 p-6 border-l-4 border-l-accent-orange">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent-orange" /> Projected Duration
                </span>
                <span className="text-3xl sm:text-4xl font-black text-accent-orange tracking-tight">
                  {results.timelineWeeks.min} - {results.timelineWeeks.max} Weeks
                </span>
                <span className="text-[10px] text-text-muted mt-1 leading-none">
                  Includes UX design, engineering, and QA runs.
                </span>
              </Card>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-primary" /> Suggested Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {results.suggestedTech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 bg-surface border border-border text-xs font-bold text-text-primary rounded-xl"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3.5">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-primary fill-current animate-pulse" /> What happens next?
              </h3>
              <ol className="list-decimal pl-5 text-xs text-text-secondary flex flex-col gap-2 leading-relaxed">
                <li>We will send a PDF summary of these figures to your email address.</li>
                <li>A project analyst will verify your selections and compile structural queries.</li>
                <li>We will coordinate a 15-minute diagnostic call to sign an NDA and schedule your sprint releases.</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center gap-4">
          <Link to="/">
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="gradient">
              Consult Engineers
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};
export default ThankYou;
