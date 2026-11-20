import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Custom Software Consultation | HangingPanda",
  description:
    "Get in touch with HangingPanda. Write your project requirements for mobile apps, custom SaaS databases, or request audits. B-64 Noida Sector 63.",
  alternates: {
    canonical: "https://hangingpanda.com/contact",
  },
  openGraph: {
    title: "Contact Us | Custom Software Consultation | HangingPanda",
    description:
      "Get in touch with HangingPanda. Write your project requirements for mobile apps, custom SaaS databases, or request audits. B-64 Noida Sector 63.",
    url: "https://hangingpanda.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
