export interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  benefits: string[];
  features: string[];
  techStack: string[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: "app-development",
    title: "Custom App Development",
    shortDesc: "End-to-end native and hybrid mobile apps tailored to your business operations.",
    longDesc: "HangingPanda designs and engineers enterprise-ready mobile app products. From initial requirement blueprinting to UX design and backend API creation, we deliver powerful Android, iOS, and hybrid applications.",
    iconName: "Smartphone",
    benefits: [
      "Target multiple app stores from a single code repository",
      "Offline caching and sync capabilities",
      "Seamless push notification management"
    ],
    features: [
      "Custom payment portal integration",
      "Geo-location mapping and navigation APIs",
      "Biometric secure authentication"
    ],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"]
  },
  {
    slug: "software-development",
    title: "Custom Software Development",
    shortDesc: "Tailored enterprise solutions built with secure, microservice architectures.",
    longDesc: "We build digital tools aligned with your operations. Our engineering workflows implement decoupled architectures to guarantee that your company platforms remain highly available and horizontally scalable.",
    iconName: "Code",
    benefits: [
      "Full ownership of application source code",
      "Zero recurring software license fees",
      "High integration capacity with Legacy tools"
    ],
    features: [
      "Decoupled Microservice APIs",
      "Enterprise Database clustering",
      "Automated PDF reporting engines"
    ],
    techStack: ["Java Spring", "Node.js", "PostgreSQL", "Docker", "AWS"]
  },
  {
    slug: "web-design-developement",
    title: "Web Design & Development",
    shortDesc: "Aesthetic, conversion-focused websites engineered with React, Next.js, and Vite.",
    longDesc: "We construct lightweight corporate websites, SaaS web portals, and landing pages that convert traffic. Every webpage is structured around responsive layouts, Core Web Vitals optimizations, and SEO frameworks.",
    iconName: "Globe",
    benefits: [
      "Excellent Core Web Vitals speed scores",
      "Dynamic components optimized for desktop/mobile viewports",
      "Centralized SEO control meta variables"
    ],
    features: [
      "Server-side rendering setup",
      "Interactive product visualizers",
      "CMS admin dashboard panels"
    ],
    techStack: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Vite"]
  },
  {
    slug: "brand-design",
    title: "Branding & Design",
    shortDesc: "Cohesive logo assets, UI design tokens, and branding design systems.",
    longDesc: "Design system assets that build credibility. HangingPanda establishes color frameworks, design component libraries, logo graphics, and brand guides to ensure your online identity remains unified across platforms.",
    iconName: "Palette",
    benefits: [
      "Unified design system files (Figma tokens)",
      "High conversion-rate layout architectures",
      "Vector-optimized SVG assets"
    ],
    features: [
      "Interactive mockups & click testing",
      "Centralized typography tokens",
      "Corporate logo & identity systems"
    ],
    techStack: ["Figma", "Adobe Illustrator", "Sketch", "Framer"]
  },
  {
    slug: "digital-marketing-services",
    title: "Digital Marketing Services",
    shortDesc: "Result-driven SEO, Google Ads management, and social media campaigns.",
    longDesc: "Expand your digital audience. We configure conversion-optimized sales funnels, handle programmatic advertising networks, monitor search metrics, and write target content articles to scale your operational footprint.",
    iconName: "Megaphone",
    benefits: [
      "Measurable return on advertising investments",
      "Higher rankings on Google searches",
      "Weekly performance data reviews"
    ],
    features: [
      "PPC search advertising setup",
      "On-page schema markup audit",
      "Competitor keyword indexing review"
    ],
    techStack: ["Google Analytics", "SEMrush", "Google Ads", "Meta Ads Manager"]
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    shortDesc: "Native iOS and Android products centered on high-fidelity user experiences.",
    longDesc: "We build high-performance mobile applications that exploit native device features (biometrics, cameras, location trackers). Every build undergoes automated suite diagnostics before store release.",
    iconName: "Smartphone",
    benefits: [
      "Seamless integration with iOS FaceID & Android Biometrics",
      "Optimal runtime performance utilizing local threading",
      "Compliant with App Store Guidelines"
    ],
    features: [
      "Real-time sensor API integrations",
      "Offline-first operational structures",
      "Secure encrypted SQLite data storage"
    ],
    techStack: ["SwiftUI", "Jetpack Compose", "Objective-C", "Java"]
  },
  {
    slug: "iot-development",
    title: "IoT Development",
    shortDesc: "Edge telemetry pipelines, hardware integrations, and smart monitoring portals.",
    longDesc: "Integrate physical devices with cloud software. HangingPanda sets up lightweight telemetry pathways, IoT device hubs, and data visualizations to help businesses monitor industrial processes in real time.",
    iconName: "Cpu",
    benefits: [
      "Real-time asset telemetry checks",
      "Secure device-to-cloud MQTT messaging",
      "Automated over-the-air (OTA) firmware update grids"
    ],
    features: [
      "MQTT messaging pipelines",
      "Predictive telemetry alert grids",
      "Interactive hardware dashboard maps"
    ],
    techStack: ["C++", "Python", "MQTT", "AWS IoT Core", "Raspberry Pi"]
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    shortDesc: "Strategic architecture roadmap audits and legacy cloud migration pathways.",
    longDesc: "Unshackle your technical architecture. Our senior engineers audit your software pipelines, review system security levels, outline cloud migration maps, and evaluate operational costs to minimize tech debt.",
    iconName: "Compass",
    benefits: [
      "Clear tech roadmaps that lower system costs",
      "Comprehensive compliance and vulnerability checks",
      "Decisive strategies for legacy codebases"
    ],
    features: [
      "Software vulnerability auditing",
      "AWS cost allocation analysis",
      "Team skill evaluation logs"
    ],
    techStack: ["Kubernetes", "Jira", "Confluence", "SonarQube"]
  },
  {
    slug: "managed-it-services",
    title: "Managed IT Services",
    shortDesc: "Proactive 24/7 cloud server maintenance, security monitoring, and backup controls.",
    longDesc: "Delegate server administration workloads. We deploy diagnostic monitoring scripts, manage automatic database backups, run security audits, and keep server operations active 24 hours a day.",
    iconName: "ShieldCheck",
    benefits: [
      "Guaranteed 99.9% application uptime SLAs",
      "Automated file and database backups",
      "Immediate alert response grids"
    ],
    features: [
      "Vulnerability diagnostic sweeps",
      "Database recovery operations",
      "Virtual cloud server health reports"
    ],
    techStack: ["Prometheus", "Grafana", "Linux Shell", "Terraform"]
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation",
    shortDesc: "Modernize analog business processes with cloud-based business logic tools.",
    longDesc: "Automate manual workflows. We modernize business units by replacing spreadsheets with customized cloud tools, setting up centralized API routing, and training teams on automated pipelines.",
    iconName: "TrendingUp",
    benefits: [
      "Reduced processing times for manual workflows",
      "Centralized operational datasets",
      "Automated data flows between business departments"
    ],
    features: [
      "Analog paper form digitizers",
      "Custom business workflow portals",
      "Third-party API data sync hubs"
    ],
    techStack: ["Node.js", "Python", "Docker", "Salesforce API", "GraphQL"]
  },
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    shortDesc: "Custom LLM integrations, autonomous agents, and predictive data systems.",
    longDesc: "Embed machine learning into company products. HangingPanda sets up vector search indexes, integrates LLMs with internal company files, and builds prediction models to automate business processes.",
    iconName: "BrainCircuit",
    benefits: [
      "Automated initial customer query responses",
      "Deep semantic lookup across company documents",
      "Predictive marketing data trends"
    ],
    features: [
      "Autonomous support workflow agents",
      "Vector search lookup grids (RAG)",
      "Predictive tabular data systems"
    ],
    techStack: ["LangChain", "OpenAI API", "Pinecone Vector DB", "Python", "PyTorch"]
  },
  {
    slug: "erp-software-development",
    title: "ERP Software Development",
    shortDesc: "Centralized resource management, inventory logistics, and payroll tools.",
    longDesc: "Bring inventory tracking, bookkeeping, and team operations into a single tool. We build secure ERP hubs that let executives track operations and monitor financial performance across branches.",
    iconName: "Layers",
    benefits: [
      "Single database source for all corporate records",
      "Real-time warehouse inventory alerts",
      "Simplified financial reporting rules"
    ],
    features: [
      "Custom payroll tracking grids",
      "Multi-currency transaction audits",
      "Supplier logistics monitoring panels"
    ],
    techStack: ["React", "PostgreSQL", "NestJS", "Node.js", "Docker"]
  }
];
