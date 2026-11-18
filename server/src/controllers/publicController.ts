import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SiteSettings } from '../models/SiteSettings.js';
import { Page } from '../models/Page.js';
import { Service } from '../models/Service.js';
import { Blog } from '../models/Blog.js';
import { Portfolio } from '../models/Portfolio.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { FAQ } from '../models/FAQ.js';
import { NavigationMenu } from '../models/NavigationMenu.js';
import { Job } from '../models/Job.js';
import { Lead } from '../models/Lead.js';
import { SeoSettings } from '../models/SeoSettings.js';
import { Redirect } from '../models/Redirect.js';

export const getSiteSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNavigation = async (req: Request, res: Response): Promise<void> => {
  try {
    const menus = await NavigationMenu.find({ isActive: true });
    const formatted: Record<string, any> = {};
    menus.forEach((menu) => {
      formatted[menu.location] = menu.items;
    });
    res.json({ success: true, menus: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHomepage = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = await Page.findOne({ slug: 'home', status: 'published' });
    const services = await Service.find({ status: 'published' }).sort({ displayOrder: 1 });
    const portfolio = await Portfolio.find({ status: 'published' }).sort({ displayOrder: 1 });
    const testimonials = await Testimonial.find({ status: 'published', isFeatured: true }).sort({ displayOrder: 1 });
    const faqs = await FAQ.find({ isActive: true, category: 'general' }).sort({ displayOrder: 1 });

    res.json({
      success: true,
      page,
      sections: page?.sections || [],
      dynamicData: {
        services,
        portfolio,
        testimonials,
        faqs
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPageBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const page = await Page.findOne({ slug, status: 'published' });

    if (!page) {
      // Check if redirect exists
      const redirect = await Redirect.findOne({ sourceUrl: `/${slug}`, isActive: true });
      if (redirect) {
        redirect.hitCount += 1;
        redirect.lastTriggeredAt = new Date();
        await redirect.save();
        res.status(redirect.statusCode).json({
          success: false,
          redirect: redirect.destinationUrl,
          statusCode: redirect.statusCode
        });
        return;
      }

      res.status(404).json({ success: false, message: 'Page not found or not published' });
      return;
    }

    res.json({ success: true, page });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ status: 'published' }).sort({ displayOrder: 1 });
    res.json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const service = await Service.findOne({ slug, status: 'published' });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag, search, page = 1, limit = 10 } = req.query;
    const filter: Record<string, any> = { status: 'published' };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const blog = await Blog.findOne({ slug, status: 'published' }).populate(
      'relatedArticles',
      'title slug excerpt category featuredImage readTime publishedAt'
    );

    if (!blog) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    // Fetch related articles if none populated
    let related = blog.relatedArticles || [];
    if (related.length === 0) {
      related = (await Blog.find({
        status: 'published',
        _id: { $ne: blog._id },
        category: blog.category
      })
        .limit(3)
        .select('title slug excerpt category featuredImage readTime publishedAt')) as any;
    }

    res.json({ success: true, blog, related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const portfolio = await Portfolio.find({ status: 'published' }).sort({ displayOrder: 1 });
    res.json({ success: true, portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolioBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = String(req.params.slug).toLowerCase();
    const item = await Portfolio.findOne({ slug, status: 'published' });
    if (!item) {
      res.status(404).json({ success: false, message: 'Case study not found' });
      return;
    }
    res.json({ success: true, portfolioItem: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find({ status: 'published' }).sort({ displayOrder: 1 });
    res.json({ success: true, testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await TeamMember.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({ success: true, team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, serviceSlug } = req.query;
    const filter: Record<string, any> = { isActive: true };
    if (category) filter.category = category;
    if (serviceSlug) filter.relatedServiceSlug = serviceSlug;

    const faqs = await FAQ.find(filter).sort({ displayOrder: 1 });
    res.json({ success: true, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({ success: true, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      countryCode = '+91',
      isWhatsApp = true,
      companyName,
      interestedService,
      budget,
      message,
      source = 'contact_page',
      calculatorDetails
    } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: 'Name, email, and phone number are required.' });
      return;
    }

    const newLead = await Lead.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      countryCode,
      isWhatsApp: Boolean(isWhatsApp),
      companyName,
      interestedService,
      budget,
      message,
      source,
      calculatorDetails,
      status: 'new',
      priority: budget && budget.includes('$15k') ? 'high' : 'medium',
      activityLog: [
        {
          action: 'LEAD_SUBMITTED',
          performedBy: 'Visitor',
          timestamp: new Date(),
          details: `Inquiry submitted via ${source}. Budget: ${budget || 'N/A'}`
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Our team will contact you shortly.',
      leadId: newLead._id
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSitemapXml = async (req: Request, res: Response): Promise<void> => {
  try {
    const seo = await SeoSettings.findOne();
    const siteUrl = seo?.siteUrl || 'https://hangingpanda.com';

    const pages = await Page.find({ status: 'published' }).select('slug updatedAt');
    const services = await Service.find({ status: 'published' }).select('slug updatedAt');
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt');
    const portfolio = await Portfolio.find({ status: 'published' }).select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static / Root Pages
    const staticRoutes = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/pandanextai', priority: '0.9', changefreq: 'weekly' },
      { url: '/case-studies', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/career', priority: '0.7', changefreq: 'monthly' },
      { url: '/app-cost-calculator', priority: '0.8', changefreq: 'monthly' },
      { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { url: '/cookies-policy', priority: '0.3', changefreq: 'yearly' }
    ];

    staticRoutes.forEach((route) => {
      xml += `  <url>\n    <loc>${siteUrl}${route.url}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    });

    // Dynamic Pages
    pages.forEach((p) => {
      if (p.slug !== 'home') {
        xml += `  <url>\n    <loc>${siteUrl}/${p.slug}</loc>\n    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }
    });

    // Services
    services.forEach((s) => {
      xml += `  <url>\n    <loc>${siteUrl}/services/${s.slug}</loc>\n    <lastmod>${s.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // Blogs
    blogs.forEach((b) => {
      xml += `  <url>\n    <loc>${siteUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Portfolio
    portfolio.forEach((item) => {
      xml += `  <url>\n    <loc>${siteUrl}/case-studies#${item.slug}</loc>\n    <lastmod>${item.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error: any) {
    res.status(500).send('Error generating sitemap');
  }
};

export const getRobotsTxt = async (req: Request, res: Response): Promise<void> => {
  try {
    const seo = await SeoSettings.findOne();
    const siteUrl = seo?.siteUrl || 'https://hangingpanda.com';

    if (seo?.customRobotsTxt) {
      res.header('Content-Type', 'text/plain');
      res.send(seo.customRobotsTxt);
      return;
    }

    const content = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
    res.header('Content-Type', 'text/plain');
    res.send(content);
  } catch (error: any) {
    res.status(500).send('User-agent: *\nAllow: /');
  }
};

export const validatePreviewToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = String(req.params.token);
    const secret = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';
    const decoded = jwt.verify(token, secret) as unknown as { type: string; id: string };

    if (decoded.type === 'page') {
      const page = await Page.findById(decoded.id);
      res.json({ success: true, previewType: 'page', data: page });
      return;
    } else if (decoded.type === 'blog') {
      const blog = await Blog.findById(decoded.id);
      res.json({ success: true, previewType: 'blog', data: blog });
      return;
    } else if (decoded.type === 'service') {
      const service = await Service.findById(decoded.id);
      res.json({ success: true, previewType: 'service', data: service });
      return;
    }

    res.status(400).json({ success: false, message: 'Invalid preview type' });
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired preview token' });
  }
};
