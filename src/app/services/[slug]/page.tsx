import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/server-api";
import { ServiceDetailClient } from "./ServiceDetailClient";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await nextApi.getServices();
  return services.map((s: any) => ({
    slug: s.slug || s.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await nextApi.getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Service Not Found | ${siteConfig.name}`,
    };
  }

  const title = service.seoTitle || `${service.title} Services | ${siteConfig.name}`;
  const description = service.metaDescription || service.shortDesc;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/services/${slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await nextApi.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    description: service.shortDesc,
    areaServed: "Worldwide"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceDetailClient service={service} />
    </>
  );
}
