import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLogger.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Page } from '../models/Page.js';
import { PageRevision } from '../models/PageRevision.js';
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
import { Media } from '../models/Media.js';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { AuditLog } from '../models/AuditLog.js';
import { publicCache } from '../utils/cache.js';

// ==========================================
// 1. DASHBOARD OVERVIEW & STATS
// ==========================================
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      publishedPagesCount,
      draftPagesCount,
      blogsCount,
      servicesCount,
      portfolioCount,
      testimonialsCount,
      totalLeadsCount,
      newLeadsCount,
      recentLeads,
      recentAudits,
      pagesWithoutSeo
    ] = await Promise.all([
      Page.countDocuments({ status: 'published' }),
      Page.countDocuments({ status: { $ne: 'published' } }),
      Blog.countDocuments(),
      Service.countDocuments(),
      Portfolio.countDocuments(),
      Testimonial.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.find().sort({ createdAt: -1 }).limit(5),
      AuditLog.find().sort({ createdAt: -1 }).limit(8),
      Page.countDocuments({
        $or: [{ 'seo.metaTitle': '' }, { 'seo.metaTitle': { $exists: false } }]
      })
    ]);

    res.json({
      success: true,
      stats: {
        publishedPages: publishedPagesCount,
        draftPages: draftPagesCount,
        blogs: blogsCount,
        services: servicesCount,
        portfolio: portfolioCount,
        testimonials: testimonialsCount,
        totalLeads: totalLeadsCount,
        newLeads: newLeadsCount,
        seoAlertsCount: pagesWithoutSeo,
        analyticsStatus: 'Connected (Google Analytics G-HP78201)',
        recentLeads,
        recentAudits
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. SITE SETTINGS
// ==========================================
export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    await logActivity(req, 'UPDATE_SETTINGS', 'siteSettings', String(settings._id), 'Updated global website settings');
    res.json({ success: true, settings, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. PAGES & VISUAL BUILDER WITH REVISIONS
// ==========================================
export const getPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await Page.find().sort({ updatedAt: -1 });
    res.json({ success: true, pages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }
    res.json({ success: true, page });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, sections, seo, status = 'draft' } = req.body;
    const cleanSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-') : title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');

    const existing = await Page.findOne({ slug: cleanSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A page with this URL slug already exists.' });
      return;
    }

    const page = await Page.create({
      title,
      slug: cleanSlug,
      sections: sections || [],
      seo: seo || {},
      status,
      currentRevision: 1,
      author: req.user?._id
    });

    // Record initial revision
    await PageRevision.create({
      pageId: page._id,
      revisionNumber: 1,
      title: page.title,
      slug: page.slug,
      sectionsData: page.sections,
      seoData: page.seo,
      status: page.status,
      changeSummary: 'Initial page creation',
      changedBy: req.user?._id
    });

    await logActivity(req, 'CREATE_PAGE', 'page', String(page._id), `Created page ${page.title}`);
    res.status(201).json({ success: true, page, message: 'Page created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    const oldSlug = page.slug;
    const { title, slug, sections, seo, status, changeSummary } = req.body;

    if (title !== undefined) page.title = title;
    if (sections !== undefined) page.sections = sections;
    if (seo !== undefined) page.seo = seo;
    if (status !== undefined) page.status = status;

    if (slug && slug.toLowerCase().trim() !== oldSlug) {
      const newSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const conflict = await Page.findOne({ slug: newSlug, _id: { $ne: page._id } });
      if (conflict) {
        res.status(400).json({ success: false, message: 'Another page already uses this URL slug.' });
        return;
      }
      // Auto-suggest / create 301 redirect
      if (page.status === 'published') {
        await Redirect.findOneAndUpdate(
          { sourceUrl: `/${oldSlug}` },
          { destinationUrl: `/${newSlug}`, statusCode: 301, isActive: true, notes: `Auto-created upon slug rename from ${oldSlug}` },
          { upsert: true }
        );
      }
      page.slug = newSlug;
    }

    page.currentRevision += 1;
    await page.save();

    // Create Revision Record
    await PageRevision.create({
      pageId: page._id,
      revisionNumber: page.currentRevision,
      title: page.title,
      slug: page.slug,
      sectionsData: page.sections,
      seoData: page.seo,
      status: page.status,
      changeSummary: changeSummary || 'Page content updated via Builder',
      changedBy: req.user?._id
    });

    await logActivity(req, 'UPDATE_PAGE', 'page', String(page._id), `Updated page ${page.title} (rev ${page.currentRevision})`);
    publicCache.invalidate();
    res.json({ success: true, page, message: 'Page updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    if (page.slug === 'home') {
      res.status(400).json({ success: false, message: 'The homepage cannot be deleted.' });
      return;
    }

    await Page.findByIdAndDelete(req.params.id);
    await PageRevision.deleteMany({ pageId: req.params.id });

    await logActivity(req, 'DELETE_PAGE', 'page', req.params.id, `Deleted page ${page.title}`);
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    page.status = 'published';
    page.publishedAt = new Date();
    await page.save();

    await logActivity(req, 'PUBLISH_PAGE', 'page', String(page._id), `Published page ${page.title}`);
    publicCache.invalidate();
    res.json({ success: true, page, message: 'Page published successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unpublishPage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    page.status = 'draft';
    await page.save();

    await logActivity(req, 'UNPUBLISH_PAGE', 'page', String(page._id), `Unpublished page ${page.title}`);
    publicCache.invalidate();
    res.json({ success: true, page, message: 'Page moved to draft' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPageRevisions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const revisions = await PageRevision.find({ pageId: req.params.id })
      .sort({ revisionNumber: -1 })
      .populate('changedBy', 'name email');
    res.json({ success: true, revisions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreRevision = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id, revId } = req.params;
    const revision = await PageRevision.findById(revId);
    if (!revision || String(revision.pageId) !== id) {
      res.status(404).json({ success: false, message: 'Revision record not found' });
      return;
    }

    const page = await Page.findById(id);
    if (!page) {
      res.status(404).json({ success: false, message: 'Page not found' });
      return;
    }

    page.title = revision.title;
    page.slug = revision.slug;
    page.sections = revision.sectionsData;
    page.seo = revision.seoData;
    page.currentRevision += 1;
    await page.save();

    // Log the rollback revision
    await PageRevision.create({
      pageId: page._id,
      revisionNumber: page.currentRevision,
      title: page.title,
      slug: page.slug,
      sectionsData: page.sections,
      seoData: page.seo,
      status: page.status,
      changeSummary: `Restored to Revision #${revision.revisionNumber}`,
      changedBy: req.user?._id
    });

    await logActivity(req, 'RESTORE_REVISION', 'page', String(page._id), `Restored revision #${revision.revisionNumber}`);
    res.json({ success: true, page, message: `Successfully restored to revision #${revision.revisionNumber}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePreviewToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, id } = req.body;
    const secret = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';
    const token = jwt.sign({ type, id }, secret, { expiresIn: '2h' });

    res.json({
      success: true,
      previewToken: token,
      previewUrl: `/preview/${type}/${token}`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. SERVICES CMS
// ==========================================
export const getServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    res.json({ success: true, service });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cleanSlug = req.body.slug ? req.body.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-') : req.body.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    const existing = await Service.findOne({ slug: cleanSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A service with this slug already exists.' });
      return;
    }

    const service = await Service.create({ ...req.body, slug: cleanSlug });
    await logActivity(req, 'CREATE_SERVICE', 'service', String(service._id), `Created service ${service.title}`);
    res.status(201).json({ success: true, service, message: 'Service created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }

    const oldSlug = service.slug;
    if (req.body.slug && req.body.slug !== oldSlug) {
      const newSlug = req.body.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const conflict = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (conflict) {
        res.status(400).json({ success: false, message: 'Another service uses this slug' });
        return;
      }
      await Redirect.findOneAndUpdate(
        { sourceUrl: `/services/${oldSlug}` },
        { destinationUrl: `/services/${newSlug}`, statusCode: 301, isActive: true, notes: `Auto-redirect from ${oldSlug}` },
        { upsert: true }
      );
      req.body.slug = newSlug;
    }

    Object.assign(service, req.body);
    await service.save();

    await logActivity(req, 'UPDATE_SERVICE', 'service', String(service._id), `Updated service ${service.title}`);
    res.json({ success: true, service, message: 'Service updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found' });
      return;
    }
    await logActivity(req, 'DELETE_SERVICE', 'service', req.params.id, `Deleted service ${service.title}`);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. BLOGS CMS
// ==========================================
export const getBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, blog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cleanSlug = req.body.slug ? req.body.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-') : req.body.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    const existing = await Blog.findOne({ slug: cleanSlug });
    if (existing) {
      res.status(400).json({ success: false, message: 'A blog post with this slug already exists.' });
      return;
    }

    const blog = await Blog.create({
      ...req.body,
      slug: cleanSlug,
      publishedAt: req.body.status === 'published' ? new Date() : undefined
    });

    await logActivity(req, 'CREATE_BLOG', 'blog', String(blog._id), `Created blog article ${blog.title}`);
    res.status(201).json({ success: true, blog, message: 'Blog article created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog article not found' });
      return;
    }

    const oldSlug = blog.slug;
    if (req.body.slug && req.body.slug !== oldSlug) {
      const newSlug = req.body.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const conflict = await Blog.findOne({ slug: newSlug, _id: { $ne: blog._id } });
      if (conflict) {
        res.status(400).json({ success: false, message: 'Another article already uses this slug.' });
        return;
      }
      await Redirect.findOneAndUpdate(
        { sourceUrl: `/blog/${oldSlug}` },
        { destinationUrl: `/blog/${newSlug}`, statusCode: 301, isActive: true, notes: `Auto-redirect from ${oldSlug}` },
        { upsert: true }
      );
      req.body.slug = newSlug;
    }

    if (req.body.status === 'published' && !blog.publishedAt) {
      req.body.publishedAt = new Date();
    }

    Object.assign(blog, req.body);
    await blog.save();

    await logActivity(req, 'UPDATE_BLOG', 'blog', String(blog._id), `Updated blog article ${blog.title}`);
    res.json({ success: true, blog, message: 'Blog article updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog article not found' });
      return;
    }
    await logActivity(req, 'DELETE_BLOG', 'blog', req.params.id, `Deleted blog article ${blog.title}`);
    res.json({ success: true, message: 'Blog article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. PORTFOLIO CMS
// ==========================================
export const getPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const portfolio = await Portfolio.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, portfolio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cleanSlug = req.body.slug ? req.body.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-') : req.body.title.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    const portfolio = await Portfolio.create({ ...req.body, slug: cleanSlug });
    await logActivity(req, 'CREATE_PORTFOLIO', 'portfolio', String(portfolio._id), `Created case study ${portfolio.title}`);
    res.status(201).json({ success: true, portfolio, message: 'Case study created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!portfolio) {
      res.status(404).json({ success: false, message: 'Case study not found' });
      return;
    }
    await logActivity(req, 'UPDATE_PORTFOLIO', 'portfolio', String(portfolio._id), `Updated case study ${portfolio.title}`);
    res.json({ success: true, portfolio, message: 'Case study updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Case study not found' });
      return;
    }
    await logActivity(req, 'DELETE_PORTFOLIO', 'portfolio', req.params.id, `Deleted case study ${item.title}`);
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. TESTIMONIALS CMS
// ==========================================
export const getTestimonials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(req.body);
    await logActivity(req, 'CREATE_TESTIMONIAL', 'testimonial', String(testimonial._id), `Added testimonial from ${testimonial.clientName}`);
    res.status(201).json({ success: true, testimonial, message: 'Testimonial created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    await logActivity(req, 'UPDATE_TESTIMONIAL', 'testimonial', String(testimonial._id), `Updated testimonial from ${testimonial.clientName}`);
    res.json({ success: true, testimonial, message: 'Testimonial updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    await logActivity(req, 'DELETE_TESTIMONIAL', 'testimonial', req.params.id, `Deleted testimonial from ${testimonial.clientName}`);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. TEAM MEMBERS CMS
// ==========================================
export const getTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const team = await TeamMember.find().sort({ displayOrder: 1 });
    res.json({ success: true, team });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.create(req.body);
    await logActivity(req, 'CREATE_TEAM_MEMBER', 'team', String(member._id), `Added team member ${member.name}`);
    res.status(201).json({ success: true, member, message: 'Team member added successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found' });
      return;
    }
    await logActivity(req, 'UPDATE_TEAM_MEMBER', 'team', String(member._id), `Updated team member ${member.name}`);
    res.json({ success: true, member, message: 'Team member updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      res.status(404).json({ success: false, message: 'Team member not found' });
      return;
    }
    await logActivity(req, 'DELETE_TEAM_MEMBER', 'team', req.params.id, `Deleted team member ${member.name}`);
    res.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. FAQS CMS
// ==========================================
export const getFAQs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.create(req.body);
    await logActivity(req, 'CREATE_FAQ', 'faq', String(faq._id), `Added FAQ: ${faq.question}`);
    res.status(201).json({ success: true, faq, message: 'FAQ created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    await logActivity(req, 'UPDATE_FAQ', 'faq', String(faq._id), `Updated FAQ: ${faq.question}`);
    res.json({ success: true, faq, message: 'FAQ updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFAQ = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      res.status(404).json({ success: false, message: 'FAQ not found' });
      return;
    }
    await logActivity(req, 'DELETE_FAQ', 'faq', req.params.id, `Deleted FAQ: ${faq.question}`);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. NAVIGATION MENUS CMS
// ==========================================
export const getNavigationMenus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menus = await NavigationMenu.find();
    res.json({ success: true, menus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNavigationMenu = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { location, items, title } = req.body;
    const menu = await NavigationMenu.findOneAndUpdate(
      { location },
      { items, title: title || location, isActive: true },
      { new: true, upsert: true }
    );
    await logActivity(req, 'UPDATE_NAVIGATION', 'navigation', String(menu._id), `Updated menu for ${location}`);
    res.json({ success: true, menu, message: 'Navigation menu updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 11. JOBS CMS
// ==========================================
export const getJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find().sort({ displayOrder: 1 });
    res.json({ success: true, jobs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.create(req.body);
    await logActivity(req, 'CREATE_JOB', 'job', String(job._id), `Created job posting ${job.title}`);
    res.status(201).json({ success: true, job, message: 'Job posting created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }
    await logActivity(req, 'UPDATE_JOB', 'job', String(job._id), `Updated job posting ${job.title}`);
    res.json({ success: true, job, message: 'Job posting updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }
    await logActivity(req, 'DELETE_JOB', 'job', req.params.id, `Deleted job posting ${job.title}`);
    res.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 12. MINI CRM & LEAD MANAGEMENT
// ==========================================
export const getCrmDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      negotiationLeads,
      convertedLeads,
      lostLeads,
      spamLeads,
      recentLeads,
      leadsBySource
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'qualified' }),
      Lead.countDocuments({ status: 'proposal_sent' }),
      Lead.countDocuments({ status: 'negotiation' }),
      Lead.countDocuments({ status: 'converted' }),
      Lead.countDocuments({ status: 'lost' }),
      Lead.countDocuments({ status: 'spam' }),
      Lead.find().sort({ createdAt: -1 }).limit(10),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }])
    ]);

    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

    res.json({
      success: true,
      crmMetrics: {
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
        proposalSentLeads,
        negotiationLeads,
        convertedLeads,
        lostLeads,
        spamLeads,
        conversionRate: `${conversionRate}%`,
        leadsBySource,
        recentLeads
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, source, priority, search, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    if (status && status !== 'all') filter.status = status;
    if (source && source !== 'all') filter.source = source;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      leads,
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

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    res.json({ success: true, lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeadStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    const oldStatus = lead.status;
    lead.status = status;
    lead.activityLog.push({
      action: 'STATUS_CHANGED',
      performedBy: req.user?.name || 'Admin',
      timestamp: new Date(),
      details: `Moved stage from '${oldStatus}' to '${status}'`
    });

    await lead.save();
    await logActivity(req, 'UPDATE_LEAD_STATUS', 'lead', String(lead._id), `Lead ${lead.fullName} stage: ${oldStatus} -> ${status}`);
    res.json({ success: true, lead, message: `Lead moved to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    Object.assign(lead, req.body);
    lead.activityLog.push({
      action: 'LEAD_UPDATED',
      performedBy: req.user?.name || 'Admin',
      timestamp: new Date(),
      details: 'Lead details or follow-up updated'
    });

    await lead.save();
    await logActivity(req, 'UPDATE_LEAD', 'lead', String(lead._id), `Updated lead ${lead.fullName}`);
    res.json({ success: true, lead, message: 'Lead updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addLeadNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ success: false, message: 'Note text is required' });
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    const note = {
      id: Date.now().toString(),
      text,
      addedBy: req.user?.name || 'Admin',
      createdAt: new Date()
    };

    lead.notes.unshift(note);
    lead.activityLog.push({
      action: 'NOTE_ADDED',
      performedBy: req.user?.name || 'Admin',
      timestamp: new Date(),
      details: text.length > 50 ? `${text.substring(0, 50)}...` : text
    });

    await lead.save();
    res.json({ success: true, lead, message: 'Note added successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportLeadsCsv = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    let csv = 'ID,Full Name,Email,Phone,Country Code,WhatsApp,Company,Service,Budget,Status,Priority,Source,Created At\n';
    leads.forEach((l) => {
      const row = [
        `"${l._id}"`,
        `"${(l.fullName || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${l.countryCode || ''}"`,
        `"${l.isWhatsApp ? 'Yes' : 'No'}"`,
        `"${(l.companyName || '').replace(/"/g, '""')}"`,
        `"${(l.interestedService || '').replace(/"/g, '""')}"`,
        `"${(l.budget || '').replace(/"/g, '""')}"`,
        `"${l.status}"`,
        `"${l.priority}"`,
        `"${l.source}"`,
        `"${l.createdAt.toISOString()}"`
      ];
      csv += row.join(',') + '\n';
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`hangingpanda_leads_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(500).send('Error generating CSV export');
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }
    await logActivity(req, 'DELETE_LEAD', 'lead', req.params.id, `Deleted lead ${lead.fullName}`);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 13. SEO SUITE & AUDITOR
// ==========================================
export const getSeoSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let seo = await SeoSettings.findOne();
    if (!seo) seo = await SeoSettings.create({});
    res.json({ success: true, seoSettings: seo });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSeoSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let seo = await SeoSettings.findOne();
    if (!seo) {
      seo = await SeoSettings.create(req.body);
    } else {
      Object.assign(seo, req.body);
      await seo.save();
    }
    await logActivity(req, 'UPDATE_SEO_SETTINGS', 'seo', String(seo._id), 'Updated global SEO settings');
    res.json({ success: true, seoSettings: seo, message: 'SEO settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runSeoAudit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pages = await Page.find({ status: 'published' });
    const blogs = await Blog.find({ status: 'published' });
    const services = await Service.find({ status: 'published' });
    const redirects = await Redirect.find({ isActive: true });

    const issues: Array<{ type: 'error' | 'warning' | 'info'; title: string; page: string; details: string; recommendation: string }> = [];

    // Check Pages
    pages.forEach((p) => {
      if (!p.seo?.metaTitle) {
        issues.push({
          type: 'error',
          title: 'Missing Page Title',
          page: `/${p.slug}`,
          details: 'The page has no meta title defined.',
          recommendation: 'Add a descriptive SEO title between 50-60 characters.'
        });
      } else if (p.seo.metaTitle.length < 30 || p.seo.metaTitle.length > 65) {
        issues.push({
          type: 'warning',
          title: 'Suboptimal Title Length',
          page: `/${p.slug}`,
          details: `Current title length is ${p.seo.metaTitle.length} characters.`,
          recommendation: 'Aim for 50-60 characters for best Google display.'
        });
      }

      if (!p.seo?.metaDescription) {
        issues.push({
          type: 'error',
          title: 'Missing Meta Description',
          page: `/${p.slug}`,
          details: 'No meta description found for this page.',
          recommendation: 'Write an engaging meta description between 120-160 characters.'
        });
      } else if (p.seo.metaDescription.length < 70 || p.seo.metaDescription.length > 170) {
        issues.push({
          type: 'warning',
          title: 'Meta Description Length Warning',
          page: `/${p.slug}`,
          details: `Current description length is ${p.seo.metaDescription.length} characters.`,
          recommendation: 'Aim for 120-160 characters to avoid truncation.'
        });
      }

      if (!p.seo?.ogImage) {
        issues.push({
          type: 'warning',
          title: 'Missing Open Graph Image',
          page: `/${p.slug}`,
          details: 'No dedicated social sharing preview image configured.',
          recommendation: 'Specify an Open Graph image (1200x630px recommended).'
        });
      }
    });

    // Check Blogs
    blogs.forEach((b) => {
      if (!b.featuredImage) {
        issues.push({
          type: 'warning',
          title: 'Missing Blog Featured Image',
          page: `/blog/${b.slug}`,
          details: 'Article has no featured image.',
          recommendation: 'Add a high-resolution featured image for social media cards.'
        });
      }
    });

    // Check Services
    services.forEach((s) => {
      if (s.benefits.length === 0 || s.features.length === 0) {
        issues.push({
          type: 'info',
          title: 'Thin Service Detail Content',
          page: `/services/${s.slug}`,
          details: 'Service benefits or features lists are empty.',
          recommendation: 'Add rich benefits and deliverables to improve organic ranking.'
        });
      }
    });

    const score = Math.max(20, Math.min(100, Math.round(100 - issues.filter((i) => i.type === 'error').length * 10 - issues.filter((i) => i.type === 'warning').length * 3)));

    res.json({
      success: true,
      audit: {
        score,
        totalChecked: pages.length + blogs.length + services.length,
        errorsCount: issues.filter((i) => i.type === 'error').length,
        warningsCount: issues.filter((i) => i.type === 'warning').length,
        infoCount: issues.filter((i) => i.type === 'info').length,
        issues,
        redirectsCount: redirects.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRedirects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const redirects = await Redirect.find().sort({ createdAt: -1 });
    res.json({ success: true, redirects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRedirect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let { sourceUrl, destinationUrl, statusCode = 301, notes } = req.body;
    if (!sourceUrl.startsWith('/')) sourceUrl = `/${sourceUrl}`;
    if (!destinationUrl.startsWith('/') && !destinationUrl.startsWith('http')) destinationUrl = `/${destinationUrl}`;

    if (sourceUrl === destinationUrl) {
      res.status(400).json({ success: false, message: 'Source and destination cannot be identical (prevents redirect loop).' });
      return;
    }

    const redirect = await Redirect.create({
      sourceUrl,
      destinationUrl,
      statusCode,
      notes
    });

    await logActivity(req, 'CREATE_REDIRECT', 'redirect', String(redirect._id), `Redirect: ${sourceUrl} -> ${destinationUrl}`);
    res.status(201).json({ success: true, redirect, message: 'Redirect rule created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRedirect = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Redirect.findByIdAndDelete(req.params.id);
    await logActivity(req, 'DELETE_REDIRECT', 'redirect', req.params.id, 'Deleted redirect rule');
    res.json({ success: true, message: 'Redirect rule removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 14. MEDIA LIBRARY
// ==========================================
export const getMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { folder, search, page = 1, limit = 40 } = req.query;
    const filter: Record<string, any> = {};

    if (folder && folder !== 'all') filter.folder = folder;
    if (search) {
      filter.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } },
        { altText: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Media.countDocuments(filter);
    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      media,
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

export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: 'No media file provided' });
      return;
    }

    const media = await Media.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      altText: req.body.altText || file.originalname.split('.')[0],
      caption: req.body.caption || '',
      folder: req.body.folder || 'general',
      uploadedBy: req.user?._id
    });

    await logActivity(req, 'UPLOAD_MEDIA', 'media', String(media._id), `Uploaded file: ${file.originalname}`);
    res.status(201).json({ success: true, media, message: 'File uploaded successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const media = await Media.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!media) {
      res.status(404).json({ success: false, message: 'Media file not found' });
      return;
    }
    res.json({ success: true, media, message: 'Media metadata updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      res.status(404).json({ success: false, message: 'Media file not found' });
      return;
    }

    if (media.usageCount > 0) {
      res.status(400).json({
        success: false,
        message: `This file is currently in use in ${media.usageCount} location(s). Remove it from those pages before deleting.`
      });
      return;
    }

    await Media.findByIdAndDelete(req.params.id);
    await logActivity(req, 'DELETE_MEDIA', 'media', req.params.id, `Deleted file ${media.filename}`);
    res.json({ success: true, message: 'Media file deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 15. USERS & ROLES
// ==========================================
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().populate('role').select('-passwordHash');
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roles = await Role.find();
    res.json({ success: true, roles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, roleId } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'A user with this email already exists' });
      return;
    }

    const bcrypt = (await import('bcryptjs')).default;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: roleId
    });

    await logActivity(req, 'CREATE_USER', 'user', String(user._id), `Created user ${user.email}`);
    res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email }, message: 'User created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, roleId, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (roleId) user.role = roleId;
    if (isActive !== undefined) user.isActive = isActive;

    if (password) {
      const bcrypt = (await import('bcryptjs')).default;
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    await logActivity(req, 'UPDATE_USER', 'user', String(user._id), `Updated user ${user.email}`);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (String(req.user?._id) === req.params.id) {
      res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    await logActivity(req, 'DELETE_USER', 'user', req.params.id, `Deleted user ${user.email}`);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 16. AUDIT LOGS
// ==========================================
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resource, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};
    if (resource && resource !== 'all') filter.resource = resource;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      logs,
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
