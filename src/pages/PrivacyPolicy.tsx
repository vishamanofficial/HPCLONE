import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "June 27, 2026";

  return (
    <>
      <Helmet>
        <title>Privacy Policy | HangingPanda Software Labs</title>
        <meta
          name="description"
          content="Review the Privacy Policy of HangingPanda. Understand how we secure client inquiries, audit data, and comply with GDPR regulations."
        />
        <link rel="canonical" href="https://hangingpanda.com/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | HangingPanda Software Labs" />
        <meta property="og:description" content="Review the Privacy Policy of HangingPanda. Understand how we secure client inquiries, audit data, and comply with GDPR regulations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/privacy-policy" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | HangingPanda Software Labs" />
        <meta name="twitter:description" content="Review the Privacy Policy of HangingPanda. Understand how we secure client inquiries, audit data, and comply with GDPR regulations." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="py-16 max-w-4xl mx-auto px-6 text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight mb-2">
          Privacy Policy
        </h1>
        <span className="text-xs text-text-muted font-semibold block mb-8">
          Last Updated: {lastUpdated}
        </span>

        <div className="prose dark:prose-invert text-sm sm:text-base text-text-secondary leading-relaxed flex flex-col gap-6">
          <p>
            At HangingPanda, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by HangingPanda and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{" "}
            <a href="mailto:vishamanofficial.business@gmail.com" className="text-primary hover:underline">
              vishamanofficial.business@gmail.com
            </a>.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">1. Log Files</h2>
          <p>
            HangingPanda follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">2. Cookies and Web Beacons</h2>
          <p>
            Like any other website, HangingPanda uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information. For details, please review our{" "}
            <Link to="/cookies-policy" className="text-primary hover:underline font-semibold">
              Cookies Policy
            </Link>.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">3. Data Security and NDAs</h2>
          <p>
            We take absolute security precautions to protect your intellectual ideas. When you submit inquiries through our contact forms or use our App Cost Calculator, the details are transmitted over SSL encrypted tunnels. Furthermore, we sign Non-Disclosure Agreements (NDAs) with clients before initiating code sprints or technical audits.
          </p>

          <h2 className="text-xl font-bold text-text-primary mt-4">4. GDPR and CCPA Data Protection Rights</h2>
          <p>
            We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-6 flex flex-col gap-2">
            <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data.</li>
          </ul>
        </div>
      </section>
    </>
  );
};
export default PrivacyPolicy;
