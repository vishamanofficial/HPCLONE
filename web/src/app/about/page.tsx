import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | HangingPanda Software Engineering Guarantees",
  description:
    "Learn about HangingPanda, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines.",
  alternates: {
    canonical: "https://hangingpanda.com/about",
  },
  openGraph: {
    title: "About Us | HangingPanda Software Engineering Guarantees",
    description:
      "Learn about HangingPanda, an IT solutions partner offering 2.5 years of free app maintenance, real-time live code tracking, and strict SLA timelines.",
    url: "https://hangingpanda.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
