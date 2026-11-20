'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/admin/Toast';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error: toastError } = useToast();

  useEffect(() => {
    console.error('[Admin Panel Error]:', error);
    toastError(error.message || 'An unexpected issue occurred in the admin portal.');
  }, [error, toastError]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-xl flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-bold text-text-primary tracking-tight">
            Admin Module Notice
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {error.message || 'The requested administrative operation encountered an issue.'}
          </p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <Button
            variant="primary"
            className="flex-1 justify-center"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Retry Action
          </Button>
          <Link href="/admin/dashboard" className="flex-1">
            <Button
              variant="secondary"
              className="w-full justify-center"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
