'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
  settings: any;
  services: any;
}

export function PublicLayoutWrapper({
  children,
  settings,
  services,
}: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen w-full">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-16 sm:pt-20">
        {children}
      </main>
      <Footer settings={settings} services={services} />
    </>
  );
}
