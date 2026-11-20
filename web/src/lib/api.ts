// Server and Client API client for HangingPanda Next.js App Router
import { servicesData } from '@/data/servicesData';
import { portfolioData } from '@/data/portfolioData';
import { blogsData } from '@/data/blogsData';

// On the server, we connect directly to backend (port 5000). On client, we can use relative /api/v1 or absolute.
const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://127.0.0.1:5000/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1');

async function serverFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      // Default ISR revalidation: 60 seconds (blazing fast, auto-updating)
      next: { revalidate: 60, ...(options as any)?.next },
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      console.warn(`[Next API] ${endpoint} returned ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`[Next API] Could not reach backend for ${endpoint}:`, err.message);
    return null;
  }
}

export const nextApi = {
  // Public Settings
  async getSettings() {
    const res = await serverFetch<{ success: boolean; settings: any }>('/public/settings');
    return res?.settings || {
      siteName: 'HangingPanda',
      siteTagline: 'Engineering Scalable Software & AI Products',
      contactEmail: 'contact@hangingpanda.com',
      contactPhone: '+91 98765 43210',
      whatsappNumber: '+919876543210',
      address: 'Tech Park, Bangalore, Karnataka, India'
    };
  },

  // Homepage Dynamic Content
  async getHomepage() {
    const res = await serverFetch<{
      success: boolean;
      page: any;
      sections: any[];
      dynamicData: {
        services: any[];
        portfolio: any[];
        testimonials: any[];
        faqs: any[];
      };
    }>('/public/homepage');
    return res || null;
  },

  // Custom Page by Slug
  async getPageBySlug(slug: string) {
    const res = await serverFetch<{ success: boolean; page: any }>(`/public/pages/${slug}`);
    return res?.page || null;
  },

  // Services
  async getServices() {
    const res = await serverFetch<{ success: boolean; services: any[] }>('/public/services');
    if (res?.services && res.services.length > 0) return res.services;
    // Fallback to static seed services
    return servicesData;
  },

  async getServiceBySlug(slug: string) {
    const res = await serverFetch<{ success: boolean; service: any }>(`/public/services/${slug}`);
    if (res?.service) return res.service;
    return servicesData.find(s => s.slug === slug) || null;
  },

  // Blog
  async getBlogs(params?: { category?: string; tag?: string; search?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await serverFetch<{ success: boolean; blogs: any[]; pagination: any }>(
      `/public/blogs${query ? `?${query}` : ''}`
    );
    if (res?.blogs && res.blogs.length > 0) return res;
    return {
      success: true,
      blogs: blogsData,
      pagination: { total: blogsData.length, page: 1, limit: 10, totalPages: 1 }
    };
  },

  async getBlogBySlug(slug: string) {
    const res = await serverFetch<{ success: boolean; blog: any; related: any[] }>(`/public/blogs/${slug}`);
    if (res?.blog) return res;
    const blog = blogsData.find(b => b.id === slug);
    return {
      success: !!blog,
      blog: blog || null,
      related: blogsData.filter(b => b.id !== slug).slice(0, 3)
    };
  },

  // Portfolio
  async getPortfolio() {
    const res = await serverFetch<{ success: boolean; portfolio: any[] }>('/public/portfolio');
    if (res?.portfolio && res.portfolio.length > 0) return res.portfolio;
    return portfolioData;
  },

  async getPortfolioBySlug(slug: string) {
    const res = await serverFetch<{ success: boolean; portfolioItem: any }>(`/public/portfolio/${slug}`);
    if (res?.portfolioItem) return res.portfolioItem;
    return portfolioData.find(p => p.id === slug) || null;
  },

  // Testimonials
  async getTestimonials() {
    const res = await serverFetch<{ success: boolean; testimonials: any[] }>('/public/testimonials');
    return res?.testimonials || [];
  },

  // Team
  async getTeam() {
    const res = await serverFetch<{ success: boolean; team: any[] }>('/public/team');
    return res?.team || [];
  },

  // FAQs
  async getFAQs(category?: string) {
    const res = await serverFetch<{ success: boolean; faqs: any[] }>(
      `/public/faqs${category ? `?category=${category}` : ''}`
    );
    return res?.faqs || [];
  },

  // Jobs
  async getJobs() {
    const res = await serverFetch<{ success: boolean; jobs: any[] }>('/public/jobs');
    return res?.jobs || [];
  },

  // Navigation Menus
  async getNavigation() {
    const res = await serverFetch<{ success: boolean; menus: Record<string, any[]> }>('/public/navigation');
    return res?.menus || null;
  },

  // Client-Side Inquiries submission
  async submitInquiry(data: any) {
    const res = await fetch(`${API_BASE_URL}/public/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};
