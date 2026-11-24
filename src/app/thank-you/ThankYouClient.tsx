"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Heart, MessageSquare, Mail, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export function ThankYouClient() {
  const searchParams = useSearchParams();
  const clientName = searchParams.get("name") || "";
  const paramWhatsapp = searchParams.get("whatsapp");
  const cost = searchParams.get("cost");

  const targetPhone = siteConfig.phone.replace(/[^0-9]/g, "") || "918887024887";
  const defaultWhatsApp = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}, I submitted an inquiry${clientName ? ` (Name: ${clientName})` : ""}. I'd like to discuss my project requirements.`
  )}`;

  const whatsappUrl = paramWhatsapp || defaultWhatsApp;

  return (
    <section className="py-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
        {clientName ? `Thank You, ${clientName}!` : "Inquiry Received Successfully!"}
      </h1>

      <p className="text-sm sm:text-base text-text-secondary max-w-xl leading-relaxed">
        Your project requirements have been registered in our system and dispatched to our engineering leadership at{" "}
        <strong className="text-text-primary">{siteConfig.emails.contact}</strong>.
      </p>

      {/* Prominent WhatsApp Instant Connect Card */}
      <div className="w-full mt-2 bg-gradient-to-br from-emerald-500/10 via-card to-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-left flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Priority Direct Channel
              </span>
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Chat Directly with our Lead Architect on WhatsApp
              </h2>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            ~15 Min Response
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Skip email queues. Connect directly with our engineering team on WhatsApp to review your architecture blueprints, milestone timelines, or cost breakdown immediately.
        </p>

        {cost && (
          <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between text-xs font-semibold text-text-primary">
            <span>Estimated Project Scope:</span>
            <span className="text-primary font-bold text-sm">${Number(cost).toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1"
          >
            <Button
              variant="gradient"
              size="lg"
              className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20"
              leftIcon={<MessageSquare className="w-5 h-5" />}
            >
              Open WhatsApp Chat ({siteConfig.phone})
            </Button>
          </a>

          <a
            href={`mailto:${siteConfig.emails.contact}?subject=${encodeURIComponent(`Project Discussion - ${clientName || siteConfig.name}`)}`}
            className="w-full sm:w-auto"
          >
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center"
              leftIcon={<Mail className="w-4 h-4" />}
            >
              Email Engineering Team
            </Button>
          </a>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm text-left flex flex-col gap-5 relative overflow-hidden">
        <div className="border-b border-border pb-3">
          <h2 className="text-sm font-black text-text-primary uppercase tracking-wider mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> What Happens Next?
          </h2>
          <p className="text-xs text-text-secondary">
            Our structured 4-step engineering roadmap initiates upon receiving your scope.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface rounded-2xl border border-border flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step 1</span>
            <span className="text-xs font-bold text-text-primary">Architecture Review</span>
            <span className="text-[11px] text-text-secondary leading-relaxed">
              We audit your concept, database models, and target platforms.
            </span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step 2</span>
            <span className="text-xs font-bold text-text-primary">Standard NDA</span>
            <span className="text-[11px] text-text-secondary leading-relaxed">
              We issue a mutual NDA protecting your intellectual property.
            </span>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-border flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Step 3</span>
            <span className="text-xs font-bold text-text-primary">Interactive Blueprint</span>
            <span className="text-[11px] text-text-secondary leading-relaxed">
              Receive a sprint breakdown with exact deliverables and fixed pricing.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="gradient" rightIcon={<Layers className="w-4 h-4" />}>
            Explore Services Catalog
          </Button>
        </Link>
      </div>
    </section>
  );
}
