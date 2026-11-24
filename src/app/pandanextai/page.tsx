import type { Metadata } from "next";
import { PandaNextAIClient } from "./PandaNextAIClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "PandaNext AI | Custom Enterprise AI & Autonomous Agents",
  description:
    "Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms.",
  alternates: {
    canonical: `${siteConfig.url}/pandanextai`,
  },
  openGraph: {
    title: "PandaNext AI | Custom Enterprise AI & Autonomous Agents",
    description:
      "Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms.",
    url: `${siteConfig.url}/pandanextai`,
    type: "website",
  },
};

export default function PandaNextAIPage() {
  return <PandaNextAIClient />;
}
