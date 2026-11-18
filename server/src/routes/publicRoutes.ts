import { Router } from 'express';
import {
  getSiteSettings,
  getNavigation,
  getHomepage,
  getPageBySlug,
  getServices,
  getServiceBySlug,
  getBlogs,
  getBlogBySlug,
  getPortfolio,
  getPortfolioBySlug,
  getTestimonials,
  getTeam,
  getFAQs,
  getJobs,
  createInquiry,
  getSitemapXml,
  getRobotsTxt,
  validatePreviewToken
} from '../controllers/publicController.js';

const router = Router();

router.get('/settings', getSiteSettings);
router.get('/navigation', getNavigation);
router.get('/homepage', getHomepage);
router.get('/pages/:slug', getPageBySlug);
router.get('/services', getServices);
router.get('/services/:slug', getServiceBySlug);
router.get('/blogs', getBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.get('/portfolio', getPortfolio);
router.get('/portfolio/:slug', getPortfolioBySlug);
router.get('/testimonials', getTestimonials);
router.get('/team', getTeam);
router.get('/faqs', getFAQs);
router.get('/jobs', getJobs);
router.post('/inquiries', createInquiry);
router.get('/sitemap.xml', getSitemapXml);
router.get('/robots.txt', getRobotsTxt);
router.get('/preview/:token', validatePreviewToken);

export default router;
