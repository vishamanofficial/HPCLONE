import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/admin/Toast";
import { PublicLayoutWrapper } from "@/components/PublicLayoutWrapper";
import { nextApi } from "@/lib/server-api";

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await nextApi.getSettings();
  const siteName = settings?.siteName || "HangingPanda";
  const siteTagline = settings?.siteTagline || "Engineering Scalable Software & AI Products";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hangingpanda.com"),
    title: {
      default: `${siteName} - ${siteTagline}`,
      template: `%s | ${siteName}`,
    },
    description:
      "From day one, HangingPanda engineers production-grade mobile applications, robust web platforms, and custom machine learning pipelines backed by enforceable delivery guarantees.",
    keywords: [
      "Software Development",
      "AI Engineering",
      "Mobile App Development",
      "React Next.js",
      "Node.js",
      "Enterprise Web Apps",
      "Bangalore Software Agency"
    ],
    authors: [{ name: "HangingPanda Software Labs" }],
    creator: "HangingPanda",
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://hangingpanda.com",
      siteName: siteName,
      title: `${siteName} - ${siteTagline}`,
      description: "Engineering scalable software, enterprise web apps, and AI products.",
      images: [
        {
          url: "/favicon.svg",
          width: 800,
          height: 600,
          alt: `${siteName} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${siteTagline}`,
      description: "Engineering scalable software, enterprise web apps, and AI products.",
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
