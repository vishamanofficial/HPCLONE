import type { Metadata } from "next";
import { CareerClient } from "./CareerClient";

export const metadata: Metadata = {
  title: "Careers | Join HangingPanda Tech Labs",
  description:
    "Explore job openings at HangingPanda. We hire certified React developers, mobile engineers, and database architects. Flexible work culture.",
  alternates: {
    canonical: "https://hangingpanda.com/career",
  },
  openGraph: {
    title: "Careers | Join HangingPanda Tech Labs",
    description:
      "Explore job openings at HangingPanda. We hire certified React developers, mobile engineers, and database architects. Flexible work culture.",
    url: "https://hangingpanda.com/career",
    type: "website",
  },
};

export default function CareerPage() {
  return <CareerClient />;
}
