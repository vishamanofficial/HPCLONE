import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thank You | HangingPanda Software Labs",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <section className="py-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
      <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
        Inquiry Received Successfully!
      </h1>
      <p className="text-sm sm:text-base text-text-secondary max-w-xl">
        Thank you for reaching out. We have logged your request into our systems and an engineering director will get back to you within 12 business hours.
      </p>

      <div className="w-full mt-6 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl text-left flex flex-col gap-6 relative overflow-hidden">
        <div className="border-b border-border pb-4">
          <h2 className="text-base font-black text-text-primary uppercase tracking-wider mb-1">
            What happens next?
          </h2>
          <p className="text-xs text-text-secondary">
            Our engineering workflow begins immediately upon inquiry dispatch.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3.5">
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <Heart className="w-4.5 h-4.5 text-primary fill-current animate-pulse" /> Next Steps
          </h3>
          <ol className="list-decimal pl-5 text-xs text-text-secondary flex flex-col gap-2 leading-relaxed">
            <li>An engineering director audits your project concept and stack requirements.</li>
            <li>We draft a mutual Non-Disclosure Agreement (NDA) to safeguard your technical assets.</li>
            <li>We schedule a 20-minute architecture scoping call to map out sprint deliverables.</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="gradient">
            Explore Services
          </Button>
        </Link>
      </div>
    </section>
  );
}
