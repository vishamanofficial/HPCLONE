import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | Custom Software Consultation | ${siteConfig.name}`,
  description:
    `Get in touch with ${siteConfig.name}. Write your project requirements for mobile apps, custom SaaS databases, or request audits. ${siteConfig.address.street} ${siteConfig.address.locality}.`,
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact Us | Custom Software Consultation | ${siteConfig.name}`,
    description:
      `Get in touch with ${siteConfig.name}. Write your project requirements for mobile apps, custom SaaS databases, or request audits. ${siteConfig.address.street} ${siteConfig.address.locality}.`,
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
