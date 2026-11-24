import React from "react";
import Link from "next/link";
import { Smartphone, Mail, MapPin } from "lucide-react";
import { Facebook, Twitter, Linkedin, Instagram } from "./ui/BrandIcons";
import { servicesData } from "@/data/servicesData";
import { siteConfig } from "@/config/site";

interface FooterProps {
  settings?: {
    siteName?: string;
    officeAddress?: string;
    contactEmail?: string;
    contactPhone?: string;
    copyrightText?: string;
    socialLinks?: { facebook?: string; twitter?: string; linkedin?: string; instagram?: string };
  };
  services?: any[];
}

export const Footer: React.FC<FooterProps> = ({
  settings: customSettings,
  services: customServices
}) => {
  const currentYear = new Date().getFullYear();
  const quickServices = (customServices && customServices.length > 0 ? customServices : servicesData).slice(0, 5);

  const settings = {
    officeAddress: customSettings?.officeAddress || siteConfig.address.full,
    contactEmail: customSettings?.contactEmail || siteConfig.emails.contact,
    contactPhone: customSettings?.contactPhone || siteConfig.phone,
    copyrightText: customSettings?.copyrightText || siteConfig.getCopyright(currentYear),
    socialLinks: {
      facebook: customSettings?.socialLinks?.facebook || siteConfig.socialLinks.facebook,
      twitter: customSettings?.socialLinks?.twitter || siteConfig.socialLinks.twitter,
      linkedin: customSettings?.socialLinks?.linkedin || siteConfig.socialLinks.linkedin,
      instagram: customSettings?.socialLinks?.instagram || siteConfig.socialLinks.instagram
    }
  };

  return (
    <footer className="bg-surface text-text-secondary border-t border-border pt-20 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-xl shadow-md">
              {siteConfig.shortName}
            </span>
            <span className="text-lg font-black tracking-tight text-text-primary leading-none">
              {customSettings?.siteName || siteConfig.name}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            AI-powered Software Development Company for Startups & Enterprises. Re-imagining software architectures with security, accessibility, and high performance.
          </p>
          <div className="flex flex-col gap-3.5 mt-2">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{settings.officeAddress}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-primary transition-colors">
                {settings.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
              <a href={`tel:${settings.contactPhone}`} className="hover:text-primary transition-colors">
                {settings.contactPhone}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-caption text-text-muted">
            Our Company
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/career" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                Careers
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold">
                  Hiring
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies-policy" className="hover:text-primary transition-colors">
                Cookies Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-caption text-text-muted">
            Recent Work
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/case-studies" className="hover:text-primary transition-colors">
                Marhba Banking App
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="hover:text-primary transition-colors">
                Sallim Telehealth Portal
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="hover:text-primary transition-colors">
                Train Effective Academy
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="hover:text-primary transition-colors">
                Nuzest Headless E-store
              </Link>
            </li>
            <li>
              <Link href="/case-studies" className="hover:text-primary transition-colors">
                Stima Boda IoT Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-caption text-text-muted">
            Key Offerings
          </p>
          <ul className="flex flex-col gap-2.5 text-sm">
            {quickServices.map((service) => (
              <li key={service.slug || service.id}>
                <Link href={`/services/${service.slug || service.id}`} className="hover:text-primary transition-colors">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-text-muted">
        <div className="flex items-center gap-1.5">
          <span>{settings.copyrightText}</span>
        </div>

        <div className="flex items-center gap-3">
          {settings.socialLinks.facebook && (
            <a
              href={settings.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook profile"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center text-text-secondary cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {settings.socialLinks.twitter && (
            <a
              href={settings.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Twitter profile"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center text-text-secondary cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {settings.socialLinks.linkedin && (
            <a
              href={settings.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn profile"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center text-text-secondary cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {settings.socialLinks.instagram && (
            <a
              href={settings.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram profile"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-all flex items-center justify-center text-text-secondary cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
export default Footer;
