export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  techStack: string[];
  highlightColor: string;
}

export const portfolioData: PortfolioItem[] = [
  {
    id: "marhba",
    title: "Marhba Islamic Banking",
    category: "Fintech",
    description: "An interest-free Islamic digital banking platform offering secure, Sharia-compliant financial services and mobile savings accounts.",
    metrics: [
      { label: "Active Users", value: "250K+" },
      { label: "App Rating", value: "4.8★" },
      { label: "Transactions", value: "$12M+" }
    ],
    tags: ["Islamic Finance", "Digital Wallet", "Secure Ledger"],
    techStack: ["React Native", "Node.js", "PostgreSQL", "AWS Shield", "Redis"],
    highlightColor: "from-blue-600 to-cyan-500"
  },
  {
    id: "train-effective",
    title: "Train Effective Academy",
    category: "Education",
    description: "The digital football academy application providing video training resources, performance trackers, and mentor feedback grids.",
    metrics: [
      { label: "App Downloads", value: "75K+" },
      { label: "Monthly Sessions", value: "1.2M" },
      { label: "SLA Uptime", value: "99.98%" }
    ],
    tags: ["Fitness Tech", "Video Streaming", "Interactive Quizzes"],
    techStack: ["Flutter", "NestJS", "MongoDB", "Mux Video API", "Docker"],
    highlightColor: "from-red-600 to-orange-500"
  },
  {
    id: "sallim",
    title: "Sallim Healthcare Portal",
    category: "Healthcare",
    description: "A secure medical doctor portal supporting real-time video consults, digital prescriptions, and HIPAA-compliant patient charting.",
    metrics: [
      { label: "Verified Doctors", value: "1.5K+" },
      { label: "Video Calls", value: "450K+" },
      { label: "Chart Speed", value: "<150ms" }
    ],
    tags: ["Telehealth", "HIPAA Compliant", "EHR Sync"],
    techStack: ["React", "Express.js", "WebRTC", "MongoDB", "Socket.io"],
    highlightColor: "from-emerald-600 to-teal-500"
  },
  {
    id: "nuzest",
    title: "Nuzest E-Commerce Store",
    category: "E-commerce",
    description: "A headless, ultra-fast nutritional store platform utilizing static site generation, Stripe checkouts, and custom cart features.",
    metrics: [
      { label: "Page Load Speed", value: "0.8s" },
      { label: "Conversion Rate", value: "+30%" },
      { label: "Active SKUs", value: "400+" }
    ],
    tags: ["Headless Commerce", "SEO Optimized", "Fast Checkout"],
    techStack: ["Next.js", "Tailwind CSS", "Shopify Storefront API", "Stripe"],
    highlightColor: "from-pink-600 to-rose-500"
  },
  {
    id: "stima-boda",
    title: "Stima Boda Logistics",
    category: "Logistics",
    description: "A tracking and mapping tool for electric motorcycle battery swapping stations in East Africa.",
    metrics: [
      { label: "Daily Battery Swaps", value: "5K+" },
      { label: "GPS Accuracy", value: "<3 meters" },
      { label: "Operational Fleet", value: "800+" }
    ],
    tags: ["IoT Hardware", "GPS Telemetry", "Clean Tech"],
    techStack: ["React Native", "Python Flask", "MQTT Broker", "MySQL"],
    highlightColor: "from-indigo-600 to-purple-500"
  }
];
