/**
 * Centralized Site & Brand Configuration
 * Change your brand name, domain, emails, and company details here in ONE place
 * or override them via environment variables in .env (e.g. NEXT_PUBLIC_SITE_NAME, NEXT_PUBLIC_SITE_URL).
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hangingpanda.com";
// Normalize domain without protocol or trailing slash
const siteDomain = (process.env.NEXT_PUBLIC_SITE_DOMAIN || siteUrl.replace(/^https?:\/\//, "")).replace(/\/.*$/, "");

export const siteConfig = {
  // Brand identity
  name: process.env.NEXT_PUBLIC_SITE_NAME || "HangingPanda",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "HP",
  subName: process.env.NEXT_PUBLIC_SITE_SUBNAME || "Software Labs",
  legalName: process.env.NEXT_PUBLIC_SITE_LEGAL_NAME || "HangingPanda Pvt Ltd",
  
  // Domain and URLs
  domain: siteDomain,
  url: siteUrl.replace(/\/$/, ""),
  
  // Tagline and positioning
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "AI-Powered Custom Software & Mobile App Development",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms with enforceable delivery guarantees and 2.5 years free maintenance.",
  
  // Contact details & emails
  emails: {
    contact: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vishamanofficial.business@gmail.com",
    admin: process.env.ADMIN_DEFAULT_EMAIL || `admin@${siteDomain}`,
    careers: process.env.NEXT_PUBLIC_CAREERS_EMAIL || `careers@${siteDomain}`,
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || `support@${siteDomain}`,
  },
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91-8887024887",
  
  // Physical office address
  address: {
    street: "B-64, B Block, Sector 63",
    locality: "Noida",
    region: "Uttar Pradesh",
    postalCode: "201301",
    country: "IN",
    countryName: "India",
    full: "B-64, B Block, Sector 63, Noida, Uttar Pradesh, India, 201301",
  },
  
  // Official social media profiles
  socialLinks: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com",
  },
  
  // Brand assets
  assets: {
    favicon: "/favicon.svg",
    logo: "/favicon.svg",
    ogImage: "/favicon.svg",
  },
  
  // Copyright helper
  getCopyright: (year: number | string = new Date().getFullYear()) => {
    return `© ${year} ${process.env.NEXT_PUBLIC_SITE_LEGAL_NAME || "HangingPanda Pvt Ltd"}. All rights reserved.`;
  },
};

export type SiteConfig = typeof siteConfig;
