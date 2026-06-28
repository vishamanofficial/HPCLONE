import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Mail, MapPin } from "lucide-react";
import { Facebook, Twitter, Linkedin, Instagram } from "./ui/BrandIcons";
import { servicesData } from "../data/servicesData";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const quickServices = servicesData.slice(0, 5);

  return (
    <footer className="bg-surface text-text-secondary border-t border-border pt-20 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-xl shadow-md">
              HP
            </span>
            <span className="text-lg font-black tracking-tight text-text-primary leading-none">
              HangingPanda
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            AI-powered Software Development Company for Startups & Enterprises. Re-imagining software architectures with security, accessibility, and high performance.
          </p>
          <div className="flex flex-col gap-3.5 mt-2">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>B-64, B Block, Sector 63, Noida, Uttar Pradesh, India, 201301</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <a href="mailto:vishamanofficial.business@gmail.com" className="hover:text-primary transition-colors">
                vishamanofficial.business@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
              <a href="tel:+918887024887" className="hover:text-primary transition-colors">
                +91-8887024887
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-3">
            Our Company
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/career" className="hover:text-primary transition-colors flex items-center gap-2">
                Careers
                <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full font-bold">
                  Hiring
                </span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies-policy" className="hover:text-primary transition-colors">
                Cookies Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-3">
            Recent Work
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/case-studies" className="hover:text-primary transition-colors">
                Marhba Banking App
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="hover:text-primary transition-colors">
                Sallim Telehealth Portal
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="hover:text-primary transition-colors">
                Train Effective Academy
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="hover:text-primary transition-colors">
                Nuzest Headless E-store
              </Link>
            </li>
            <li>
              <Link to="/case-studies" className="hover:text-primary transition-colors">
                Stima Boda IoT Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-text-primary border-l-2 border-primary pl-3">
            Key Offerings
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            {quickServices.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="hover:text-primary transition-colors">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-text-muted">
        <div className="flex items-center gap-1.5">
          <span>&copy; {currentYear} HangingPanda Pvt Ltd. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook profile"
            className="p-2 bg-card border border-border hover:bg-primary hover:text-white rounded-full transition-all text-text-secondary"
          >
            <Facebook className="w-4.5 h-4.5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Twitter profile"
            className="p-2 bg-card border border-border hover:bg-primary hover:text-white rounded-full transition-all text-text-secondary"
          >
            <Twitter className="w-4.5 h-4.5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our LinkedIn profile"
            className="p-2 bg-card border border-border hover:bg-primary hover:text-white rounded-full transition-all text-text-secondary"
          >
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram profile"
            className="p-2 bg-card border border-border hover:bg-primary hover:text-white rounded-full transition-all text-text-secondary"
          >
            <Instagram className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
