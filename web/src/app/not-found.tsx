'use client';

import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="py-24 max-w-md mx-auto px-6 text-center flex flex-col items-center gap-6 justify-center min-h-[60vh]">
      <Compass className="w-16 h-16 text-primary animate-spin" style={{ animationDuration: "6s" }} />
      <h1 className="text-6xl font-black text-primary tracking-tight">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight leading-none">
        Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        The route or page you are requesting doesn&apos;t exist, has been archived, or was moved.
      </p>
      <Link href="/" className="mt-4">
        <Button variant="gradient" leftIcon={<Home className="w-4 h-4" />}>
          Return to Homepage
        </Button>
      </Link>
    </section>
  );
}
