import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Smartphone,
  Globe,
  Tablet,
  ShoppingBag,
  Layers,
  Truck,
  HeartPulse,
  Cpu,
  CalendarDays,
  GraduationCap,
  Tv,
  Dumbbell,
  Navigation,
  MoreHorizontal,
  Layout,
  Sparkles,
  Activity,
  Gamepad2,
  Users,
  FileText,
  BarChart3,
  BellRing
} from "lucide-react";
import { Apple } from "../ui/BrandIcons";
import {
  calculatorQuestions,
  runCalculation
} from "../../data/calculatorQuestions";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { PhoneInput } from "../ui/PhoneInput";

const calculatorIcons: Record<string, React.ComponentType<any>> = {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Smartphone,
  Globe,
  Tablet,
  ShoppingBag,
  Layers,
  Truck,
  HeartPulse,
  Cpu,
  CalendarDays,
  GraduationCap,
  Tv,
  Dumbbell,
  Navigation,
  MoreHorizontal,
  Layout,
  Sparkles,
  Activity,
  Gamepad2,
  Users,
  FileText,
  BarChart3,
  BellRing
};

export const CalculatorWizard: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({
    platform: "",
    category: "",
    design: "",
    management: []
  });


  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    query: "",
    subscribe: false,
    isWhatsApp: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);  const [submitError, setSubmitError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const totalSteps = 5;

  useEffect(() => {
    setErrors({});
    setHasSubmitted(false);
  }, [currentStep]);

  const renderIcon = (name: string, className: string = "w-6 h-6") => {
    if (name === "Apple") {
      return <Apple className={className} />;
    }
    const IconComponent = calculatorIcons[name] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const handleSingleSelect = (questionId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [questionId]: optionId }));
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  };

  const handleMultiSelect = (questionId: string, optionId: string) => {
    setSelections((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: updated };
    });
    setErrors((prev) => ({ ...prev, [questionId]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1 && !selections.platform) {
      stepErrors.platform = "Please select a platform to proceed.";
    }
    if (step === 2 && !selections.category) {
      stepErrors.category = "Please select an app category.";
    }
    if (step === 3 && !selections.design) {
      stepErrors.design = "Please choose a design theme.";
    }
    if (step === 4) {
      const management = selections.management as string[];
      if (management.length === 0) {
        stepErrors.management = "Please select at least one management feature.";
      }
    }
    if (step === 5) {
      if (!clientInfo.name.trim()) stepErrors.name = "Full Name is required.";
      if (!clientInfo.email.trim()) {
        stepErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(clientInfo.email)) {
        stepErrors.email = "Please enter a valid email address.";
      }
      
      const cleanPhone = clientInfo.phone.trim();
      if (!cleanPhone) {
        stepErrors.phone = "Phone number is required.";
      } else if (!/^\d{6,15}$/.test(cleanPhone.replace(/[\s()-]/g, ""))) {
        stepErrors.phone = "Please enter a valid phone number (6 to 15 digits).";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: checked }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!validateStep(5)) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    const results = runCalculation(selections);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          from_name: clientInfo.name,
          subject: `New App Cost Calculation Request from ${clientInfo.name}`,
          email: clientInfo.email,
          phone: `${clientInfo.countryCode} ${clientInfo.phone}`,
          "Is WhatsApp Number": clientInfo.isWhatsApp ? "Yes" : "No",
          message: clientInfo.query,
          "Estimated Cost": `$${results.estimatedCost.toLocaleString()}`,
          "Selected Platform": selections.platform,
          "Selected Category": selections.category,
          "Selected Design Theme": selections.design,
          "Selected Features": Array.isArray(selections.management) ? selections.management.join(", ") : selections.management
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        navigate("/thank-you", {
          state: {
            clientName: clientInfo.name,
            results,
            selections
          }
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setSubmitError("There was an error submitting your calculation. Please try again or email us directly at vishamanofficial.business@gmail.com.");
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-bold uppercase text-text-secondary tracking-wider mb-3">
          <span>App Cost Calculator</span>
          <span>Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="w-full h-2.5 bg-surface border border-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4 }}
            className="h-full bg-gradient-to-r from-primary to-accent-orange"
          />
        </div>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep <= 4 ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-2">
                    {calculatorQuestions[currentStep - 1].question}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {calculatorQuestions[currentStep - 1].description}
                  </p>
                </div>

                <div
                  role={calculatorQuestions[currentStep - 1].type === "single" ? "radiogroup" : "group"}
                  aria-label={calculatorQuestions[currentStep - 1].question}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                >
                  {calculatorQuestions[currentStep - 1].options.map((opt) => {
                    const qId = calculatorQuestions[currentStep - 1].id;
                    const isSelected =
                      calculatorQuestions[currentStep - 1].type === "single"
                        ? selections[qId] === opt.id
                        : (selections[qId] as string[]).includes(opt.id);

                    return (
                      <button
                        type="button"
                        key={opt.id}
                        role={calculatorQuestions[currentStep - 1].type === "single" ? "radio" : "checkbox"}
                        aria-checked={isSelected}
                        onClick={() =>
                          calculatorQuestions[currentStep - 1].type === "single"
                            ? handleSingleSelect(qId, opt.id)
                            : handleMultiSelect(qId, opt.id)
                        }
                        className={`p-6 rounded-xl border-2 text-left flex items-start gap-4 transition-all duration-300 transform active:scale-[0.98] ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/5"
                            : "border-border hover:border-primary/30 bg-surface/50 text-text-primary hover:bg-surface"
                        }`}
                      >
                        <span
                          className={`p-3 rounded-xl transition-colors ${
                            isSelected ? "bg-primary text-white" : "bg-surface text-text-secondary border border-border"
                          }`}
                        >
                          {renderIcon(opt.iconName, "w-6 h-6")}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-bold text-base leading-tight">
                            {opt.label}
                          </span>
                          <span className="text-xs text-text-secondary mt-1">
                            {opt.baseCost
                              ? `Starting from $${opt.baseCost.toLocaleString()}`
                              : opt.flatCost
                              ? `Adds $${opt.flatCost.toLocaleString()}`
                              : "Tailored metrics apply"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errors[calculatorQuestions[currentStep - 1].id] && (
                  <span className="text-sm text-red-500 font-semibold mt-2 block">
                    {errors[calculatorQuestions[currentStep - 1].id]}
                  </span>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={5}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight mb-2">
                    Submit Project Summary
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Provide your contact details. We will email your detailed pricing estimate and set up a consultation call.
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={clientInfo.name}
                      onChange={handleInputChange}
                      error={hasSubmitted ? errors.name : undefined}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="e.g. john@company.com"
                      value={clientInfo.email}
                      onChange={handleInputChange}
                      error={hasSubmitted ? errors.email : undefined}
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <PhoneInput
                      label="Phone Number"
                      countryCode={clientInfo.countryCode}
                      phone={clientInfo.phone}
                      onChange={({ countryCode, phone }) => {
                        setClientInfo((prev) => ({ ...prev, countryCode, phone }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      error={hasSubmitted ? errors.phone : undefined}
                    />
                    <div className="flex items-start gap-2.5 mt-2.5 w-full text-left">
                      <input
                        id="calculator-whatsapp"
                        name="isWhatsApp"
                        type="checkbox"
                        checked={clientInfo.isWhatsApp}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-primary border-border focus:ring-primary rounded mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="calculator-whatsapp" className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                        This is also my WhatsApp number for faster communications.
                      </label>
                    </div>
                  </div>

                  <Textarea
                    label="Still have any query? Let us know (Optional)"
                    name="query"
                    placeholder="Describe custom features, timeline requests, or technical parameters..."
                    value={clientInfo.query}
                    onChange={handleInputChange}
                    rows={4}
                  />

                  <div className="flex items-start gap-3 mt-2">
                    <input
                      id="calc-subscribe"
                      name="subscribe"
                      type="checkbox"
                      checked={clientInfo.subscribe}
                      onChange={handleCheckboxChange}
                      className="w-4.5 h-4.5 text-primary border-border focus:ring-primary rounded mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="calc-subscribe" className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                      Subscribe to HangingPanda monthly technology audits & product strategy digests.
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {submitError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold leading-relaxed mb-6">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border mt-8 pt-6">
            <Button
              key="prev-btn"
              type="button"
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                key="next-btn"
                type="button"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                key="submit-btn"
                type="submit"
                variant="gradient"
                isLoading={isSubmitting}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Get Cost Estimate
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default CalculatorWizard;
