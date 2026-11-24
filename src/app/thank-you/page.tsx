import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYouClient } from "./ThankYouClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Inquiry Received | ${siteConfig.name} ${siteConfig.subName}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-text-muted text-sm">
          Loading confirmation...
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
