import type { Metadata } from "next";
import { nextApi } from "@/lib/server-api";
import { ServicesClient } from "./ServicesClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Software Engineering & App Development Services | ${siteConfig.name}`,
  description:
    `Explore ${siteConfig.name}'s comprehensive engineering services: Custom Mobile App Development, Enterprise Cloud Software, Web Platforms, and AI Systems with guaranteed SLAs and 2.5 years free maintenance.`,
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: `Software & App Development Services | ${siteConfig.name}`,
    description:
      `Full-lifecycle software engineering, mobile apps, web applications, and AI integrations built for performance and scale by ${siteConfig.name}.`,
    url: `${siteConfig.url}/services`,
    type: "website",
  },
};

export default async function ServicesPage() {
  const services = await nextApi.getServices();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: s.title,
      description: s.shortDesc,
      url: `${siteConfig.url}/services/${s.slug || s.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesClient services={services} />
    </>
  );
}
