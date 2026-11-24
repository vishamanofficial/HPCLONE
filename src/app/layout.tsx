import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/admin/Toast";
import { PublicLayoutWrapper } from "@/components/PublicLayoutWrapper";
import { nextApi } from "@/lib/server-api";
import { siteConfig } from "@/config/site";

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await nextApi.getSettings();
  const siteName = settings?.siteName || siteConfig.name;
  const siteTagline = settings?.siteTagline || siteConfig.tagline;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteName} - ${siteTagline}`,
      template: `%s | ${siteName}`,
    },
    description: siteConfig.description,
    keywords: [
      "Software Development",
      "AI Engineering",
      "Mobile App Development",
      "React Next.js",
      "Node.js",
      "Enterprise Web Apps",
      "Bangalore Software Agency"
    ],
    authors: [{ name: `${siteConfig.name} ${siteConfig.subName}` }],
    creator: siteConfig.name,
    icons: {
      icon: siteConfig.assets.favicon,
      apple: siteConfig.assets.favicon,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteName,
      title: `${siteName} - ${siteTagline}`,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.assets.ogImage,
          width: 800,
          height: 600,
          alt: `${siteName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${siteTagline}`,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await nextApi.getSettings();
  const services = await nextApi.getServices();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-bg text-text-primary antialiased selection:bg-primary selection:text-white flex flex-col font-sans"
      >
        <ThemeProvider>
          <ToastProvider>
            <PublicLayoutWrapper settings={settings} services={services}>
              {children}
            </PublicLayoutWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
