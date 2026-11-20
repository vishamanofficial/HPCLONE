import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { nextApi } from "@/lib/server-api";
import { blogsData } from "@/data/blogsData";
import { BlogDetailClient } from "./BlogDetailClient";

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
      title: "Article Not Found | HangingPanda Tech Hub",
    };
  }

  return {
    title: `${blog.title} | HangingPanda Tech Hub`,
    description: blog.excerpt,
    alternates: {
      canonical: `https://hangingpanda.com/blog/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: `https://hangingpanda.com/blog/${slug}`,
      type: "article",
      images: [
        {
          url: blog.featuredImage || "/favicon.svg",
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
      name: blog.author?.name || "HangingPanda Engineer",
    },
    datePublished: blog.publishedAt || "2026-06-15",
    publisher: {
      "@type": "Organization",
      name: "HangingPanda",
      logo: {
        "@type": "ImageObject",
        url: "https://hangingpanda.com/favicon.svg",
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
