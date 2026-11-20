import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/api";
import { DynamicPageClient } from "./DynamicPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await nextApi.getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | HangingPanda",
    };
  }

  const title = page.seo?.metaTitle || `${page.title} | HangingPanda`;
  const description = page.seo?.metaDescription || `${page.title} - Custom software solutions by HangingPanda.`;

  return {
    title,
    description,
    alternates: {
      canonical: page.seo?.canonicalUrl || `https://hangingpanda.com/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hangingpanda.com/${slug}`,
      type: "website",
      images: [
        {
          url: page.seo?.ogImage || "/favicon.svg",
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
