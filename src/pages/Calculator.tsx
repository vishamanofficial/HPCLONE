import React from "react";
import { Helmet } from "react-helmet-async";
import CalculatorWizard from "../components/calculator/CalculatorWizard";

export const Calculator: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>App Cost Calculator | Get Instant Ballpark Estimate | HangingPanda</title>
        <meta
          name="description"
          content="Calculate your mobile app or custom software development cost. Our instant wizard evaluates platform selections, UI options, and admin features."
        />
        <link rel="canonical" href="https://hangingpanda.com/app-cost-calculator" />
        <meta property="og:title" content="App Cost Calculator | Get Instant Ballpark Estimate | HangingPanda" />
        <meta property="og:description" content="Calculate your mobile app or custom software development cost. Our instant wizard evaluates platform selections, UI options, and admin features." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/app-cost-calculator" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="App Cost Calculator | Get Instant Ballpark Estimate | HangingPanda" />
        <meta name="twitter:description" content="Calculate your mobile app or custom software development cost. Our instant wizard evaluates platform selections, UI options, and admin features." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

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
};
export default Calculator;
