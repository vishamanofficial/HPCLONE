import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/server-api";
import { DynamicPageClient } from "./DynamicPageClient";
import { siteConfig } from "@/config/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await nextApi.getPageBySlug(slug);

  if (!page) {
    return {
      title: `Page Not Found | ${siteConfig.name}`,
    };
  }

  const title = page.seo?.metaTitle || `${page.title} | ${siteConfig.name}`;
  const description = page.seo?.metaDescription || `${page.title} - Custom software solutions by ${siteConfig.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: page.seo?.canonicalUrl || `${siteConfig.url}/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${slug}`,
      type: "website",
      images: [
        {
          url: page.seo?.ogImage || siteConfig.assets.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [page.seo?.ogImage || siteConfig.assets.ogImage],
    },
  };
}

export default async function DynamicPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await nextApi.getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <DynamicPageClient page={page} />;
}
