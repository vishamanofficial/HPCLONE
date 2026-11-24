import type { Metadata } from "next";
import { CareerClient } from "./CareerClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Careers | Join ${siteConfig.name} Tech Labs`,
  description:
    `Explore job openings at ${siteConfig.name}. We hire certified React developers, mobile engineers, and database architects. Flexible work culture.`,
  alternates: {
    canonical: `${siteConfig.url}/career`,
  },
  openGraph: {
    title: `Careers | Join ${siteConfig.name} Tech Labs`,
    description:
      `Explore job openings at ${siteConfig.name}. We hire certified React developers, mobile engineers, and database architects. Flexible work culture.`,
    url: `${siteConfig.url}/career`,
    type: "website",
  },
};

export default function CareerPage() {
  return <CareerClient />;
}
