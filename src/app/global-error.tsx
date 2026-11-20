'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0a0d14',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '90%',
          padding: '36px',
          backgroundColor: '#111726',
          borderRadius: '24px',
          border: '1px solid #1e293b',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px', color: '#ffffff' }}>
            System Notice
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            An unexpected error occurred. Please try reloading the application or return to the main homepage.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: '#ef4444',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#f8fafc',
                textDecoration: 'none',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
