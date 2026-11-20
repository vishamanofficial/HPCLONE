import type { Metadata } from "next";
import { PandaNextAIClient } from "./PandaNextAIClient";

export const metadata: Metadata = {
  title: "PandaNext AI | Custom Enterprise AI & Autonomous Agents",
  description:
    "Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms.",
  alternates: {
    canonical: "https://hangingpanda.com/pandanextai",
  },
  openGraph: {
    title: "PandaNext AI | Custom Enterprise AI & Autonomous Agents",
    description:
      "Leverage next-gen AI automation with PandaNext AI. We build autonomous workflow agents, custom LLM pipelines, vector databases, and predictive algorithms.",
    url: "https://hangingpanda.com/pandanextai",
    type: "website",
  },
};

export default function PandaNextAIPage() {
  return <PandaNextAIClient />;
}
