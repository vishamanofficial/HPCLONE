import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true, // Keep infra costs zero (no Cloudinary/Vercel image optimization charges)
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  serverExternalPackages: ['mongoose', 'mongodb-memory-server', 'bcryptjs'],
  webpack: (config) => {
    // Avoid Windows / OneDrive file locks on webpack cache packs
    config.cache = {
      type: 'memory',
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
