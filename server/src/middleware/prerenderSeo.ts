import { Request, Response, NextFunction } from 'express';
import { Page } from '../models/Page.js';
import { Blog } from '../models/Blog.js';
import { Service } from '../models/Service.js';
import { SiteSettings } from '../models/SiteSettings.js';

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'slurp',
  'baiduspider',
  'ia_archiver',
  'twitterbot',
  'facebookexternalhit',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkshare',
  'whatsapp'
];

export const isCrawler = (userAgent: string = ''): boolean => {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot));
};

export const prerenderSeoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Only intercept GET requests that are NOT api endpoints or static files
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.includes('.')) {
    return next();
  }

  const userAgent = req.headers['user-agent'] || '';
  if (!isCrawler(userAgent)) {
    return next();
  }

  try {
    const rawPath = req.path.replace(/^\/|\/$/g, '');
    const settings = await SiteSettings.findOne();
    const siteName = settings?.siteName || 'HangingPanda';

    let metaTitle = `${siteName} | AI-Powered Custom Software Development`;
    let metaDesc = settings?.tagline || 'Enterprise-ready custom software development, mobile apps, and SaaS platforms.';
    let canonical = `https://hangingpanda.com/${rawPath}`;
    let ogImage = 'https://hangingpanda.com/og-image.jpg';
    let schemaDetails: any = null;

    if (!rawPath || rawPath === 'home') {
      // Home page
      const homePage = await Page.findOne({ slug: 'home', status: 'published' });
      if (homePage?.seo) {
        metaTitle = homePage.seo.metaTitle || metaTitle;
        metaDesc = homePage.seo.metaDescription || metaDesc;
        if (homePage.seo.ogImage) ogImage = homePage.seo.ogImage;
      }
      schemaDetails = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: 'https://hangingpanda.com',
        logo: settings?.logoUrl || 'https://hangingpanda.com/logo.svg',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: settings?.contactPhone || '+91-8887024887',
          contactType: 'customer service'
        }
      };
    } else if (rawPath.startsWith('services/')) {
      const slug = rawPath.replace('services/', '');
      const service = await Service.findOne({ slug, status: 'published' });
      if (service) {
        metaTitle = service.seo?.metaTitle || `${service.title} | ${siteName}`;
        metaDesc = service.seo?.metaDescription || service.shortDesc;
        if (service.seo?.ogImage) ogImage = service.seo.ogImage;
        schemaDetails = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.shortDesc,
          provider: {
            '@type': 'Organization',
            name: siteName,
            url: 'https://hangingpanda.com'
          }
        };
      }
    } else if (rawPath.startsWith('blog/')) {
      const slug = rawPath.replace('blog/', '');
      const blog = await Blog.findOne({ slug, status: 'published' });
      if (blog) {
        metaTitle = blog.seo?.metaTitle || `${blog.title} | ${siteName} Blog`;
        metaDesc = blog.seo?.metaDescription || blog.excerpt;
        if (blog.featuredImage) ogImage = blog.featuredImage;
        schemaDetails = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: blog.title,
          image: ogImage,
          datePublished: blog.publishedAt || blog.createdAt,
          author: {
            '@type': 'Person',
            name: blog.author?.name || 'HangingPanda Editorial Team'
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: 'https://hangingpanda.com/logo.svg'
            }
          }
        };
      }
    } else {
      // General dynamic page
      const page = await Page.findOne({ slug: rawPath, status: 'published' });
      if (page?.seo) {
        metaTitle = page.seo.metaTitle || `${page.title} | ${siteName}`;
        metaDesc = page.seo.metaDescription || metaDesc;
        if (page.seo.ogImage) ogImage = page.seo.ogImage;
      }
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(metaTitle)}">
  <meta property="og:description" content="${escapeHtml(metaDesc)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(ogImage)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(metaTitle)}">
  <meta name="twitter:description" content="${escapeHtml(metaDesc)}">
  <meta name="twitter:image" content="${escapeHtml(ogImage)}">
  ${
    schemaDetails
      ? `<script type="application/ld+json">${JSON.stringify(schemaDetails)}</script>`
      : ''
  }
</head>
<body>
  <h1>${escapeHtml(metaTitle)}</h1>
  <p>${escapeHtml(metaDesc)}</p>
  <p><a href="${escapeHtml(canonical)}">Visit ${escapeHtml(siteName)}</a></p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return next();
  }
};

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
