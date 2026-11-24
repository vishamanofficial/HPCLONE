import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { verifyAuth, generateToken, logActivity } from '@/lib/auth';

// Models
import { User } from '@/models/User';
import { Role } from '@/models/Role';
import { SiteSettings } from '@/models/SiteSettings';
import { Page } from '@/models/Page';
import { PageRevision } from '@/models/PageRevision';
import { Service } from '@/models/Service';
import { Blog } from '@/models/Blog';
import { Portfolio } from '@/models/Portfolio';
import { Testimonial } from '@/models/Testimonial';
import { TeamMember } from '@/models/TeamMember';
import { FAQ } from '@/models/FAQ';
import { Job } from '@/models/Job';
import { NavigationMenu } from '@/models/NavigationMenu';
import { Lead } from '@/models/Lead';
import { SeoSettings } from '@/models/SeoSettings';
import { Redirect } from '@/models/Redirect';
import { Media } from '@/models/Media';
import { CalculatorSettings } from '@/models/CalculatorSettings';
import { calculatorQuestions } from '@/data/calculatorQuestions';
import { siteConfig } from '@/config/site';
import { AuditLog } from '@/models/AuditLog';

interface RouteContext {
  params: Promise<{ route: string[] }>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';

// ==========================================
// GET HANDLER
// ==========================================
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { route } = await context.params;
    const path = route.join('/');
    const searchParams = req.nextUrl.searchParams;

    // ---------------- AUTH ----------------
    if (path === 'auth/me') {
      const user = await verifyAuth(req);
      if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      let fullUser = null;
      try {
        fullUser = await User.findById(user._id).populate('role').select('-passwordHash');
      } catch {}
      return NextResponse.json({
        success: true,
        user: {
          id: fullUser?._id || user._id,
          name: fullUser?.name || user.name || 'Vishal Aman (Super Admin)',
          email: fullUser?.email || user.email,
          role: (fullUser?.role as any)?.name || (user as any)?.role?.name || (user as any)?.role || 'Super Admin',
          permissions: (fullUser?.role as any)?.permissions || (user as any)?.roleDetails?.permissions || (user as any)?.permissions || ['*'],
          avatar: fullUser?.avatar || user.avatar
        }
      });
    }

    // ---------------- PUBLIC ----------------
    if (path === 'public/calculator') {
      let calc = await CalculatorSettings.findOne();
      if (!calc) {
        calc = await CalculatorSettings.create({
          currency: '$',
          baseWeeks: 6,
          questions: calculatorQuestions,
        });
      }
      return NextResponse.json({ success: true, settings: calc });
    }

    if (path === 'public/settings') {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create({});
      return NextResponse.json({ success: true, settings });
    }

    if (path === 'public/navigation') {
      const menus = await NavigationMenu.find({ isActive: true });
      const formatted: Record<string, any> = {};
      menus.forEach((m) => { formatted[m.location] = m.items; });
      return NextResponse.json({ success: true, menus: formatted });
    }

    if (path === 'public/homepage') {
      const page = await Page.findOne({ slug: 'home', status: 'published' });
      const [services, portfolio, testimonials, faqs] = await Promise.all([
        Service.find({ status: 'published' }).sort({ displayOrder: 1 }),
        Portfolio.find({ status: 'published' }).sort({ displayOrder: 1 }),
        Testimonial.find({ status: 'published', isFeatured: true }).sort({ displayOrder: 1 }),
        FAQ.find({ isActive: true, category: 'general' }).sort({ displayOrder: 1 })
      ]);
      return NextResponse.json({
        success: true,
        page,
        sections: page?.sections || [],
        dynamicData: { services, portfolio, testimonials, faqs }
      });
    }

