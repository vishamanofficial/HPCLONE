import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

export const Contact: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    message: "",
    subscribe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.name.trim()) formErrors.name = "Required";
    if (!formData.email.trim()) {
      formErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) formErrors.phone = "Required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/thank-you", {
        state: {
          clientName: formData.name,
          contactSuccess: true
        }
      });
    }, 1500);
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
                <a href="mailto:connect@hangingpanda.com" className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                  connect@hangingpanda.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary mt-0.5">
                <Phone className="w-6 h-6" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Call Coordinates</span>
                <a href="tel:+919311781537" className="text-sm font-semibold text-text-primary hover:text-primary transition-colors">
                  +91-9311781537
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
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="e.g. +91 93116 75528"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />
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
    </>
  );
};
export default Contact;
