'use client';

import React from 'react';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ToastProvider } from '@/components/admin/Toast';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminLayout>{children}</AdminLayout>
      </ToastProvider>
    </AdminAuthProvider>
  );
}