    if (path.startsWith('public/pages/')) {
      const slug = route[2];
      const page = await Page.findOne({ slug, status: 'published' });
      if (!page) {
        const redirect = await Redirect.findOne({ sourceUrl: `/${slug}`, isActive: true });
        if (redirect) {
          redirect.hitCount += 1;
          redirect.lastTriggeredAt = new Date();
          await redirect.save();
          return NextResponse.json({ success: false, redirect: redirect.destinationUrl }, { status: redirect.statusCode });
        }
        return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, page });
    }

    if (path === 'public/services') {
      const services = await Service.find({ status: 'published' }).sort({ displayOrder: 1 });
      return NextResponse.json({ success: true, services });
    }

    if (path.startsWith('public/services/')) {
      const slug = route[2];
      const service = await Service.findOne({ slug, status: 'published' });
      return NextResponse.json({ success: !!service, service });
    }

    if (path === 'public/blogs') {
      const category = searchParams.get('category');
      const tag = searchParams.get('tag');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = 10;

      const query: any = { status: 'published' };
      if (category && category !== 'All') query.category = category;
      if (tag) query.tags = tag;
      if (search) query.$text = { $search: search };

      const total = await Blog.countDocuments(query);
      const blogs = await Blog.find(query).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit);
      return NextResponse.json({
        success: true,
        blogs,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    }

    if (path.startsWith('public/blogs/')) {
      const slug = route[2];
      const blog = await Blog.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] });
      if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
      blog.viewsCount = (blog.viewsCount || 0) + 1;
      await blog.save();
      const related = await Blog.find({ category: blog.category, _id: { $ne: blog._id }, status: 'published' }).limit(3);
      return NextResponse.json({ success: true, blog, related });
    }

    if (path === 'public/portfolio') {
      const portfolio = await Portfolio.find({ status: 'published' }).sort({ displayOrder: 1 });
      return NextResponse.json({ success: true, portfolio });
    }

    if (path.startsWith('public/portfolio/')) {
      const slug = route[2];
      const portfolioItem = await Portfolio.findOne({ slug, status: 'published' });
      return NextResponse.json({ success: !!portfolioItem, portfolioItem });
    }

    if (path === 'public/testimonials') {
      const testimonials = await Testimonial.find({ status: 'published' }).sort({ displayOrder: 1 });
      return NextResponse.json({ success: true, testimonials });
    }

    if (path === 'public/team') {
      const team = await TeamMember.find({ isActive: true }).sort({ displayOrder: 1 });
      return NextResponse.json({ success: true, team });
    }

    if (path === 'public/faqs') {
      const category = searchParams.get('category');
      const query: any = { isActive: true };
      if (category && category !== 'all') query.category = category;
      const faqs = await FAQ.find(query).sort({ displayOrder: 1 });
      return NextResponse.json({ success: true, faqs });
    }

    if (path === 'public/jobs') {
      const jobs = await Job.find({ status: 'published' }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, jobs });
    }

    if (path.startsWith('public/preview/')) {
      const token = route[2];
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.type === 'page') {
        const page = await Page.findById(decoded.id);
        return NextResponse.json({ success: true, previewType: 'page', data: page });
      }
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 400 });
    }

    // ---------------- ADMIN (Requires Auth) ----------------
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (path === 'admin/dashboard/stats') {
      const [
        publishedPages,
        draftPages,
        blogs,
        services,
        portfolio,
        testimonials,
        totalLeads,
        newLeads,
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
        Page.countDocuments({ $or: [{ 'seo.metaTitle': '' }, { 'seo.metaTitle': { $exists: false } }] })
      ]);
      return NextResponse.json({
        success: true,
        stats: {
          publishedPages,
          draftPages,
          blogs,
          services,
          portfolio,
          testimonials,
          totalLeads,
          newLeads,
          seoAlertsCount: pagesWithoutSeo,
          recentLeads,
          recentAudits
        }
      });
    }

    if (path === 'admin/settings') {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create({});
      return NextResponse.json({ success: true, settings });
    }

    if (path === 'admin/calculator') {
      let calc = await CalculatorSettings.findOne();
      if (!calc) {
        calc = await CalculatorSettings.create({
          currency: '$',
          baseWeeks: 6,
          questions: calculatorQuestions,
        });
      }
      return NextResponse.json({ success: true, settings: calc });
    }

    if (path === 'admin/pages') {
      const pages = await Page.find().sort({ updatedAt: -1 });
      return NextResponse.json({ success: true, pages });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2] && route[3] === 'revisions') {
      const revisions = await PageRevision.find({ pageId: route[2] }).sort({ revisionNumber: -1 });
      return NextResponse.json({ success: true, revisions });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2]) {
      const page = await Page.findById(route[2]);
      return NextResponse.json({ success: !!page, page });
    }

    if (path === 'admin/services') {
      const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
      return NextResponse.json({ success: true, services });
    }

    if (route[0] === 'admin' && route[1] === 'services' && route[2]) {
      const service = await Service.findById(route[2]);
      return NextResponse.json({ success: !!service, service });
    }

    if (path === 'admin/blogs') {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, blogs });
    }

    if (route[0] === 'admin' && route[1] === 'blogs' && route[2]) {
      const blog = await Blog.findById(route[2]);
      return NextResponse.json({ success: !!blog, blog });
    }

    if (path === 'admin/portfolio') {
      const portfolio = await Portfolio.find().sort({ displayOrder: 1, createdAt: -1 });
      return NextResponse.json({ success: true, portfolio });
    }

    if (path === 'admin/testimonials') {
      const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
      return NextResponse.json({ success: true, testimonials });
    }

    if (path === 'admin/team') {
      const team = await TeamMember.find().sort({ displayOrder: 1, createdAt: -1 });
      return NextResponse.json({ success: true, team });
    }

    if (path === 'admin/faqs') {
      const faqs = await FAQ.find().sort({ displayOrder: 1, createdAt: -1 });
      return NextResponse.json({ success: true, faqs });
    }

    if (path === 'admin/jobs') {
      const jobs = await Job.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, jobs });
    }

    if (path === 'admin/navigation') {
      const menus = await NavigationMenu.find();
      return NextResponse.json({ success: true, menus });
    }

    if (path === 'admin/crm/dashboard') {
      const [total, byStatus, byPriority] = await Promise.all([
        Lead.countDocuments(),
        Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Lead.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }])
      ]);
      return NextResponse.json({ success: true, crmMetrics: { total, byStatus, byPriority } });
    }

    if (path === 'admin/crm/leads') {
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '50', 10);

      const query: any = {};
      if (status && status !== 'all') query.status = status;
      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Lead.countDocuments(query);
      const leads = await Lead.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return NextResponse.json({ success: true, leads, pagination: { total, page, limit } });
    }

    if (route[0] === 'admin' && route[1] === 'crm' && route[2] === 'leads' && route[3]) {
      const lead = await Lead.findById(route[3]);
      return NextResponse.json({ success: !!lead, lead });
    }

    if (path === 'admin/crm/export') {
      const leads = await Lead.find().sort({ createdAt: -1 });
      const csv = ['Full Name,Email,Phone,Company,Status,Created At']
        .concat(leads.map((l) => `"${l.fullName}","${l.email}","${l.phone || ''}","${l.companyName || ''}","${l.status}","${l.createdAt.toISOString()}"`))
        .join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leads-export.csv"'
        }
      });
    }

    if (path === 'admin/seo/settings') {
      let seo = await SeoSettings.findOne();
      if (!seo) seo = await SeoSettings.create({});
      return NextResponse.json({ success: true, seoSettings: seo });
    }

    if (path === 'admin/seo/audit') {
      const [pages, blogs, services] = await Promise.all([
        Page.find().select('title slug seo'),
        Blog.find().select('title slug seo'),
        Service.find().select('title slug seo')
      ]);
      const alerts: any[] = [];
      pages.forEach((p) => {
        if (!p.seo?.metaTitle) alerts.push({ type: 'warning', page: p.title, url: `/${p.slug}`, issue: 'Missing Meta Title' });
        if (!p.seo?.metaDescription) alerts.push({ type: 'warning', page: p.title, url: `/${p.slug}`, issue: 'Missing Meta Description' });
      });
      return NextResponse.json({
        success: true,
        audit: { totalPages: pages.length, totalIssues: alerts.length, alerts, score: Math.max(70, 100 - alerts.length * 4) }
      });
    }

    if (path === 'admin/seo/redirects') {
      const redirects = await Redirect.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, redirects });
    }

    if (path === 'admin/media') {
      const folder = searchParams.get('folder');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = 24;

      const query: any = {};
      if (folder && folder !== 'all') query.folder = folder;
      if (search) query.originalName = { $regex: search, $options: 'i' };

      const total = await Media.countDocuments(query);
      const media = await Media.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return NextResponse.json({ success: true, media, pagination: { total, page, limit } });
    }

    if (path === 'admin/users') {
      const users = await User.find().populate('role').select('-passwordHash').sort({ createdAt: -1 });
      return NextResponse.json({ success: true, users });
    }

    if (path === 'admin/roles') {
      const roles = await Role.find();
      return NextResponse.json({ success: true, roles });
    }

    if (path === 'admin/audit-logs') {
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = 25;
      const total = await AuditLog.countDocuments();
      const logs = await AuditLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return NextResponse.json({ success: true, logs, pagination: { total, page, limit } });
    }

    return NextResponse.json({ success: false, message: `Route GET /${path} not found` }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ==========================================
// POST HANDLER
// ==========================================
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { route } = await context.params;
    const path = route.join('/');
    const body = await req.json().catch(() => ({}));

    // ---------------- AUTH: LOGIN ----------------
    if (path === 'admin/calculator/reset') {
      const user = await verifyAuth(req);
      if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      let calc = await CalculatorSettings.findOne();
      if (!calc) {
        calc = await CalculatorSettings.create({
          currency: '$',
          baseWeeks: 6,
          questions: calculatorQuestions,
        });
      } else {
        calc.currency = '$';
        calc.baseWeeks = 6;
        calc.questions = calculatorQuestions;
        await calc.save();
      }
      await logActivity(user, 'UPDATE', 'calculator', calc._id, 'Reset calculator pricing to factory defaults', req);
      return NextResponse.json({ success: true, settings: calc, message: 'Calculator pricing reset to default rules' });
    }

    if (path === 'auth/login') {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
      }

      const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || siteConfig.emails.admin).toLowerCase();
      const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || `Admin@${siteConfig.name}2026!`;

      // 1. Fast-path authentication for master Super Admin
      if (email.toLowerCase() === defaultEmail && password === defaultPassword) {
        const superAdminData = {
          id: '673e1c9e89b2c3d4e5f60001',
          name: 'Vishal Aman (Super Admin)',
          email: defaultEmail,
          role: 'Super Admin',
          permissions: ['*'],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        };

        const token = jwt.sign(
          {
            id: superAdminData.id,
            email: defaultEmail,
            role: 'Super Admin',
            permissions: ['*']
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Ensure user document exists in database in background
        User.findOne({ email: defaultEmail }).then(async (existing) => {
          if (!existing) {
            try {
              const hash = await bcrypt.hash(defaultPassword, 10);
              let role = await Role.findOne({ name: 'Super Admin' });
              if (!role) {
                role = await Role.create({ name: 'Super Admin', permissions: ['*'], isSystem: true });
              }
              await User.create({
                _id: '673e1c9e89b2c3d4e5f60001',
                name: superAdminData.name,
                email: defaultEmail,
                passwordHash: hash,
                role: role._id,
                isActive: true,
                avatar: superAdminData.avatar
              });
            } catch {}
          }
        }).catch(() => {});

        return NextResponse.json({
          success: true,
          token,
          user: superAdminData
        });
      }

      // 2. Database lookup for other users
      const user = await User.findOne({ email: email.toLowerCase() }).populate('role');
      if (!user) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      if (!user.isActive) return NextResponse.json({ success: false, message: 'Account is deactivated' }, { status: 403 });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user);
      await logActivity(user, 'LOGIN', 'auth', String(user._id), `User ${user.email} logged in`, req);

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: (user.role as any)?.name,
          permissions: (user.role as any)?.permissions || [],
          avatar: user.avatar
        }
      });
    }

    // ---------------- PUBLIC: SUBMIT INQUIRY ----------------
    if (path === 'public/inquiries') {
      const lead = await Lead.create({
        fullName: body.fullName || body.name || 'Anonymous',
        email: body.email,
        phone: body.phone,
        company: body.company,
        interestedService: body.interestedService || body.service,
        budget: body.budget,
        message: body.message,
        source: body.source || 'Website Form',
        status: 'new'
      });
      await logActivity(null, 'INQUIRY_CREATED', 'lead', lead._id, `New inquiry from ${lead.email}`, req);
      return NextResponse.json({ success: true, message: 'Inquiry received successfully', leadId: lead._id });
    }

    // ---------------- ADMIN (Requires Auth) ----------------
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (path === 'admin/pages') {
      const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const page = await Page.create({ ...body, slug, author: user._id });
      await PageRevision.create({
        pageId: page._id,
        revisionNumber: 1,
        title: page.title,
        sections: page.sections,
        seo: page.seo,
        author: user._id,
        comment: 'Initial page creation'
      });
      await logActivity(user, 'CREATE', 'page', page._id, `Created page ${page.title}`, req);
      return NextResponse.json({ success: true, page, message: 'Page created successfully' });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2] && route[3] === 'publish') {
      const page = await Page.findByIdAndUpdate(route[2], { status: 'published', publishedAt: new Date() }, { new: true });
      await logActivity(user, 'PUBLISH', 'page', route[2], `Published page ${page?.title}`, req);
      return NextResponse.json({ success: true, page, message: 'Page published live' });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2] && route[3] === 'unpublish') {
      const page = await Page.findByIdAndUpdate(route[2], { status: 'draft' }, { new: true });
      await logActivity(user, 'UNPUBLISH', 'page', route[2], `Moved page ${page?.title} to draft`, req);
      return NextResponse.json({ success: true, page, message: 'Page moved to draft' });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2] && route[3] === 'revisions' && route[4] && route[5] === 'restore') {
      const revision = await PageRevision.findById(route[4]);
      if (!revision) return NextResponse.json({ success: false, message: 'Revision not found' }, { status: 404 });
      const page = await Page.findByIdAndUpdate(route[2], {
        title: revision.title,
        sections: revision.sectionsData,
        seo: revision.seoData,
        $inc: { currentRevision: 1 }
      }, { new: true });
      await logActivity(user, 'RESTORE_REVISION', 'page', route[2], `Restored revision #${revision.revisionNumber}`, req);
      return NextResponse.json({ success: true, page, message: 'Revision restored' });
    }

    if (path === 'admin/pages/preview-token') {
      const token = jwt.sign({ type: body.type, id: body.id }, JWT_SECRET, { expiresIn: '1h' });
      return NextResponse.json({ success: true, previewToken: token, previewUrl: `/preview/${token}` });
    }

    if (path === 'admin/services') {
      const service = await Service.create(body);
      await logActivity(user, 'CREATE', 'service', service._id, `Created service ${service.title}`, req);
      return NextResponse.json({ success: true, service, message: 'Service created successfully' });
    }

    if (path === 'admin/blogs') {
      const blog = await Blog.create({ ...body, author: user._id });
      await logActivity(user, 'CREATE', 'blog', blog._id, `Created blog ${blog.title}`, req);
      return NextResponse.json({ success: true, blog, message: 'Blog created successfully' });
    }

    if (path === 'admin/portfolio') {
      const portfolio = await Portfolio.create(body);
      await logActivity(user, 'CREATE', 'portfolio', portfolio._id, `Created case study ${portfolio.title}`, req);
      return NextResponse.json({ success: true, portfolio, message: 'Case study created' });
    }

    if (path === 'admin/testimonials') {
      const testimonial = await Testimonial.create(body);
      await logActivity(user, 'CREATE', 'testimonial', testimonial._id, `Created testimonial from ${testimonial.clientName}`, req);
      return NextResponse.json({ success: true, testimonial, message: 'Testimonial added' });
    }

    if (path === 'admin/team') {
      const member = await TeamMember.create(body);
      await logActivity(user, 'CREATE', 'team', member._id, `Added team member ${member.name}`, req);
      return NextResponse.json({ success: true, member, message: 'Team member added' });
    }

    if (path === 'admin/faqs') {
      const faq = await FAQ.create(body);
      await logActivity(user, 'CREATE', 'faq', faq._id, `Added FAQ ${faq.question}`, req);
      return NextResponse.json({ success: true, faq, message: 'FAQ added' });
    }

    if (path === 'admin/jobs') {
      const job = await Job.create(body);
      await logActivity(user, 'CREATE', 'job', job._id, `Added job ${job.title}`, req);
      return NextResponse.json({ success: true, job, message: 'Job opening posted' });
    }

    if (route[0] === 'admin' && route[1] === 'crm' && route[2] === 'leads' && route[3] && route[4] === 'notes') {
      const lead = await Lead.findById(route[3]);
      if (!lead) return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
      lead.notes.push({ id: new mongoose.Types.ObjectId().toString(), text: body.text, addedBy: user.name, createdAt: new Date() });
      await lead.save();
      return NextResponse.json({ success: true, lead, message: 'Note added' });
    }

    if (path === 'admin/seo/redirects') {
      const redirect = await Redirect.create(body);
      return NextResponse.json({ success: true, redirect, message: 'Redirect created' });
    }

    if (path === 'admin/users') {
      const passwordHash = await bcrypt.hash(body.password || 'Admin@123', 10);
      const newUser = await User.create({
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash,
        role: body.role,
        isActive: body.isActive !== false
      });
      await logActivity(user, 'CREATE', 'user', newUser._id, `Created user ${newUser.email}`, req);
      return NextResponse.json({ success: true, user: newUser, message: 'User created' });
    }

    return NextResponse.json({ success: false, message: `Route POST /${path} not found` }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ==========================================
// PUT HANDLER
// ==========================================
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { route } = await context.params;
    const path = route.join('/');
    const body = await req.json().catch(() => ({}));

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    if (path === 'auth/profile') {
      const updateData: any = { name: body.name, avatar: body.avatar };
      if (body.newPassword) {
        if (!body.currentPassword || !(await user.comparePassword(body.currentPassword))) {
          return NextResponse.json({ success: false, message: 'Current password incorrect' }, { status: 400 });
        }
        updateData.passwordHash = await bcrypt.hash(body.newPassword, 10);
      }
      const updated = await User.findByIdAndUpdate(user._id, updateData, { new: true }).select('-passwordHash');
      return NextResponse.json({ success: true, user: updated, message: 'Profile updated' });
    }

    if (path === 'admin/settings') {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create(body);
      else { Object.assign(settings, body); await settings.save(); }
      await logActivity(user, 'UPDATE', 'settings', settings._id, 'Updated global settings', req);
      return NextResponse.json({ success: true, settings, message: 'Settings saved' });
    }

    if (path === 'admin/calculator') {
      let calc = await CalculatorSettings.findOne();
      if (!calc) {
        calc = await CalculatorSettings.create(body);
      } else {
        if (body.currency !== undefined) calc.currency = body.currency;
        if (body.baseWeeks !== undefined) calc.baseWeeks = body.baseWeeks;
        if (body.questions !== undefined) calc.questions = body.questions;
        await calc.save();
      }
      await logActivity(user, 'UPDATE', 'calculator', calc._id, 'Updated cost calculator pricing rules', req);
      return NextResponse.json({ success: true, settings: calc, message: 'Calculator pricing rules saved successfully' });
    }

    if (route[0] === 'admin' && route[1] === 'pages' && route[2]) {
      const page = await Page.findById(route[2]);
      if (!page) return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
      const nextRev = (page.currentRevision || 1) + 1;
      await PageRevision.create({
        pageId: page._id,
        revisionNumber: nextRev,
        title: body.title || page.title,
        sections: body.sections || page.sections,
        seo: body.seo || page.seo,
        author: user._id,
        comment: body.revisionComment || 'Manual update via visual builder'
      });
      Object.assign(page, body, { currentRevision: nextRev });
      await page.save();
      await logActivity(user, 'UPDATE', 'page', page._id, `Saved revision #${nextRev} for ${page.title}`, req);
      return NextResponse.json({ success: true, page, message: 'Page updated successfully' });
    }

    if (route[0] === 'admin' && route[1] === 'services' && route[2]) {
      const service = await Service.findByIdAndUpdate(route[2], body, { new: true });
      await logActivity(user, 'UPDATE', 'service', route[2], `Updated service ${service?.title}`, req);
      return NextResponse.json({ success: true, service, message: 'Service updated' });
    }

    if (route[0] === 'admin' && route[1] === 'blogs' && route[2]) {
      const blog = await Blog.findByIdAndUpdate(route[2], body, { new: true });
      await logActivity(user, 'UPDATE', 'blog', route[2], `Updated blog ${blog?.title}`, req);
      return NextResponse.json({ success: true, blog, message: 'Blog updated' });
    }

    if (route[0] === 'admin' && route[1] === 'portfolio' && route[2]) {
      const portfolio = await Portfolio.findByIdAndUpdate(route[2], body, { new: true });
      return NextResponse.json({ success: true, portfolio, message: 'Case study updated' });
    }

    if (route[0] === 'admin' && route[1] === 'testimonials' && route[2]) {
      const testimonial = await Testimonial.findByIdAndUpdate(route[2], body, { new: true });
      return NextResponse.json({ success: true, testimonial, message: 'Testimonial updated' });
    }

    if (route[0] === 'admin' && route[1] === 'team' && route[2]) {
      const member = await TeamMember.findByIdAndUpdate(route[2], body, { new: true });
      return NextResponse.json({ success: true, member, message: 'Team member updated' });
    }

    if (route[0] === 'admin' && route[1] === 'faqs' && route[2]) {
      const faq = await FAQ.findByIdAndUpdate(route[2], body, { new: true });
      return NextResponse.json({ success: true, faq, message: 'FAQ updated' });
    }

    if (path === 'admin/navigation') {
      const menu = await NavigationMenu.findOneAndUpdate({ location: body.location }, body, { upsert: true, new: true });
      return NextResponse.json({ success: true, menu, message: 'Navigation updated' });
    }

    if (route[0] === 'admin' && route[1] === 'crm' && route[2] === 'leads' && route[3] && route[4] === 'status') {
      const lead = await Lead.findByIdAndUpdate(route[3], { status: body.status }, { new: true });
      return NextResponse.json({ success: true, lead, message: 'Lead status updated' });
    }

    if (route[0] === 'admin' && route[1] === 'crm' && route[2] === 'leads' && route[3]) {
      const lead = await Lead.findByIdAndUpdate(route[3], body, { new: true });
      return NextResponse.json({ success: true, lead, message: 'Lead details updated' });
    }

    if (path === 'admin/seo/settings') {
      const seo = await SeoSettings.findOneAndUpdate({}, body, { upsert: true, new: true });
      return NextResponse.json({ success: true, seoSettings: seo, message: 'SEO settings updated' });
    }

    if (route[0] === 'admin' && route[1] === 'media' && route[2]) {
      const media = await Media.findByIdAndUpdate(route[2], body, { new: true });
      return NextResponse.json({ success: true, media, message: 'Media metadata updated' });
    }

    if (route[0] === 'admin' && route[1] === 'users' && route[2]) {
      const updateData: any = { name: body.name, role: body.role, isActive: body.isActive };
      if (body.password) updateData.passwordHash = await bcrypt.hash(body.password, 10);
      const updatedUser = await User.findByIdAndUpdate(route[2], updateData, { new: true }).select('-passwordHash');
      return NextResponse.json({ success: true, user: updatedUser, message: 'User updated' });
    }

    return NextResponse.json({ success: false, message: `Route PUT /${path} not found` }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ==========================================
// DELETE HANDLER
// ==========================================
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { route } = await context.params;
    const path = route.join('/');

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    if (route[0] === 'admin' && route[1] === 'pages' && route[2]) {
      const page = await Page.findById(route[2]);
      if (page?.slug === 'home') return NextResponse.json({ success: false, message: 'Cannot delete home page' }, { status: 400 });
      await Promise.all([Page.findByIdAndDelete(route[2]), PageRevision.deleteMany({ pageId: route[2] })]);
      await logActivity(user, 'DELETE', 'page', route[2], `Deleted page ${page?.title}`, req);
      return NextResponse.json({ success: true, message: 'Page deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'services' && route[2]) {
      await Service.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Service deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'blogs' && route[2]) {
      await Blog.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Blog deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'portfolio' && route[2]) {
      await Portfolio.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Case study deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'testimonials' && route[2]) {
      await Testimonial.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Testimonial deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'team' && route[2]) {
      await TeamMember.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Team member deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'faqs' && route[2]) {
      await FAQ.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'FAQ deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'crm' && route[2] === 'leads' && route[3]) {
      await Lead.findByIdAndDelete(route[3]);
      return NextResponse.json({ success: true, message: 'Lead deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'seo' && route[2] === 'redirects' && route[3]) {
      await Redirect.findByIdAndDelete(route[3]);
      return NextResponse.json({ success: true, message: 'Redirect deleted' });
    }

    if (route[0] === 'admin' && route[1] === 'media' && route[2]) {
      await Media.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'Media removed' });
    }

    if (route[0] === 'admin' && route[1] === 'users' && route[2]) {
      await User.findByIdAndDelete(route[2]);
      return NextResponse.json({ success: true, message: 'User deleted' });
    }

    return NextResponse.json({ success: false, message: `Route DELETE /${path} not found` }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
