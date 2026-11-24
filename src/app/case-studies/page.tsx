import type { Metadata } from "next";
import { nextApi } from "@/lib/server-api";
import { CaseStudiesClient } from "./CaseStudiesClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Portfolio & Case Studies | ${siteConfig.name} Success Metrics`,
  description:
    `Explore our case studies. ${siteConfig.name} builds custom app developments and software databases that increase conversion rates and support user scaling.`,
  alternates: {
    canonical: `${siteConfig.url}/case-studies`,
  },
  openGraph: {
    title: `Portfolio & Case Studies | ${siteConfig.name} Success Metrics`,
    description:
      `Explore our case studies. ${siteConfig.name} builds custom app developments and software databases that increase conversion rates and support user scaling.`,
    url: `${siteConfig.url}/case-studies`,
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  const portfolio = await nextApi.getPortfolio();
  return <CaseStudiesClient portfolio={portfolio} />;
}
