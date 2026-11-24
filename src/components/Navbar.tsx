"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Calculator,
  Sparkles
} from "lucide-react";
import { servicesData } from "@/data/servicesData";
import { Button } from "./ui/Button";
import { siteConfig } from "@/config/site";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDrop, setShowServicesDrop] = useState(false);
  const [servicesList] = useState<any[]>(servicesData);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowServicesDrop(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? "apple-glass py-3 border-b border-border/50 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-10 h-10 rounded-[12px] bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-lg shadow-sm shadow-primary/20 transition-transform duration-200 group-hover:scale-[1.03]">
              {siteConfig.shortName}
            </span>
            <div className="flex flex-col">
              <span className="text-[17px] font-bold tracking-headline text-text-primary group-hover:text-primary transition-colors leading-tight">
                {siteConfig.name}
              </span>
              <span className="text-[10px] tracking-caption uppercase font-semibold text-text-muted">
                {siteConfig.subName}
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full apple-glass-clear">
            <Link
              href="/"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center ${
                isActive("/")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              Home
            </Link>
            
            <Link
              href="/pandanextai"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center gap-1.5 ${
                isActive("/pandanextai")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              PandaNext AI
            </Link>

            <Link
              href="/about"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center ${
                isActive("/about")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              About Us
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowServicesDrop(true)}
              onMouseLeave={() => setShowServicesDrop(false)}
            >
              <button
                aria-haspopup="true"
                aria-expanded={showServicesDrop}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1 transition-all duration-150 cursor-pointer ${
                  showServicesDrop || pathname.includes("/services/")
                    ? "bg-card text-primary shadow-xs font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
                }`}
              >
                Services
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showServicesDrop ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showServicesDrop && (
                <div className="absolute top-full -left-40 w-[600px] pt-3 z-50">
                  <div role="menu" className="apple-glass rounded-2xl p-5 grid grid-cols-2 gap-3 shadow-2xl">
                    {servicesList.map((service) => (
                      <Link
                        key={service.slug || service.id}
                        href={`/services/${service.slug || service.id}`}
                        role="menuitem"
                        className="p-3 rounded-xl hover:bg-surface/80 border border-transparent hover:border-border/60 transition-all duration-150 flex flex-col gap-1 group"
                      >
                        <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                          {service.title}
                        </span>
                        <span className="text-xs text-text-secondary line-clamp-1">
                          {service.shortDesc}
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-2 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                      <span>Need an enterprise architecture review?</span>
                      <Link
                        href="/contact"
                        role="menuitem"
                        className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Consult an Engineer &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/case-studies"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center ${
                isActive("/case-studies")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/blog"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center ${
                isActive("/blog")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 inline-flex items-center ${
                isActive("/contact")
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full hover:bg-surface border border-border text-text-secondary hover:text-text-primary transition-all duration-150 flex items-center justify-center cursor-pointer"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle light and dark theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            <Link href="/app-cost-calculator">
              <Button variant="primary" size="md" leftIcon={<Calculator className="w-4 h-4" />}>
                Cost Calculator
              </Button>
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface/80 border border-border/60 text-text-secondary transition-colors flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Toggle light and dark theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface/80 border border-border/60 text-text-secondary transition-colors flex items-center justify-center cursor-pointer active:scale-95"
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
            >
              {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className={`fixed inset-0 z-40 apple-glass border-t border-border overflow-y-auto px-6 py-8 flex flex-col gap-6 lg:hidden transition-all duration-300 ${
            isScrolled ? "top-[64px]" : "top-[76px]"
          }`}
        >
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center ${
                isActive("/") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              Home
            </Link>
            
            <Link
              href="/pandanextai"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-2.5 ${
                isActive("/pandanextai") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5 text-primary" />
              PandaNext AI
            </Link>

            <Link
              href="/about"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center ${
                isActive("/about") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              About Us
            </Link>

            <div className="flex flex-col">
              <button
                onClick={() => setShowServicesDrop(!showServicesDrop)}
                className="min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between text-text-primary hover:bg-surface/60 transition-all duration-150 cursor-pointer"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showServicesDrop ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showServicesDrop && (
                <div className="pl-4 flex flex-col gap-1 mt-1 border-l-2 border-primary/20 ml-5">
                  {servicesList.map((service) => (
                    <Link
                      key={service.slug || service.id}
                      href={`/services/${service.slug || service.id}`}
                      className="min-h-[40px] text-sm font-medium px-3 py-2 text-text-secondary hover:text-primary transition-colors flex items-center"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/case-studies"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center ${
                isActive("/case-studies") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              Portfolio
            </Link>

            <Link
              href="/blog"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center ${
                isActive("/blog") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              className={`min-h-[44px] text-base font-semibold px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center ${
                isActive("/contact") ? "bg-primary/10 text-primary font-bold" : "text-text-primary hover:bg-surface/60"
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="mt-auto border-t border-border pt-6">
            <Link href="/app-cost-calculator">
              <Button
                variant="primary"
                className="w-full justify-center min-h-[48px]"
                leftIcon={<Calculator className="w-4 h-4" />}
              >
                Cost Calculator
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
