import React from "react";
import { Helmet } from "react-helmet-async";

export const CookiesPolicy: React.FC = () => {
  const lastUpdated = "June 27, 2026";

  return (
    <>
      <Helmet>
        <title>Cookies Policy | HangingPanda Software Labs</title>
        <meta
          name="description"
          content="Review the Cookies Policy of HangingPanda. Learn about essential browser cookies, analytics settings, and user tracking."
        />
        <link rel="canonical" href="https://hangingpanda.com/cookies-policy" />
        <meta property="og:title" content="Cookies Policy | HangingPanda Software Labs" />
        <meta property="og:description" content="Review the Cookies Policy of HangingPanda. Learn about essential browser cookies, analytics settings, and user tracking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/cookies-policy" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cookies Policy | HangingPanda Software Labs" />
        <meta name="twitter:description" content="Review the Cookies Policy of HangingPanda. Learn about essential browser cookies, analytics settings, and user tracking." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="py-16 max-w-4xl mx-auto px-6 text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-2">
          Cookies Policy
        </h1>
        <span className="text-xs text-text-muted font-semibold block mb-8">
          Last Updated: {lastUpdated}
        </span>

        <div className="prose dark:prose-invert text-sm sm:text-base text-text-secondary leading-relaxed flex flex-col gap-6">
          <p>
            This is the Cookies Policy for HangingPanda, accessible from{" "}
            <a href="https://hangingpanda.com" className="text-primary hover:underline font-semibold">
              https://hangingpanda.com
            </a>.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">1. What Are Cookies</h2>
          <p>
            As is common practice with almost all professional websites, this site uses cookies, which are tiny files downloaded to your computer to improve your browser experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored; however, this may downgrade or break certain elements of the site's functionality.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">2. How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not, in case they are used to provide a service that you use.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">3. Disabling Cookies</h2>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">4. Cookies We Set</h2>
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li>
              <strong>Site preferences cookies</strong> – In order to provide you with a premium experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. To remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page. For example, your selected Light/Dark theme and custom primary brand colors are saved locally.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};
export default CookiesPolicy;
