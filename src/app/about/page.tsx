import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name} Software Engineering Guarantees`,
  description:
    `Learn about ${siteConfig.name}, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines.`,
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About Us | ${siteConfig.name} Software Engineering Guarantees`,
    description:
      `Learn about ${siteConfig.name}, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines.`,
    url: `${siteConfig.url}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
