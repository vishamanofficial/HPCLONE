// HangingPanda High-Performance Server-Side Data Layer
// Runs strictly on the server in Server Components (Zero HTTP network latency, direct Mongoose queries with instant fallback)
import mongoose from 'mongoose';
import { cache } from 'react';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@/models/SiteSettings';
import { Page } from '@/models/Page';
import { Service } from '@/models/Service';
import { Blog } from '@/models/Blog';
import { Portfolio } from '@/models/Portfolio';
import { Testimonial } from '@/models/Testimonial';
import { FAQ } from '@/models/FAQ';
import { TeamMember } from '@/models/TeamMember';
import { Job } from '@/models/Job';
import { NavigationMenu } from '@/models/NavigationMenu';

// Fast DB readiness check: if already connected, queries run immediately.
// Concurrent calls share one promise and resolve in <= 400ms so SSR never blocks browser loading.
let dbCheckPromise: Promise<boolean> | null = null;

async function ensureDbQuick(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) return true;
  if (dbCheckPromise) return dbCheckPromise;

  dbCheckPromise = (async () => {
    try {
      const connPromise = connectDB();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('db-timeout')), 400)
      );
      await Promise.race([connPromise, timeoutPromise]);
      return mongoose.connection.readyState === 1;
    } catch {
      return false;
    } finally {
      setTimeout(() => {
        dbCheckPromise = null;
      }, 1500);
    }
  })();

  return dbCheckPromise;
}

// Static Data Fallbacks
import { servicesData } from '@/data/servicesData';
import { portfolioData } from '@/data/portfolioData';
import { blogsData } from '@/data/blogsData';

const defaultSettings = {
  siteName: 'HangingPanda',
  siteTagline: 'Engineering Scalable Software & AI Products',
  contactEmail: 'contact@hangingpanda.com',
  contactPhone: '+91 98765 43210',
  whatsappNumber: '+919876543210',
  address: 'Tech Park, Bangalore, Karnataka, India'
};

