import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';
import {
  getDashboardStats,
  getSettings,
  updateSettings,
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  publishPage,
  unpublishPage,
  getPageRevisions,
  restoreRevision,
  generatePreviewToken,
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getNavigationMenus,
  updateNavigationMenu,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getCrmDashboard,
  getLeads,
  getLead,
  updateLeadStatus,
  updateLead,
  addLeadNote,
  exportLeadsCsv,
  deleteLead,
  getSeoSettings,
  updateSeoSettings,
  runSeoAudit,
  getRedirects,
  createRedirect,
  deleteRedirect,
  getMedia,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getUsers,
  getRoles,
  createUser,
  updateUser,
  deleteUser,
  getAuditLogs
} from '../controllers/adminController.js';

// Setup Multer Storage
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|pdf|mp4/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images, videos, and PDFs are supported.'));
  }
});

const router = Router();

// Protect all admin routes with JWT authentication
router.use(authenticate);

// 1. Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// 2. Site Settings
router.get('/settings', getSettings);
router.put('/settings', requireRole(['Super Admin', 'Admin']), updateSettings);

// 3. Pages & Visual Builder
router.get('/pages', getPages);
router.get('/pages/:id', getPage);
router.post('/pages', createPage);
router.put('/pages/:id', updatePage);
router.delete('/pages/:id', requireRole(['Super Admin', 'Admin']), deletePage);
router.post('/pages/:id/publish', publishPage);
router.post('/pages/:id/unpublish', unpublishPage);
router.get('/pages/:id/revisions', getPageRevisions);
router.post('/pages/:id/revisions/:revId/restore', restoreRevision);
router.post('/pages/preview-token', generatePreviewToken);

// 4. Services CMS
router.get('/services', getServices);
router.get('/services/:id', getService);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', requireRole(['Super Admin', 'Admin']), deleteService);

// 5. Blogs CMS
router.get('/blogs', getBlogs);
router.get('/blogs/:id', getBlog);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', requireRole(['Super Admin', 'Admin']), deleteBlog);

// 6. Portfolio CMS
router.get('/portfolio', getPortfolio);
router.post('/portfolio', createPortfolio);
router.put('/portfolio/:id', updatePortfolio);
router.delete('/portfolio/:id', requireRole(['Super Admin', 'Admin']), deletePortfolio);

// 7. Testimonials CMS
router.get('/testimonials', getTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', requireRole(['Super Admin', 'Admin']), deleteTestimonial);

// 8. Team CMS
router.get('/team', getTeam);
router.post('/team', createTeam);
router.put('/team/:id', updateTeam);
router.delete('/team/:id', requireRole(['Super Admin', 'Admin']), deleteTeam);

// 9. FAQs CMS
router.get('/faqs', getFAQs);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', requireRole(['Super Admin', 'Admin']), deleteFAQ);

// 10. Navigation Menus
router.get('/navigation', getNavigationMenus);
router.put('/navigation', requireRole(['Super Admin', 'Admin']), updateNavigationMenu);

// 11. Jobs CMS
router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', requireRole(['Super Admin', 'Admin']), deleteJob);

// 12. Mini CRM & Leads
router.get('/crm/dashboard', getCrmDashboard);
router.get('/crm/leads', getLeads);
router.get('/crm/leads/:id', getLead);
router.put('/crm/leads/:id/status', updateLeadStatus);
router.put('/crm/leads/:id', updateLead);
router.post('/crm/leads/:id/notes', addLeadNote);
router.get('/crm/export', exportLeadsCsv);
router.delete('/crm/leads/:id', requireRole(['Super Admin', 'Admin']), deleteLead);

// 13. SEO Suite
router.get('/seo/settings', getSeoSettings);
router.put('/seo/settings', requireRole(['Super Admin', 'Admin', 'SEO Manager']), updateSeoSettings);
router.get('/seo/audit', runSeoAudit);
router.get('/seo/redirects', getRedirects);
router.post('/seo/redirects', createRedirect);
router.delete('/seo/redirects/:id', deleteRedirect);

// 14. Media Library
router.get('/media', getMedia);
router.post('/media/upload', upload.single('file'), uploadMedia);
router.put('/media/:id', updateMedia);
router.delete('/media/:id', deleteMedia);

// 15. User & Role Management
router.get('/users', requireRole(['Super Admin']), getUsers);
router.get('/roles', requireRole(['Super Admin']), getRoles);
router.post('/users', requireRole(['Super Admin']), createUser);
router.put('/users/:id', requireRole(['Super Admin']), updateUser);
router.delete('/users/:id', requireRole(['Super Admin']), deleteUser);

// 16. Audit Logs
router.get('/audit-logs', requireRole(['Super Admin', 'Admin']), getAuditLogs);

export default router;
