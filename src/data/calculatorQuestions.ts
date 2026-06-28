export interface CalculatorOption {
  id: string;
  label: string;
  iconName: string;
  baseCost?: number;
  multiplier?: number;
  flatCost?: number;
}

export interface CalculatorQuestion {
  id: string;
  step: number;
  question: string;
  description: string;
  type: "single" | "multi";
  options: CalculatorOption[];
  required?: boolean;
}

export const calculatorQuestions: CalculatorQuestion[] = [
  {
    id: "platform",
    step: 1,
    question: "Which platform will the app be built on?",
    description: "Select the primary environment where your software product will run.",
    type: "single",
    required: true,
    options: [
      { id: "android", label: "Android App", iconName: "Smartphone", baseCost: 5000 },
      { id: "website", label: "Website / Web App", iconName: "Globe", baseCost: 3000 },
      { id: "ios", label: "iOS App", iconName: "Apple", baseCost: 6000 },
      { id: "hybrid", label: "Hybrid App (Android + iOS)", iconName: "Tablet", baseCost: 8000 }
    ]
  },
  {
    id: "category",
    step: 2,
    question: "Choose a category",
    description: "Selecting a category helps us tailor the software business logic and features.",
    type: "single",
    required: true,
    options: [
      { id: "ecommerce", label: "E-Commerce", iconName: "ShoppingBag", multiplier: 1.25 },
      { id: "saas", label: "SaaS / Portal", iconName: "Layers", multiplier: 1.40 },
      { id: "delivery", label: "Delivery Services", iconName: "Truck", multiplier: 1.20 },
      { id: "healthcare", label: "Healthcare / Telehealth", iconName: "HeartPulse", multiplier: 1.30 },
      { id: "iot", label: "IoT / Smart Systems", iconName: "Cpu", multiplier: 1.35 },
      { id: "booking", label: "Booking / Scheduling App", iconName: "CalendarDays", multiplier: 1.20 },
      { id: "education", label: "E-Learning / LMS", iconName: "GraduationCap", multiplier: 1.15 },
      { id: "ott", label: "OTT / Video Streaming", iconName: "Tv", multiplier: 1.35 },
      { id: "sports", label: "Sports & Fitness", iconName: "Dumbbell", multiplier: 1.10 },
      { id: "logistics", label: "Logistics / Fleet tracking", iconName: "Navigation", multiplier: 1.25 },
      { id: "others", label: "Others", iconName: "MoreHorizontal", multiplier: 1.00 }
    ]
  },
  {
    id: "design",
    step: 3,
    question: "What would your UI theme be?",
    description: "Choose the design quality and fidelity of the application interface.",
    type: "single",
    required: true,
    options: [
      { id: "stock", label: "Stock or Template UI", iconName: "Layout", multiplier: 1.00 },
      { id: "custom", label: "Custom Branded UI", iconName: "Sparkles", multiplier: 1.25 },
      { id: "animated", label: "Animated UI Effects", iconName: "Activity", multiplier: 1.40 },
      { id: "game", label: "Game / Immersive Animations", iconName: "Gamepad2", multiplier: 1.60 }
    ]
  },
  {
    id: "management",
    step: 4,
    question: "Which administration features do you need?",
    description: "Choose the administrative modules to build into the admin panel (Select at least one).",
    type: "multi",
    required: true,
    options: [
      { id: "users", label: "User Management", iconName: "Users", flatCost: 1000 },
      { id: "content", label: "Content Management (CMS)", iconName: "FileText", flatCost: 1200 },
      { id: "analytics", label: "Reporting and Analytics", iconName: "BarChart3", flatCost: 1500 },
      { id: "notifications", label: "Notification Control", iconName: "BellRing", flatCost: 800 }
    ]
  }
];

export interface CalculationResult {
  estimatedCost: number;
  timelineWeeks: { min: number; max: number };
  suggestedTech: string[];
}

export const runCalculation = (selections: Record<string, string | string[]>): CalculationResult => {
  const platformSelection = selections["platform"] as string;
  const categorySelection = selections["category"] as string;
  const designSelection = selections["design"] as string;
  const managementSelection = (selections["management"] as string[]) || [];

  const platformOpt = calculatorQuestions[0].options.find(o => o.id === platformSelection);
  const baseCost = platformOpt?.baseCost || 4000;

  const categoryOpt = calculatorQuestions[1].options.find(o => o.id === categorySelection);
  const categoryMult = categoryOpt?.multiplier || 1.0;

  const designOpt = calculatorQuestions[2].options.find(o => o.id === designSelection);
  const designMult = designOpt?.multiplier || 1.0;

  let flatCostSum = 0;
  managementSelection.forEach(id => {
    const opt = calculatorQuestions[3].options.find(o => o.id === id);
    if (opt?.flatCost) {
      flatCostSum += opt.flatCost;
    }
  });

  const rawCost = (baseCost * categoryMult * designMult) + flatCostSum;
  const estimatedCost = Math.round(rawCost);

  let baseWeeks = 6;
  if (platformSelection === "hybrid") baseWeeks += 4;
  if (platformSelection === "ios" || platformSelection === "android") baseWeeks += 3;
  if (designSelection === "animated") baseWeeks += 2;
  if (designSelection === "game") baseWeeks += 4;
  baseWeeks += managementSelection.length * 1.5;

  const minWeeks = Math.max(4, Math.floor(baseWeeks * 0.85));
  const maxWeeks = Math.ceil(baseWeeks * 1.2);

  const suggestedTech: string[] = [];
  if (platformSelection === "website") {
    suggestedTech.push("React", "Next.js", "Tailwind CSS", "Node.js (Express)", "PostgreSQL");
  } else if (platformSelection === "hybrid") {
    suggestedTech.push("React Native", "Expo", "NestJS", "MongoDB", "Redux Toolkit");
  } else if (platformSelection === "ios") {
    suggestedTech.push("SwiftUI", "Swift", "Node.js", "PostgreSQL", "Firebase");
  } else {
    suggestedTech.push("Kotlin", "Jetpack Compose", "Node.js", "MongoDB", "Firebase");
  }

  if (categorySelection === "ecommerce") {
    suggestedTech.push("Stripe Payment SDK", "Shopify headless API");
  } else if (categorySelection === "iot") {
    suggestedTech.push("MQTT Broker", "InfluxDB (Time series)");
  } else if (categorySelection === "ott") {
    suggestedTech.push("Mux Video API", "HLS streaming protocol");
  } else if (categorySelection === "healthcare") {
    suggestedTech.push("WebRTC", "HIPAA Compliant AWS Storage");
  }

  return {
    estimatedCost,
    timelineWeeks: { min: minWeeks, max: maxWeeks },
    suggestedTech: Array.from(new Set(suggestedTech))
  };
};