export const nextApi = {
  // 1. Site Settings
  getSettings: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const settings = await SiteSettings.findOne().lean();
        if (settings) {
          return JSON.parse(JSON.stringify(settings));
        }
      }
    } catch (err: any) {
      console.warn('[nextApi.getSettings] DB notice:', err.message);
    }
    return defaultSettings;
  }),

  // 2. Homepage Dynamic Content & Modular Sections
  getHomepage: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const page = await Page.findOne({ slug: 'home', status: 'published' }).lean();
        if (page) {
          const [services, portfolio, testimonials, faqs] = await Promise.all([
            Service.find({ isActive: true }).sort({ displayOrder: 1 }).limit(6).lean(),
            Portfolio.find({ status: 'published', isFeatured: true }).sort({ displayOrder: 1 }).limit(6).lean(),
            Testimonial.find({ status: 'published' }).sort({ displayOrder: 1 }).limit(6).lean(),
            FAQ.find({ status: 'published' }).sort({ displayOrder: 1 }).limit(10).lean()
          ]);

          return JSON.parse(JSON.stringify({
            success: true,
            page,
            sections: (page as any).sections || [],
            dynamicData: {
              services: services.length > 0 ? services : servicesData.slice(0, 6),
              portfolio: portfolio.length > 0 ? portfolio : portfolioData.slice(0, 6),
              testimonials,
              faqs
            }
          }));
        }
      }
    } catch (err: any) {
      console.warn('[nextApi.getHomepage] DB notice:', err.message);
    }
    return null;
  }),

  // 3. Custom Page by Slug
  getPageBySlug: cache(async (slug: string) => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const page = await Page.findOne({ slug, status: 'published' }).lean();
        if (page) return JSON.parse(JSON.stringify(page));
      }
    } catch (err: any) {
      console.warn(`[nextApi.getPageBySlug] DB notice for ${slug}:`, err.message);
    }
    return null;
  }),

  // 4. Services
  getServices: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const services = await Service.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
        if (services && services.length > 0) {
          return JSON.parse(JSON.stringify(services));
        }
      }
    } catch (err: any) {
      console.warn('[nextApi.getServices] DB notice:', err.message);
    }
    return servicesData;
  }),

  getServiceBySlug: cache(async (slug: string) => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const service = await Service.findOne({ slug, isActive: true }).lean();
        if (service) return JSON.parse(JSON.stringify(service));
      }
    } catch (err: any) {
      console.warn(`[nextApi.getServiceBySlug] DB notice for ${slug}:`, err.message);
    }
    return servicesData.find(s => s.slug === slug) || null;
  }),

  // 5. Blog Posts & Articles
  async getBlogs(params?: { category?: string; tag?: string; search?: string; page?: number }) {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const filter: any = { status: 'published' };
        if (params?.category && params.category !== 'All') filter.category = params.category;
        if (params?.tag) filter.tags = params.tag;
        if (params?.search) {
          filter.$or = [
            { title: { $regex: params.search, $options: 'i' } },
            { excerpt: { $regex: params.search, $options: 'i' } }
          ];
        }

        const blogs = await Blog.find(filter).sort({ publishedAt: -1 }).lean();
        if (blogs && blogs.length > 0) {
          const page = params?.page || 1;
          const limit = 10;
          return JSON.parse(JSON.stringify({
            success: true,
            blogs,
            pagination: { total: blogs.length, page, limit, totalPages: Math.ceil(blogs.length / limit) }
          }));
        }
      }
    } catch (err: any) {
      console.warn('[nextApi.getBlogs] DB notice:', err.message);
    }

    return {
      success: true,
      blogs: blogsData,
      pagination: { total: blogsData.length, page: 1, limit: 10, totalPages: 1 }
    };
  },

  async getBlogBySlug(slug: string) {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const blog = await Blog.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] }).lean();
        if (blog) {
          const related = await Blog.find({ category: (blog as any).category, _id: { $ne: (blog as any)._id }, status: 'published' }).limit(3).lean();
          return JSON.parse(JSON.stringify({
            success: true,
            blog,
            related
          }));
        }
      }
    } catch (err: any) {
      console.warn(`[nextApi.getBlogBySlug] DB notice for ${slug}:`, err.message);
    }

    const blog = blogsData.find(b => b.id === slug);
    return {
      success: !!blog,
      blog: blog || null,
      related: blogsData.filter(b => b.id !== slug).slice(0, 3)
    };
  },

  // 6. Portfolio
  getPortfolio: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const portfolio = await Portfolio.find({ status: 'published' }).sort({ displayOrder: 1 }).lean();
        if (portfolio && portfolio.length > 0) return JSON.parse(JSON.stringify(portfolio));
      }
    } catch (err: any) {
      console.warn('[nextApi.getPortfolio] DB notice:', err.message);
    }
    return portfolioData;
  }),

  getPortfolioBySlug: cache(async (slug: string) => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const portfolioItem = await Portfolio.findOne({ slug, status: 'published' }).lean();
        if (portfolioItem) return JSON.parse(JSON.stringify(portfolioItem));
      }
    } catch (err: any) {
      console.warn(`[nextApi.getPortfolioBySlug] DB notice for ${slug}:`, err.message);
    }
    return portfolioData.find(p => p.id === slug) || null;
  }),

  // 7. Testimonials
  getTestimonials: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const testimonials = await Testimonial.find({ status: 'published' }).sort({ displayOrder: 1 }).lean();
        if (testimonials && testimonials.length > 0) return JSON.parse(JSON.stringify(testimonials));
      }
    } catch (err: any) {}
    return [];
  }),

  // 8. Team Members
  getTeam: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const team = await TeamMember.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
        if (team && team.length > 0) return JSON.parse(JSON.stringify(team));
      }
    } catch (err: any) {}
    return [];
  }),

  // 9. FAQs
  getFAQs: cache(async (category?: string) => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const filter: any = { status: 'published' };
        if (category) filter.category = category;
        const faqs = await FAQ.find(filter).sort({ displayOrder: 1 }).lean();
        if (faqs && faqs.length > 0) return JSON.parse(JSON.stringify(faqs));
      }
    } catch (err: any) {}
    return [];
  }),

  // 10. Jobs
  getJobs: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const jobs = await Job.find({ status: 'published' }).sort({ postedAt: -1 }).lean();
        if (jobs && jobs.length > 0) return JSON.parse(JSON.stringify(jobs));
      }
    } catch (err: any) {}
    return [];
  }),

  // 11. Navigation Menus
  getNavigation: cache(async () => {
    try {
      const ready = await ensureDbQuick();
      if (ready) {
        const menus = await NavigationMenu.find({ isActive: true }).lean();
        if (menus && menus.length > 0) {
          const menuMap: Record<string, any[]> = {};
          menus.forEach(m => { menuMap[m.location] = m.items; });
          return JSON.parse(JSON.stringify(menuMap));
        }
      }
    } catch (err: any) {}
    return null;
  })
};
