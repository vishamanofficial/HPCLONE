import type { Metadata } from "next";
import { nextApi } from "@/lib/api";
import { BlogClient } from "./BlogClient";

export const metadata: Metadata = {
  title: "HangingPanda Technical Blog | Custom Software Insights",
  description:
    "Audit the latest tech guides. HangingPanda writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies.",
  alternates: {
    canonical: "https://hangingpanda.com/blog",
  },
  openGraph: {
    title: "HangingPanda Technical Blog | Custom Software Insights",
    description:
      "Audit the latest tech guides. HangingPanda writes articles detailing AI workflows, mobile app frameworks, custom server architectures, and product strategies.",
    url: "https://hangingpanda.com/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const blogsRes = await nextApi.getBlogs();
  return <BlogClient initialBlogs={blogsRes?.blogs || []} />;
}
