import type { Metadata } from "next";
import { nextApi } from "@/lib/api";
import { CaseStudiesClient } from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies | HangingPanda Success Metrics",
  description:
    "Explore our case studies. HangingPanda builds custom app developments and software databases that increase conversion rates and support user scaling.",
  alternates: {
    canonical: "https://hangingpanda.com/case-studies",
  },
  openGraph: {
    title: "Portfolio & Case Studies | HangingPanda Success Metrics",
    description:
      "Explore our case studies. HangingPanda builds custom app developments and software databases that increase conversion rates and support user scaling.",
    url: "https://hangingpanda.com/case-studies",
    type: "website",
  },
};

export default async function CaseStudiesPage() {
  const portfolio = await nextApi.getPortfolio();
  return <CaseStudiesClient portfolio={portfolio} />;
}
