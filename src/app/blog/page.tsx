import type { Metadata } from "next";
import { nextApi } from "@/lib/server-api";
import { BlogClient } from "./BlogClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} Technical Blog | Custom Software Insights`,
  description:
    `Audit the latest tech guides. ${siteConfig.name} writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies.`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: `${siteConfig.name} Technical Blog | Custom Software Insights`,
    description:
      `Audit the latest tech guides. ${siteConfig.name} writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies.`,
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const blogsRes = await nextApi.getBlogs();
  return <BlogClient initialBlogs={blogsRes?.blogs || []} />;
}
