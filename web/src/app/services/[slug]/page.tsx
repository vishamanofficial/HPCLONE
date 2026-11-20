import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/api";
import { ServiceDetailClient } from "./ServiceDetailClient";

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
      title: "Service Not Found | HangingPanda",
    };
  }

  const title = service.seoTitle || `${service.title} Services | HangingPanda`;
  const description = service.metaDescription || service.shortDesc;

  return {
    title,
    description,
    alternates: {
      canonical: `https://hangingpanda.com/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hangingpanda.com/services/${slug}`,
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
      name: "HangingPanda",
      url: "https://hangingpanda.com"
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
