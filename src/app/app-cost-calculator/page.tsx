import type { Metadata } from "next";
import CalculatorWizard from "@/components/calculator/CalculatorWizard";

export const metadata: Metadata = {
  title: "App Cost Calculator | Get Instant Ballpark Estimate | HangingPanda",
  description:
    "Calculate your mobile app or custom software development cost. Our instant wizard evaluates platform selections, UI options, and admin features.",
  alternates: {
    canonical: "https://hangingpanda.com/app-cost-calculator",
  },
  openGraph: {
    title: "App Cost Calculator | Get Instant Ballpark Estimate | HangingPanda",
    description:
      "Calculate your mobile app or custom software development cost. Our instant wizard evaluates platform selections, UI options, and admin features.",
    url: "https://hangingpanda.com/app-cost-calculator",
    type: "website",
  },
};

export default function CalculatorPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-surface to-bg py-16 sm:py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Project Cost Estimator
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Development Cost</span> Instantly.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-xl mx-auto">
            Choose your platform, app category, UI theme, and admin features. Get a ballpark pricing breakdown in less than 2 minutes.
          </p>
        </div>
      </section>

      <section className="py-12 bg-bg">
        <CalculatorWizard />
      </section>
    </>
  );
}
