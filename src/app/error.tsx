'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/admin/Toast';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error: toastError } = useToast();

  useEffect(() => {
    console.error('[Application Error Boundary caught error]:', error);
    toastError(error.message || 'An unexpected error occurred while loading this page.');
  }, [error, toastError]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border/80 p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black text-text-primary tracking-tight">
            Something Went Wrong
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We encountered an unexpected issue while loading this view. You can reload this component or return to safety.
          </p>
        </div>

        {error.digest && (
          <span className="text-[10px] text-text-muted font-mono bg-surface px-3 py-1.5 rounded-lg border border-border">
            Error Digest: {error.digest}
          </span>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="primary"
            className="flex-1 justify-center"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="secondary"
              className="w-full justify-center"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
