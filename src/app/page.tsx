import type { Metadata } from "next";
import { nextApi } from "@/lib/server-api";
import { HomeClient } from "@/components/home/HomeClient";
import { siteConfig } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await nextApi.getHomepage();
  const page = homeData?.page;

  const title = page?.seo?.metaTitle || `${siteConfig.name} | ${siteConfig.tagline}`;
  const description = page?.seo?.metaDescription || siteConfig.description;

  return {
    title,
    description,
    alternates: {
      canonical: page?.seo?.canonicalUrl || `${siteConfig.url}/`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/`,
      type: "website",
      images: [
        {
          url: page?.seo?.ogImage || siteConfig.assets.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} ${siteConfig.subName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [page?.seo?.ogImage || siteConfig.assets.ogImage],
    },
  };
}

export default async function HomePage() {
  const homeData = await nextApi.getHomepage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.assets.logo}`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country
    },
    sameAs: [
      siteConfig.socialLinks.facebook,
      siteConfig.socialLinks.twitter,
      siteConfig.socialLinks.linkedin,
      siteConfig.socialLinks.instagram,
      siteConfig.socialLinks.github
    ].filter(Boolean)
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
