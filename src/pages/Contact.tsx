import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ShieldCheck, Cpu, Layers, Globe, Building2, Sparkles } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PhoneInput } from "../components/ui/PhoneInput";

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const fadeInUp = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.4 }
      }
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" as const }
      };

  const contactWorkflow = [
    { title: "NDA Guidelines", desc: "Within 4 hours, our advisory partners sign standard NDAs to protect your intellectual ideas.", icon: ShieldCheck },
    { title: "Diagnostic Analysis", desc: "Our engineering directors review your project requirements and list recommended tech stacks.", icon: Cpu },
    { title: "Scoping Session", desc: "Schedule a 30-minute scoping call to map deliverables to 2-week milestones.", icon: Sparkles },
    { title: "Cost Blueprint", desc: "Receive a detailed cost estimation blueprint representing exact sprint costs.", icon: Layers }
  ];

  const locations = [
    { city: "Noida, UP", type: "Main Engineering Headquarters", address: "B-64, B Block, Sector 63, Noida, 201301", icon: Building2 },
    { city: "Bangalore, KA", type: "Technical Operations Hub", address: "Outer Ring Rd, Bellandur, Bangalore, 560103", icon: Globe }
  ];


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    subject: "",
    service: "",
    message: "",
    subscribe: false,
    isWhatsApp: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const formErrors: Record<string, string> = {};

    if (!formData.name.trim()) formErrors.name = "Name is required";
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      formErrors.phone = "Phone number is required";
    } else if (!/^\d{6,15}$/.test(cleanPhone.replace(/[\s()-]/g, ""))) {
      formErrors.phone = "Please enter a valid phone number (6 to 15 digits)";
    }

    if (!formData.service) {
      formErrors.service = "Please select a service category";
    }

    if (!formData.message.trim()) {
      formErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      formErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          ...formData,
          phone: `${formData.countryCode} ${formData.phone}`,
          "Is WhatsApp Number": formData.isWhatsApp ? "Yes" : "No",
          from_name: formData.name,
          subject: `New inquiry from HangingPanda: ${formData.subject}`
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        navigate("/thank-you", {
          state: {
            clientName: formData.name,
            contactSuccess: true
          }
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setSubmitError("There was an error sending your inquiry. Please try again or email us directly at vishamanofficial.business@gmail.com.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Custom Software Consultation | HangingPanda</title>
        <meta
          name="description"
          content="Get in touch with HangingPanda. Write your project requirements for mobile apps, custom SaaS databases, or request audits. B-64 Noida Sector 63."
        />
        <link rel="canonical" href="https://hangingpanda.com/contact" />
        <meta property="og:title" content="Contact Us | Custom Software Consultation | HangingPanda" />
        <meta property="og:description" content="Get in touch with HangingPanda. Write your project requirements for mobile apps, custom SaaS databases, or request audits. B-64 Noida Sector 63." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hangingpanda.com/contact" />
        <meta property="og:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Custom Software Consultation | HangingPanda" />
        <meta name="twitter:description" content="Get in touch with HangingPanda. Write your project requirements for mobile apps, custom SaaS databases, or request audits. B-64 Noida Sector 63." />
        <meta name="twitter:image" content="https://hangingpanda.com/og-image.jpg" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <section className="bg-gradient-to-b from-surface to-bg py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3 inline-block">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
            Let's Blueprint Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange">Software Product</span>.
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
            Contact our engineering squad. We sign NDAs before initial diagnostic reviews to protect your intellectual ideas.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col items-start text-left gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-black text-text-primary tracking-tight">
              Direct Contact Details
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              We respond to initial requests within 12 business hours.
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary mt-0.5">
                <MapPin className="w-6 h-6" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Office Address</span>
                <span className="text-sm font-semibold text-text-primary">
                  B-64, B Block, Sector 63, Noida, Uttar Pradesh, India, 201301
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary mt-0.5">
                <Mail className="w-6 h-6" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Coordinates</span>
                <a href="mailto:vishamanofficial.business@gmail.com" className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                  vishamanofficial.business@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary mt-0.5">
                <Phone className="w-6 h-6" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Call Coordinates</span>
                <a href="tel:+918887024887" className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                  +91-8887024887
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl text-left">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Name"
                name="name"
                placeholder="e.g. Jane Smith"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col w-full">
                <PhoneInput
                  label="Phone Number"
                  countryCode={formData.countryCode}
                  phone={formData.phone}
                  onChange={({ countryCode, phone }) => {
                    setFormData((prev) => ({ ...prev, countryCode, phone }));
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  error={errors.phone}
                />
                <div className="flex items-start gap-2.5 mt-2 w-full text-left">
                  <input
                    id="contact-whatsapp"
                    name="isWhatsApp"
                    type="checkbox"
                    checked={formData.isWhatsApp}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-primary border-border focus:ring-primary rounded mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="contact-whatsapp" className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                    This is also my WhatsApp number for faster communications.
                  </label>
                </div>
              </div>
              <Input
                label="Subject (Optional)"
                name="subject"
                placeholder="e.g. Requesting technical audit"
                value={formData.subject}
                onChange={handleInputChange}
              />
            </div>

            <Select
              label="Interested in"
              name="service"
              placeholder="Choose a category"
              value={formData.service}
              onChange={handleInputChange}
              options={[
                { value: "web-design", label: "Website design" },
                { value: "app-dev", label: "App development" },
                { value: "crm-design", label: "CRM design" },
                { value: "graphic-design", label: "Graphic design" },
                { value: "ui-ux", label: "UI/UX design" },
                { value: "other", label: "Other" }
              ]}
            />

            <Textarea
              label="Message (Optional)"
              name="message"
              placeholder="Describe your project, tech stack requirements, or questions..."
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
            />

            <div className="flex items-start gap-3 mt-2">
              <input
                id="contact-subscribe"
                name="subscribe"
                type="checkbox"
                checked={formData.subscribe}
                onChange={handleCheckboxChange}
                className="w-4.5 h-4.5 text-primary border-border focus:ring-primary rounded mt-0.5 cursor-pointer"
              />
              <label htmlFor="contact-subscribe" className="text-xs text-text-secondary leading-snug cursor-pointer select-none">
                Subscribe to our Newsletter.
              </label>
            </div>

            {submitError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold leading-relaxed mt-2">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="mt-4 justify-center"
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send your inquiry
            </Button>
          </form>
        </div>
      </section>
      {/* Post-Inquiry Workflow FAQ */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div {...fadeInUp}>
              <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
                THE WORKFLOW
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
                What Happens Next?
              </h2>
              <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
                We respect your confidentiality. Here is the step-by-step path from your submit request to blueprint delivery.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {contactWorkflow.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div key={idx} {...fadeInUp}>
                  <Card hoverEffect="glow" className="flex flex-col gap-4 p-6 bg-card border border-border/80 h-full relative">
                    <span className="absolute top-4 right-4 text-xs font-black text-primary/20">
                      0{idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-sm text-text-primary mt-2">{step.title}</h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      {step.desc}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Presence & Technical Centers */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div {...fadeInUp}>
            <span className="block text-xs font-black text-primary tracking-widest uppercase mb-3">
              OUR CENTERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
              Global Engineering Locations
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto mt-4">
              Our offshore developers and systems analysts operate from key technical centers.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {locations.map((loc, idx) => {
            const LocIcon = loc.icon;
            return (
              <motion.div key={idx} {...fadeInUp}>
                <Card hoverEffect="shadow" className="flex flex-col gap-4 p-6 sm:p-8 bg-card border border-border/80 h-full justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
                        <LocIcon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-text-primary leading-tight">{loc.city}</h3>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mt-0.5">{loc.type}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-4 border-t border-border/40 pt-4">
                      {loc.address}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};
export default Contact;
