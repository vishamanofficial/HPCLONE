import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '@/lib/db';

import { Role } from '@/models/Role';
import { User } from '@/models/User';
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
import { SeoSettings } from '@/models/SeoSettings';
import { Lead } from '@/models/Lead';
import { siteConfig } from '@/config/site';


export const seedData = async () => {
  await connectDB();
  console.log('[Seed] Starting database migration & initial content population...');

  // 1. Roles
  console.log('[Seed] Seeding Roles...');
  await Role.deleteMany({});
  const superAdminRole = await Role.create({
    name: 'Super Admin',
    description: 'Full administrative access across all system modules and settings',
    permissions: ['*'],
    isSystem: true
  });

  const adminRole = await Role.create({
    name: 'Admin',
    description: 'Manage content, pages, services, blogs, portfolio, and leads',
    permissions: [
      'pages:read',
      'pages:write',
      'services:manage',
      'blogs:manage',
      'portfolio:manage',
      'crm:read',
      'crm:write',
      'media:manage',
      'seo:read'
    ],
    isSystem: true
  });

  await Role.create({
    name: 'Editor',
    description: 'Create and edit articles, services, and draft pages',
    permissions: ['pages:read', 'pages:write', 'blogs:manage', 'services:manage', 'media:manage'],
    isSystem: true
  });

  await Role.create({
    name: 'SEO Manager',
    description: 'Manage SEO metadata, sitemaps, redirects, and run SEO audits',
    permissions: ['seo:manage', 'pages:read', 'pages:write', 'redirects:manage'],
    isSystem: true
  });

  // 2. Default Super Admin User
  console.log('[Seed] Seeding Super Admin User...');
  await User.deleteMany({});
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || `Admin@${siteConfig.name}2026!`;
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const superAdmin = await User.create({
    name: 'Vishal Aman (Admin)',
    email: (process.env.ADMIN_DEFAULT_EMAIL || siteConfig.emails.admin).toLowerCase(),
    passwordHash,
    role: superAdminRole._id,
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  });

  // 3. Global Site Settings
  console.log('[Seed] Seeding Global Site Settings...');
  await SiteSettings.deleteMany({});
  await SiteSettings.create({
    siteName: siteConfig.name,
    tagline: siteConfig.tagline,
    logoUrl: siteConfig.assets.logo,
    faviconUrl: siteConfig.assets.favicon,
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    accentOrange: '#dc2626',
    contactEmail: siteConfig.emails.contact,
    contactPhone: siteConfig.phone,
    whatsappNumber: siteConfig.phone.replace(/[^0-9]/g, ''),
    officeAddress: siteConfig.address.full,
    officeLocations: [
      {
        city: 'Noida, UP',
        type: 'Main Engineering Headquarters',
        address: 'B-64, B Block, Sector 63, Noida, 201301'
      },
      {
        city: 'Bangalore, KA',
        type: 'Technical Operations Hub',
        address: 'Outer Ring Rd, Bellandur, Bangalore, 560103'
      }
    ],
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
      instagram: 'https://instagram.com'
    },
    footerText:
      'AI-powered Software Development Company for Startups & Enterprises. Re-imagining software architectures with security, accessibility, and high performance.',
    copyrightText: siteConfig.getCopyright('{year}'),
    defaultCta: {
      headline: 'Ready to bring your software vision to life?',
      subheadline:
        'Connect with our engineering leads today for a confidential architecture consultation and sprint cost breakdown.',
      buttonText: 'Schedule a Tech Consultation',
      buttonUrl: '/contact',
      secondaryButtonText: 'Explore Cost Wizard',
      secondaryButtonUrl: '/app-cost-calculator'
    }
  });

  // 4. Services (All 12 from servicesData.ts)
  console.log('[Seed] Seeding 12 Services...');
  await Service.deleteMany({});
  const servicesList = [
    {
      slug: 'app-development',
      title: 'Custom App Development',
      shortDesc: 'End-to-end native and hybrid mobile apps tailored to your business operations.',
      longDesc:
        `${siteConfig.name} designs and engineers enterprise-ready mobile app products. From initial requirement blueprinting to UX design and backend API creation, we deliver powerful Android, iOS, and hybrid applications.`,
      iconName: 'Smartphone',
      benefits: [
        'Target multiple app stores from a single code repository',
        'Offline caching and sync capabilities',
        'Seamless push notification management'
      ],
      features: [
        'Custom payment portal integration',
        'Geo-location mapping and navigation APIs',
        'Biometric secure authentication'
      ],
      techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      displayOrder: 1,
      status: 'published'
    },
    {
      slug: 'software-development',
      title: 'Custom Software Development',
      shortDesc: 'Tailored enterprise solutions built with secure, microservice architectures.',
      longDesc:
        'We build digital tools aligned with your operations. Our engineering workflows implement decoupled architectures to guarantee that your company platforms remain highly available and horizontally scalable.',
      iconName: 'Code',
      benefits: [
        'Full ownership of application source code',
        'Zero recurring software license fees',
        'High integration capacity with Legacy tools'
      ],
      features: [
        'Decoupled Microservice APIs',
        'Enterprise Database clustering',
        'Automated PDF reporting engines'
      ],
      techStack: ['Java Spring', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      displayOrder: 2,
      status: 'published'
    },
    {
      slug: 'web-design-developement',
      title: 'Web Design & Development',
      shortDesc: 'Aesthetic, conversion-focused websites engineered with React, Next.js, and Vite.',
      longDesc:
        'We construct lightweight corporate websites, SaaS web portals, and landing pages that convert traffic. Every webpage is structured around responsive layouts, Core Web Vitals optimizations, and SEO frameworks.',
      iconName: 'Globe',
      benefits: [
        'Excellent Core Web Vitals speed scores',
        'Dynamic components optimized for desktop/mobile viewports',
        'Centralized SEO control meta variables'
      ],
      features: [
        'Server-side rendering setup',
        'Interactive product visualizers',
        'CMS admin dashboard panels'
      ],
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vite'],
      displayOrder: 3,
      status: 'published'
    },
    {
      slug: 'brand-design',
      title: 'Branding & Design',
      shortDesc: 'Cohesive logo assets, UI design tokens, and branding design systems.',
      longDesc:
        `Design system assets that build credibility. ${siteConfig.name} establishes color frameworks, design component libraries, logo graphics, and brand guides to ensure your online identity remains unified across platforms.`,
      iconName: 'Palette',
      benefits: [
        'Unified design system files (Figma tokens)',
        'High conversion-rate layout architectures',
        'Vector-optimized SVG assets'
      ],
      features: [
        'Interactive mockups & click testing',
        'Centralized typography tokens',
        'Corporate logo & identity systems'
      ],
      techStack: ['Figma', 'Adobe Illustrator', 'Sketch', 'Framer'],
      displayOrder: 4,
      status: 'published'
    },
    {
      slug: 'digital-marketing-services',
      title: 'Digital Marketing Services',
      shortDesc: 'Result-driven SEO, Google Ads management, and social media campaigns.',
      longDesc:
        'Expand your digital audience. We configure conversion-optimized sales funnels, handle programmatic advertising networks, monitor search metrics, and write target content articles to scale your operational footprint.',
      iconName: 'Megaphone',
      benefits: [
        'Measurable return on advertising investments',
        'Higher rankings on Google searches',
        'Weekly performance data reviews'
      ],
      features: [
        'PPC search advertising setup',
        'On-page schema markup audit',
        'Competitor keyword indexing review'
      ],
      techStack: ['Google Analytics', 'SEMrush', 'Google Ads', 'Meta Ads Manager'],
      displayOrder: 5,
      status: 'published'
    },
    {
      slug: 'mobile-app-development',
      title: 'Mobile App Development',
      shortDesc: 'Native iOS and Android products centered on high-fidelity user experiences.',
      longDesc:
        'We build high-performance mobile applications that exploit native device features (biometrics, cameras, location trackers). Every build undergoes automated suite diagnostics before store release.',
      iconName: 'Smartphone',
      benefits: [
        'Seamless integration with iOS FaceID & Android Biometrics',
        'Optimal runtime performance utilizing local threading',
        'Compliant with App Store Guidelines'
      ],
      features: [
        'Real-time sensor API integrations',
        'Offline-first operational structures',
        'Secure encrypted SQLite data storage'
      ],
      techStack: ['SwiftUI', 'Jetpack Compose', 'Objective-C', 'Java'],
      displayOrder: 6,
      status: 'published'
    },
    {
      slug: 'iot-development',
      title: 'IoT Development',
      shortDesc: 'Edge telemetry pipelines, hardware integrations, and smart monitoring portals.',
      longDesc:
        `Integrate physical devices with cloud software. ${siteConfig.name} sets up lightweight telemetry pathways, IoT device hubs, and data visualizations to help businesses monitor industrial processes in real time.`,
      iconName: 'Cpu',
      benefits: [
        'Real-time asset telemetry checks',
        'Secure device-to-cloud MQTT messaging',
        'Automated over-the-air (OTA) firmware update grids'
      ],
      features: [
        'MQTT messaging pipelines',
        'Predictive telemetry alert grids',
        'Interactive hardware dashboard maps'
      ],
      techStack: ['C++', 'Python', 'MQTT', 'AWS IoT Core', 'Raspberry Pi'],
      displayOrder: 7,
      status: 'published'
    },
    {
      slug: 'it-consulting',
      title: 'IT Consulting',
      shortDesc: 'Strategic architecture roadmap audits and legacy cloud migration pathways.',
      longDesc:
        'Unshackle your technical architecture. Our senior engineers audit your software pipelines, review system security levels, outline cloud migration maps, and evaluate operational costs to minimize tech debt.',
      iconName: 'Compass',
      benefits: [
        'Clear tech roadmaps that lower system costs',
        'Comprehensive compliance and vulnerability checks',
        'Decisive strategies for legacy codebases'
      ],
      features: [
        'Software vulnerability auditing',
        'AWS cost allocation analysis',
        'Team skill evaluation logs'
      ],
      techStack: ['Kubernetes', 'Jira', 'Confluence', 'SonarQube'],
      displayOrder: 8,
      status: 'published'
    },
    {
      slug: 'managed-it-services',
      title: 'Managed IT Services',
      shortDesc: 'Proactive 24/7 cloud server maintenance, security monitoring, and backup controls.',
      longDesc:
        'Delegate server administration workloads. We deploy diagnostic monitoring scripts, manage automatic database backups, run security audits, and keep server operations active 24 hours a day.',
      iconName: 'ShieldCheck',
      benefits: [
        'Guaranteed 99.9% application uptime SLAs',
        'Automated file and database backups',
        'Immediate alert response grids'
      ],
      features: [
        'Vulnerability diagnostic sweeps',
        'Database recovery operations',
        'Virtual cloud server health reports'
      ],
      techStack: ['Prometheus', 'Grafana', 'Linux Shell', 'Terraform'],
      displayOrder: 9,
      status: 'published'
    },
    {
      slug: 'digital-transformation',
      title: 'Digital Transformation',
      shortDesc: 'Modernize analog business processes with cloud-based business logic tools.',
      longDesc:
        'Automate manual workflows. We modernize business units by replacing spreadsheets with customized cloud tools, setting up centralized API routing, and training teams on automated pipelines.',
      iconName: 'TrendingUp',
      benefits: [
        'Reduced processing times for manual workflows',
        'Centralized operational datasets',
        'Automated data flows between business departments'
      ],
      features: [
        'Analog paper form digitizers',
        'Custom business workflow portals',
        'Third-party API data sync hubs'
      ],
      techStack: ['Node.js', 'Python', 'Docker', 'Salesforce API', 'GraphQL'],
      displayOrder: 10,
      status: 'published'
    },
    {
      slug: 'artificial-intelligence',
      title: 'Artificial Intelligence',
      shortDesc: 'Custom LLM integrations, autonomous agents, and predictive data systems.',
      longDesc:
        `Embed machine learning into company products. ${siteConfig.name} sets up vector search indexes, integrates LLMs with internal company files, and builds prediction models to automate business processes.`,
      iconName: 'BrainCircuit',
      benefits: [
        'Automated initial customer query responses',
        'Deep semantic lookup across company documents',
        'Predictive marketing data trends'
      ],
      features: [
        'Autonomous support workflow agents',
        'Vector search lookup grids (RAG)',
        'Predictive tabular data systems'
      ],
      techStack: ['LangChain', 'OpenAI API', 'Pinecone Vector DB', 'Python', 'PyTorch'],
      displayOrder: 11,
      status: 'published'
    },
    {
      slug: 'erp-software-development',
      title: 'ERP Software Development',
      shortDesc: 'Centralized resource management, inventory logistics, and payroll tools.',
      longDesc:
        'Bring inventory tracking, bookkeeping, and team operations into a single tool. We build secure ERP hubs that let executives track operations and monitor financial performance across branches.',
      iconName: 'Layers',
      benefits: [
        'Single database source for all corporate records',
        'Real-time warehouse inventory alerts',
        'Simplified financial reporting rules'
      ],
      features: [
        'Custom payroll tracking grids',
        'Multi-currency transaction audits',
        'Supplier logistics monitoring panels'
      ],
      techStack: ['React', 'PostgreSQL', 'NestJS', 'Node.js', 'Docker'],
      displayOrder: 12,
      status: 'published'
    }
  ];

  for (const s of servicesList) {
    await Service.create({
      ...s,
      processPhases: [
        { title: 'Sprint 1: Scope & Wireframe', duration: 'Weeks 1-2', desc: 'We align on database schemas, project backlogs, and draw clickable Figma design layouts.' },
        { title: 'Sprint 2: Core Engineering', duration: 'Weeks 3-6', desc: 'Developers set up Docker containers, establish DB query indexes, and configure API endpoints.' },
        { title: 'Sprint 3: Interface Integration', duration: 'Weeks 7-10', desc: 'Integrate React components, manage dynamic state inputs, and run automated telemetry tests.' },
        { title: 'Sprint 4: QA & IP Transfer', duration: 'Weeks 11-12', desc: 'Complete security vulnerability scans, transfer owners credentials, and transition to maintenance support.' }
      ],
      faqs: [
        { title: 'How do you estimate this service milestones?', content: 'We analyze scope requirements, map deliverables to 2-week agile sprints, and outline exact timelines inside our standard SLA contracts.' },
        { title: 'Will I have direct communication channels with engineers?', content: 'Yes. We create shared Slack channels, establish bi-weekly staging review calls, and give you access to our active Git repositories.' },
        { title: 'What support options are included after release?', content: 'Every build comes with 2.5 years of free maintenance covering software regressions, server health diagnostics, and security updates.' }
      ],
      seo: {
        metaTitle: `${s.title} Services | ${siteConfig.name}`,
        metaDescription: s.shortDesc,
        canonicalUrl: `${siteConfig.url}/services/${s.slug}`,
        focusKeyword: s.title
      }
    });
  }

  // 5. Portfolio (All 5 from portfolioData.ts)
  console.log('[Seed] Seeding 5 Case Studies...');
  await Portfolio.deleteMany({});
  const portfolioItems = [
    {
      slug: 'marhba',
      title: 'Marhba Islamic Banking',
      clientName: 'Marhba Financial Group',
      category: 'Fintech',
      description: 'An interest-free Islamic digital banking platform offering secure, Sharia-compliant financial services and mobile savings accounts.',
      metrics: [
        { label: 'Active Users', value: '250K+' },
        { label: 'App Rating', value: '4.8★' },
        { label: 'Transactions', value: '$12M+' }
      ],
      tags: ['Islamic Finance', 'Digital Wallet', 'Secure Ledger'],
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'AWS Shield', 'Redis'],
      highlightColor: 'from-blue-600 to-cyan-500',
      displayOrder: 1,
      status: 'published'
    },
    {
      slug: 'train-effective',
      title: 'Train Effective Academy',
      clientName: 'Effective Sports Tech Ltd',
      category: 'Education',
      description: 'The digital football academy application providing video training resources, performance trackers, and mentor feedback grids.',
      metrics: [
        { label: 'App Downloads', value: '75K+' },
        { label: 'Monthly Sessions', value: '1.2M' },
        { label: 'SLA Uptime', value: '99.98%' }
      ],
      tags: ['Fitness Tech', 'Video Streaming', 'Interactive Quizzes'],
      techStack: ['Flutter', 'NestJS', 'MongoDB', 'Mux Video API', 'Docker'],
      highlightColor: 'from-red-600 to-orange-500',
      displayOrder: 2,
      status: 'published'
    },
    {
      slug: 'sallim',
      title: 'Sallim Healthcare Portal',
      clientName: 'Sallim Telehealth Corp',
      category: 'Healthcare',
      description: 'A secure medical doctor portal supporting real-time video consults, digital prescriptions, and HIPAA-compliant patient charting.',
      metrics: [
        { label: 'Verified Doctors', value: '1.5K+' },
        { label: 'Video Calls', value: '450K+' },
        { label: 'Chart Speed', value: '<150ms' }
      ],
      tags: ['Telehealth', 'HIPAA Compliant', 'EHR Sync'],
      techStack: ['React', 'Express.js', 'WebRTC', 'MongoDB', 'Socket.io'],
      highlightColor: 'from-emerald-600 to-teal-500',
      displayOrder: 3,
      status: 'published'
    },
    {
      slug: 'nuzest',
      title: 'Nuzest E-Commerce Store',
      clientName: 'Nuzest Nutrition',
      category: 'E-commerce',
      description: 'A headless, ultra-fast nutritional store platform utilizing static site generation, Stripe checkouts, and custom cart features.',
      metrics: [
        { label: 'Page Load Speed', value: '0.8s' },
        { label: 'Conversion Rate', value: '+30%' },
        { label: 'Active SKUs', value: '400+' }
      ],
      tags: ['Headless Commerce', 'SEO Optimized', 'Fast Checkout'],
      techStack: ['Next.js', 'Tailwind CSS', 'Shopify Storefront API', 'Stripe'],
      highlightColor: 'from-pink-600 to-rose-500',
      displayOrder: 4,
      status: 'published'
    },
    {
      slug: 'stima-boda',
      title: 'Stima Boda Logistics',
      clientName: 'Stima Mobility Africa',
      category: 'Logistics',
      description: 'A tracking and mapping tool for electric motorcycle battery swapping stations in East Africa.',
      metrics: [
        { label: 'Daily Battery Swaps', value: '5K+' },
        { label: 'GPS Accuracy', value: '<3 meters' },
        { label: 'Operational Fleet', value: '800+' }
      ],
      tags: ['IoT Hardware', 'GPS Telemetry', 'Clean Tech'],
      techStack: ['React Native', 'Python Flask', 'MQTT Broker', 'MySQL'],
      highlightColor: 'from-indigo-600 to-purple-500',
      displayOrder: 5,
      status: 'published'
    }
  ];

  for (const item of portfolioItems) {
    await Portfolio.create({
      ...item,
      seo: {
        metaTitle: `${item.title} Case Study | ${siteConfig.name}`,
        metaDescription: item.description,
        canonicalUrl: `${siteConfig.url}/case-studies#${item.slug}`
      }
    });
  }

  // 6. Blogs (All 4 from blogsData.ts)
  console.log('[Seed] Seeding 4 Blog Articles...');
  await Blog.deleteMany({});
  const blogs = [
    {
      slug: 'ai-agents-enterprise',
      title: 'How Autonomous AI Agents are Transforming Enterprise Workflows in 2026',
      excerpt: 'Explore how AI agents shift from passive text generation to orchestrating active tasks like scheduling, database analysis, and code review.',
      content: `Enterprise software is undergoing a generational shift. While the initial wave of Large Language Models focused heavily on answering questions, the current wave centers on agentic behavior.

An autonomous AI agent does not just explain a code bug—it creates a bug report, schedules a patch branch in Git, runs the test suite, and requests deployment review when successful.

At ${siteConfig.name}, our PandaNext AI team builds internal workflow integrations that hook enterprise telemetry straight into multi-step agent grids, saving thousands of operational hours.

### Key Pillars of Agentic Enterprise Architecture
1. **Deterministic Guardrails:** Ensuring LLM outputs map to strictly validated JSON schemas.
2. **Contextual Memory & RAG:** Leveraging vector databases like pgvector and Pinecone to anchor generation in internal data.
3. **Execution Sandboxes:** Running code or shell actions within isolated environments to guarantee zero security risk to host infrastructure.`,
      category: 'AI & ML',
      author: {
        name: 'Aarav Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'AI Solutions Architect'
      },
      publishedAt: new Date('2026-06-15'),
      readTime: '6 min read',
      tags: ['Artificial Intelligence', 'Automation', 'Workflow Optimization'],
      status: 'published'
    },
    {
      slug: 'vite-vs-nextjs-performance',
      title: 'Vite 8 vs. Next.js 15: Choosing the Right React Frontend for Your Startup',
      excerpt: 'An in-depth performance audit comparing static site generation and client-side single page applications for modern web products.',
      content: `When starting a new React application, developers face an immediate architectural decision: should they compile using a standard Client-Side Rendered (CSR) Vite setup, or deploy a server-integrated framework like Next.js?

For high-SEO targets (public retail stores, blogs), Next.js's server rendering is unmatched. However, for complex administration tools, internal software dashboards, and interactive cost engines (like our App Cost Calculator), Vite offers faster client execution, lightweight build bundles, and lower hosting overhead.

### Tradeoff Matrix
- **Build Time:** Vite leverages esbuild and Rollup/Rolldown, compiling in milliseconds during HMR.
- **Server Dependency:** Vite builds static bundles that can be served via CDN at edge for minimal costs.
- **SEO & Social Sharing:** Next.js generates static HTML on edge, while Vite requires pre-rendering or SSR middleware for bot indexing.`,
      category: 'Web Development',
      author: {
        name: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        role: 'Frontend Engineering Lead'
      },
      publishedAt: new Date('2026-05-28'),
      readTime: '5 min read',
      tags: ['React', 'Vite', 'NextJS', 'Core Web Vitals'],
      status: 'published'
    },
    {
      slug: 'hybrid-apps-react-native-flutter',
      title: 'React Native vs. Flutter: Developing Cross-Platform Mobile Apps with High Fidelity',
      excerpt: 'Evaluate performance metrics, hardware access patterns, and developer velocity differences when choosing hybrid frameworks.',
      content: `Releasing an app to both iOS and Android stores can double development costs if written natively in Swift and Kotlin. Hybrid frameworks address this by sharing logic.

React Native enables web developers to write custom apps using JavaScript components, mapping them to native OS controls. Flutter, compiling directly to binary code using Dart, provides absolute UI fidelity and high framerates for graphic-heavy applications.

We detail how to select between them depending on your system's hardware requirement rules.`,
      category: 'Mobile Apps',
      author: {
        name: 'Rajesh Kumar',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'Mobile Engineering Lead'
      },
      publishedAt: new Date('2026-05-10'),
      readTime: '8 min read',
      tags: ['Mobile Development', 'React Native', 'Flutter', 'Hybrid App'],
      status: 'published'
    },
    {
      slug: 'scaling-startups-mvp',
      title: 'The MVP Blueprint: How to Deliver High Uptime Products on a Startup Budget',
      excerpt: 'Five core mistakes startups make when building their first software iteration, and how to scale infrastructure on low budgets.',
      content: `The goal of a Minimum Viable Product is to validate business assumptions as quickly as possible. Yet, many teams waste months building complex server clusters and caching networks before finding their first customer.

At ${siteConfig.name}, we advise clients to start with a modular monolith backend, leverage managed database systems, and focus heavy resources on polishing user interface flows. Keeping the initial system design decoupled allows you to migrate to serverless or microservices later, only when traffic demand justifies the complexity.`,
      category: 'Tech Strategy',
      author: {
        name: 'Vikas Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        role: 'VP of Product Development'
      },
      publishedAt: new Date('2026-04-20'),
      readTime: '7 min read',
      tags: ['Product Strategy', 'MVP', 'Cloud Architecture'],
      status: 'published'
    }
  ];

  for (const b of blogs) {
    await Blog.create({
      ...b,
      seo: {
        metaTitle: `${b.title} | ${siteConfig.name} Tech Hub`,
        metaDescription: b.excerpt,
        canonicalUrl: `${siteConfig.url}/blog/${b.slug}`
      }
    });
  }

  // 7. Testimonials
  console.log('[Seed] Seeding Testimonials...');
  await Testimonial.deleteMany({});
  await Testimonial.create([
    {
      clientName: 'Tariq Al-Mansoor',
      designation: 'CTO & Co-Founder',
      company: 'Marhba Islamic Banking',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      content: `${siteConfig.name} built our entire core banking mobile application with bulletproof security, multi-factor biometric auth, and complete Sharia compliance. Shipped 2 weeks ahead of our product launch date!`,
      rating: 5,
      isFeatured: true,
      displayOrder: 1,
      status: 'published'
    },
    {
      clientName: 'Sarah Jenkins',
      designation: 'Chief Operating Officer',
      company: 'Train Effective Academy',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content: `The architectural rigor ${siteConfig.name} brought to our video streaming and coaching app allowed us to scale from 10,000 to over 75,000 active students without a single minute of server downtime.`,
      rating: 5,
      isFeatured: true,
      displayOrder: 2,
      status: 'published'
    },
    {
      clientName: 'Dr. Farhan Zaidi',
      designation: 'Managing Director',
      company: 'Sallim Telehealth',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      content: 'Their 2.5-year free maintenance guarantee and contractual SLA penalty gave our board total confidence. The WebRTC real-time charting video pipeline is fast, stable, and HIPAA compliant.',
      rating: 5,
      isFeatured: true,
      displayOrder: 3,
      status: 'published'
    }
  ]);

  // 8. Team Members
  console.log('[Seed] Seeding Team Members...');
  await TeamMember.deleteMany({});
  await TeamMember.create([
    {
      name: 'Vishal Aman',
      role: 'Founding Partner & Technical Director',
      bio: 'Ex-Systems Architect with a focus on high-concurrency databases, server caching pipelines, and React Native builds.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      },
      displayOrder: 1,
      isActive: true
    },
    {
      name: 'Devendra Singh',
      role: 'Lead DevOps & Server Infrastructure',
      bio: 'Specialist in AWS clustering, Docker environments, self-healing Kubernetes workloads, and secure network routing.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      socialLinks: {
        linkedin: 'https://linkedin.com'
      },
      displayOrder: 2,
      isActive: true
    },
    {
      name: 'Anjali Gupta',
      role: 'Head of Interface & UI/UX Design',
      bio: 'Focuses on scalable Figma tokens, design systems, interactive prototyping, and human-computer design.',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      socialLinks: {
        linkedin: 'https://linkedin.com'
      },
      displayOrder: 3,
      isActive: true
    }
  ]);

  // 9. FAQs
  console.log('[Seed] Seeding FAQs...');
  await FAQ.deleteMany({});
  await FAQ.create([
    {
      question: 'What are your core engineering models?',
      answer: 'We support three engagement pathways: Fixed Price Contracts (best for defined MVPs), Hourly Dedicated Developers (starting at $20/hour for flexible backlog sprints), and Dedicated Offshore Teams (for scaling enterprise systems).',
      category: 'general',
      displayOrder: 1,
      isActive: true
    },
    {
      question: 'Do I own the source code of my application?',
      answer: 'Yes, absolutely. Once final deliverables are approved and milestones completed, full IP ownership, source repository access, and code assets are transferred to your company under our standard agreement rules.',
      category: 'general',
      displayOrder: 2,
      isActive: true
    },
    {
      question: 'How do you guarantee project delivery dates?',
      answer: 'We implement 5% weekly SLA penalties for delayed milestones and back our delivery timelines with a financial performance guarantee. We also supply real-time live code tracking logs so you see every commit.',
      category: 'general',
      displayOrder: 3,
      isActive: true
    },
    {
      question: 'Do you offer post-release support & maintenance?',
      answer: 'Yes. Every custom build includes 2.5 years of comprehensive bug-fix maintenance, server health monitoring, and security patch updates at zero extra charge to guarantee product longevity.',
      category: 'general',
      displayOrder: 4,
      isActive: true
    }
  ]);

  // 10. Job Postings
  console.log('[Seed] Seeding Job Postings...');
  await Job.deleteMany({});
  await Job.create([
    {
      title: 'Senior Full-Stack React / Node.js Developer',
      type: 'Full-time (Remote / Noida Office)',
      location: 'Noida Office / Remote',
      experience: '5+ Years',
      description: 'Looking for an engineer experienced in React 19, TypeScript, Express API optimization, and database query indexing. Will lead product architecture boards.',
      requirements: ['5+ years React and Node.js', 'PostgreSQL and MongoDB optimization', 'TypeScript strict mode'],
      responsibilities: ['Architect web platforms', 'Lead junior engineering reviews'],
      department: 'Engineering',
      displayOrder: 1,
      isActive: true
    },
    {
      title: 'Cross-Platform Mobile App Engineer (Flutter & React Native)',
      type: 'Full-time (Noida Office)',
      location: 'Noida Office',
      experience: '3+ Years',
      description: 'Join our mobile app squad. Responsibilities include setting up device telemetry channels, managing stores builds, and tuning UI framerates.',
      requirements: ['React Native or Flutter', 'iOS App Store & Google Play deployments'],
      responsibilities: ['Develop cross-platform apps', 'Integrate biometric APIs'],
      department: 'Mobile',
      displayOrder: 2,
      isActive: true
    },
    {
      title: 'AI Integrations & Python Software Engineer',
      type: 'Full-time (Remote)',
      location: 'Remote',
      experience: '4+ Years',
      description: 'Focus on LLM workflows, context vector databases (Pinecone, pgvector), anomaly trackers, and model API integrations.',
      requirements: ['Python, FastAPI', 'LangChain, pgvector, Vector DBs'],
      responsibilities: ['Build autonomous AI agents', 'Setup RAG pipelines'],
      department: 'AI Labs',
      displayOrder: 3,
      isActive: true
    }
  ]);

  // 11. Navigation Menus
  console.log('[Seed] Seeding Navigation Menus...');
  await NavigationMenu.deleteMany({});
  await NavigationMenu.create({
    location: 'header',
    title: 'Main Navigation Header',
    isActive: true,
    items: [
      { id: 'nav-home', label: 'Home', url: '/', order: 1 },
      { id: 'nav-ai', label: 'PandaNext AI', url: '/pandanextai', badge: 'New', order: 2 },
      { id: 'nav-about', label: 'About Us', url: '/about', order: 3 },
      { id: 'nav-services', label: 'Services', url: '/#services', order: 4 },
      { id: 'nav-portfolio', label: 'Portfolio', url: '/case-studies', order: 5 },
      { id: 'nav-blogs', label: 'Blogs', url: '/blog', order: 6 },
      { id: 'nav-contact', label: 'Contact', url: '/contact', order: 7 }
    ]
  });

  await NavigationMenu.create({
    location: 'footer_company',
    title: 'Our Company',
    isActive: true,
    items: [
      { id: 'f-about', label: 'About Us', url: '/about', order: 1 },
      { id: 'f-career', label: 'Careers', url: '/career', badge: 'Hiring', order: 2 },
      { id: 'f-contact', label: 'Contact Us', url: '/contact', order: 3 },
      { id: 'f-privacy', label: 'Privacy Policy', url: '/privacy-policy', order: 4 },
      { id: 'f-cookies', label: 'Cookies Policy', url: '/cookies-policy', order: 5 }
    ]
  });

  await NavigationMenu.create({
    location: 'footer_recent_work',
    title: 'Recent Work',
    isActive: true,
    items: [
      { id: 'f-marhba', label: 'Marhba Banking App', url: '/case-studies', order: 1 },
      { id: 'f-sallim', label: 'Sallim Telehealth Portal', url: '/case-studies', order: 2 },
      { id: 'f-train', label: 'Train Effective Academy', url: '/case-studies', order: 3 },
      { id: 'f-nuzest', label: 'Nuzest Headless E-store', url: '/case-studies', order: 4 },
      { id: 'f-stima', label: 'Stima Boda IoT Dashboard', url: '/case-studies', order: 5 }
    ]
  });

  await NavigationMenu.create({
    location: 'footer_key_offerings',
    title: 'Key Offerings',
    isActive: true,
    items: [
      { id: 'f-app', label: 'Custom App Development', url: '/services/app-development', order: 1 },
      { id: 'f-software', label: 'Custom Software Development', url: '/services/software-development', order: 2 },
      { id: 'f-web', label: 'Web Design & Development', url: '/services/web-design-developement', order: 3 },
      { id: 'f-brand', label: 'Branding & Design', url: '/services/brand-design', order: 4 },
      { id: 'f-digital', label: 'Digital Marketing Services', url: '/services/digital-marketing-services', order: 5 }
    ]
  });

  // 12. SEO Settings
  console.log('[Seed] Seeding SEO Settings...');
  await SeoSettings.deleteMany({});
  await SeoSettings.create({
    defaultMetaTitle: `${siteConfig.name} | ${siteConfig.tagline}`,
    defaultMetaDescription: siteConfig.description,
    defaultOgImage: `${siteConfig.url}/og-image.jpg`,
    siteUrl: siteConfig.url,
    googleAnalyticsId: 'G-HP78201',
    organizationSchema: {
      name: `${siteConfig.name} ${siteConfig.subName}`,
      legalName: siteConfig.legalName,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.assets.logo}`,
      contactPoint: {
        telephone: '+91-8887024887',
        contactType: 'Customer Support',
        email: 'vishamanofficial.business@gmail.com',
        areaServed: 'Global'
      },
      address: {
        streetAddress: 'B-64, B Block, Sector 63',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201301',
        addressCountry: 'India'
      },
      sameAs: [
        'https://facebook.com',
        'https://twitter.com',
        'https://linkedin.com',
        'https://instagram.com'
      ]
    }
  });

  // 13. Initial CRM Leads
  console.log('[Seed] Seeding Initial CRM Leads...');
  await Lead.deleteMany({});
  await Lead.create([
    {
      fullName: 'Vikramaditya Singhania',
      email: 'vikram@singhaniagroup.in',
      phone: '9812345678',
      countryCode: '+91',
      isWhatsApp: true,
      companyName: 'Singhania Logistics Ltd',
      interestedService: 'ERP Software Development',
      budget: '$15k - $30k',
      message: 'Need a customized logistics telemetry dashboard and warehouse inventory scanner for 12 distribution centers.',
      source: 'contact_page',
      status: 'new',
      priority: 'high',
      assignedTo: superAdmin._id,
      notes: [
        {
          id: 'n1',
          text: 'Client requested NDA prior to sharing their warehouse floor plan blueprints.',
          addedBy: 'Vishal Aman',
          createdAt: new Date()
        }
      ],
      activityLog: [
        {
          action: 'LEAD_SUBMITTED',
          performedBy: 'Visitor',
          timestamp: new Date(),
          details: 'Submitted contact form on Contact page'
        }
      ]
    },
    {
      fullName: 'Emma Watson',
      email: 'emma.watson@medconnect.co.uk',
      phone: '7911123456',
      countryCode: '+44',
      isWhatsApp: true,
      companyName: 'MedConnect UK',
      interestedService: 'Custom App Development',
      budget: '$5k - $15k',
      message: 'Looking for a HIPAA-grade mobile appointment booking application with doctor availability calendars.',
      source: 'cost_calculator',
      calculatorDetails: {
        platform: 'hybrid',
        category: 'healthcare',
        design: 'custom',
        management: ['users', 'content', 'analytics'],
        estimatedCost: 14200,
        timelineWeeks: { min: 8, max: 12 },
        suggestedTech: ['React Native', 'Node.js', 'PostgreSQL']
      },
      status: 'contacted',
      priority: 'high',
      assignedTo: superAdmin._id,
      notes: [
        {
          id: 'n2',
          text: 'Initial scoping email sent. Waiting for schedule confirmation for Zoom demo.',
          addedBy: 'Vishal Aman',
          createdAt: new Date()
        }
      ],
      activityLog: [
        {
          action: 'LEAD_SUBMITTED',
          performedBy: 'Visitor',
          timestamp: new Date(Date.now() - 86400000),
          details: 'Calculated project via App Cost Calculator ($14,200 ballpark)'
        },
        {
          action: 'STATUS_CHANGED',
          performedBy: 'Vishal Aman',
          timestamp: new Date(),
          details: "Moved stage from 'new' to 'contacted'"
        }
      ]
    }
  ]);

  // 14. Dynamic Pages with Section Builder Data (Homepage, About, PandaNextAI)
  console.log('[Seed] Seeding Dynamic Pages and Section Builder Schema...');
  await Page.deleteMany({});
  await PageRevision.deleteMany({});

  const homePage = await Page.create({
    title: 'Home',
    slug: 'home',
    status: 'published',
    publishedAt: new Date(),
    currentRevision: 1,
    author: superAdmin._id,
    seo: {
      metaTitle: `${siteConfig.name} | ${siteConfig.tagline}`,
      metaDescription: siteConfig.description,
      canonicalUrl: `${siteConfig.url}/`,
      focusKeyword: 'AI-Powered Software Development',
      ogImage: `${siteConfig.url}/og-image.jpg`
    },
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
        name: 'Hero Section',
        order: 1,
        isEnabled: true,
        settings: { background: 'gradient' },
        content: {
          badgeText: 'Contractual SLA & 2.5 Years Free Maintenance',
          headline: 'Engineering Scalable Software & AI Products That Power Modern Business',
          description:
            `From day one, ${siteConfig.name} engineers production-grade mobile applications, robust web platforms, and custom machine learning pipelines backed by enforceable delivery guarantees.`,
          primaryBtnText: 'Book a Free Architecture Call',
          primaryBtnUrl: '/contact',
          secondaryBtnText: 'Explore Services',
          secondaryBtnUrl: '#services',
          statsPills: [
            { label: 'Products Shipped', value: '120+' },
            { label: 'Client Retention', value: '99.4%' },
            { label: 'Global Rating', value: '4.9/5' },
            { label: 'Operating Markets', value: '8+' }
          ]
        }
      },
      {
        id: 'sec-ticker',
        type: 'client_logos',
        name: 'Client Brands Ticker',
        order: 2,
        isEnabled: true,
        settings: { speed: 30 },
        content: {
          subheading: 'TRUSTED BY FAST-GROWING STARTUPS & ESTABLISHED ENTERPRISES',
          brands: ['Finovate', 'HealthSync', 'CloudScale', 'LogiTrack', 'EduPulse', 'RetailNext']
        }
      },
      {
        id: 'sec-services',
        type: 'services_grid',
        name: 'Services Grid Showcase',
        order: 3,
        isEnabled: true,
        settings: { columns: 3 },
        content: {
          badge: 'WHAT WE DELIVER',
          heading: 'High-Performance Software Engineering Services',
          subheading:
            'Decoupled architectures, responsive frontends, and automated deployments tailored to your exact product specifications.'
        }
      },
      {
        id: 'sec-pillars',
        type: 'value_pillars',
        name: 'Why Work With Us',
        order: 4,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'WHY WORK WITH US',
          heading: 'Built for founders who value velocity, architectural rigor, and transparent delivery',
          subheading: 'We replace opaque agency timelines with contractually backed sprint commitments.'
        }
      },
      {
        id: 'sec-industries',
        type: 'industry_tabs',
        name: 'Industries We Serve',
        order: 5,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'INDUSTRIES WE SERVE',
          heading: 'Tailored Solutions Across High-Growth Verticals',
          categories: ['Fintech', 'Healthcare', 'E-commerce', 'Education', 'Logistics']
        }
      },
      {
        id: 'sec-portfolio',
        type: 'portfolio_highlights',
        name: 'Proven Results / Case Studies',
        order: 6,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'PROVEN RESULTS',
          heading: 'Real Products, Measurable Impact',
          subheading: 'Review how our software builds solve scaling hurdles and increase company valuations.'
        }
      },
      {
        id: 'sec-journey',
        type: 'engineering_journey',
        name: 'Engineering Journey Timeline',
        order: 7,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'HOW WE WORK',
          heading: 'From Architecture Blueprint to Production Deployment',
          subheading: 'A four-phase iterative engineering lifecycle backed by weekly review demos and code audits.'
        }
      },
      {
        id: 'sec-tech',
        type: 'tech_ecosystem',
        name: 'Technology Ecosystem',
        order: 8,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'OUR STACK',
          heading: 'Modern, Battle-Tested Engineering Stacks',
          subheading: 'We engineer with leading type-safe frameworks, distributed databases, and automated cloud pipelines.'
        }
      },
      {
        id: 'sec-testimonials',
        type: 'testimonials',
        name: 'Client Testimonials',
        order: 9,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'CLIENT TESTIMONIALS',
          heading: 'Trusted by Founders, CTOs, and Product Leaders',
          subheading: `Hear directly from executives who scale their businesses on ${siteConfig.name} software systems.`
        }
      },
      {
        id: 'sec-faqs',
        type: 'faqs',
        name: 'Frequently Asked Questions',
        order: 10,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'FREQUENTLY ASKED QUESTIONS',
          heading: 'Everything You Need to Know About Partnering With Us',
          subheading: 'Clear answers on engineering contracts, source code ownership, SLA guarantees, and maintenance.'
        }
      },
      {
        id: 'sec-blueprint',
        type: 'lead_form',
        name: 'Homepage Blueprint Lead Capture',
        order: 11,
        isEnabled: true,
        settings: {},
        content: {
          badge: 'GET STARTED TODAY',
          heading: "Let's Build Something Extraordinary Together",
          subheading: 'Share your application concept for an NDA-backed architecture roadmap and transparent sprint quote.'
        }
      },
      {
        id: 'sec-cta',
        type: 'cta_banner',
        name: 'Bottom Action Banner',
        order: 12,
        isEnabled: true,
        settings: { background: 'gradient' },
        content: {
          heading: 'Ready to bring your software vision to life?',
          subheading: 'Connect with our engineering leads today for a confidential architecture consultation and sprint cost breakdown.',
          primaryBtnText: 'Schedule a Tech Consultation',
          primaryBtnUrl: '/contact',
          secondaryBtnText: 'Estimate with App Cost Calculator',
          secondaryBtnUrl: '/app-cost-calculator'
        }
      }
    ]
  });

  // Record Revision 1 for Home Page
  await PageRevision.create({
    pageId: homePage._id,
    revisionNumber: 1,
    title: homePage.title,
    slug: homePage.slug,
    sectionsData: homePage.sections,
    seoData: homePage.seo,
    status: homePage.status,
    changeSummary: 'Initial seeded homepage layout with 12 modular sections',
    changedBy: superAdmin._id
  });

  console.log('[Seed] Database seeding completed successfully!');
};

// Run if script is directly executed
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedData();
      await disconnectDB();
      process.exit(0);
    } catch (err: any) {
      console.error('[Seed Error]:', err);
      process.exit(1);
    }
  })();
}

export const seedInitialData = async () => {
  const { User } = await import('@/models/User');
  const count = await User.countDocuments();
  if (count === 0) {
    await seedData();
  }
};
