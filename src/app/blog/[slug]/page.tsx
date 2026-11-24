import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/server-api";
import { siteConfig } from "@/config/site";
import { blogsData } from "@/data/blogsData";
import { BlogDetailClient } from "./BlogDetailClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogsRes = await nextApi.getBlogs();
  const list = blogsRes?.blogs || blogsData;
  return list.map((b: any) => ({
    slug: b.slug || b.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await nextApi.getBlogBySlug(slug);
  const blog = res?.blog;

  if (!blog) {
    return {
      title: `Article Not Found | ${siteConfig.name} Tech Hub`,
    };
  }

  return {
    title: `${blog.title} | ${siteConfig.name} Tech Hub`,
    description: blog.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `${siteConfig.url}/blog/${slug}`,
      type: "article",
      images: [
        {
          url: blog.featuredImage || siteConfig.assets.ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await nextApi.getBlogBySlug(slug);

  if (!res || !res.blog) {
    notFound();
  }

  const blog = res.blog;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    author: {
      "@type": "Person",
      name: blog.author?.name || `${siteConfig.name} Engineer`,
    },
    datePublished: blog.publishedAt || "2026-06-15",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.assets.logo}`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailClient blog={blog} related={res.related} />
    </>
  );
}
