import type { Metadata } from "next";
import { nextApi } from "@/lib/api";
import { HomeClient } from "@/components/home/HomeClient";

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await nextApi.getHomepage();
  const page = homeData?.page;

  const title = page?.seo?.metaTitle || "HangingPanda | AI-Powered Custom Software & Mobile App Development";
  const description = page?.seo?.metaDescription || "HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms with enforceable delivery guarantees and 2.5 years free maintenance.";

  return {
    title,
    description,
    alternates: {
      canonical: page?.seo?.canonicalUrl || "https://hangingpanda.com/",
    },
    openGraph: {
      title,
      description,
      url: "https://hangingpanda.com/",
      type: "website",
      images: [
        {
          url: page?.seo?.ogImage || "/favicon.svg",
          width: 1200,
          height: 630,
          alt: "HangingPanda Software Labs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [page?.seo?.ogImage || "/favicon.svg"],
    },
  };
}

export default async function HomePage() {
  const homeData = await nextApi.getHomepage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HangingPanda",
    url: "https://hangingpanda.com",
    logo: "https://hangingpanda.com/favicon.svg",
    description: "AI-Powered Custom Software, Web Platforms, and Mobile App Development Agency.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "B-64, B Block, Sector 63",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN"
    },
    sameAs: [
      "https://facebook.com",
      "https://twitter.com",
      "https://linkedin.com",
      "https://instagram.com"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        pageData={homeData?.page}
        sections={homeData?.sections || []}
        dynamicServices={homeData?.dynamicData?.services}
        dynamicPortfolio={homeData?.dynamicData?.portfolio}
      />
    </>
  );
}
