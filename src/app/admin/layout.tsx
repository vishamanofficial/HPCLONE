'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ToastProvider } from '@/components/admin/Toast';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <ToastProvider>
          <AdminLayout>{children}</AdminLayout>
        </ToastProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
