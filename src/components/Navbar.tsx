import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Calculator,
  Sparkles
} from "lucide-react";
import { servicesData } from "../data/servicesData";
import { Button } from "./ui/Button";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServicesDrop, setShowServicesDrop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowServicesDrop(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/85 backdrop-blur-md border-b border-border shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            HP
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-text-primary group-hover:text-primary transition-colors leading-none">
              HangingPanda
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-text-muted">
              Software Labs
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/pandanextai"
            className={({ isActive }) =>
              `text-sm font-semibold flex items-center gap-1.5 transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            PandaNext AI
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            About Us
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setShowServicesDrop(true)}
            onMouseLeave={() => setShowServicesDrop(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={showServicesDrop}
              className={`text-sm font-semibold flex items-center gap-1 transition-colors hover:text-primary ${
                showServicesDrop || location.pathname.includes("/services/")
                  ? "text-primary"
                  : "text-text-secondary"
              }`}
            >
              Services
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  showServicesDrop ? "rotate-180" : ""
                }`}
              />
            </button>

            {showServicesDrop && (
              <div className="absolute top-full -left-48 w-[640px] pt-4 z-50">
                <div role="menu" className="bg-card border border-border shadow-2xl rounded-2xl p-6 grid grid-cols-2 gap-4">
                  {servicesData.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      role="menuitem"
                      className="p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all flex flex-col gap-1 group"
                    >
                      <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
                        {service.title}
                      </span>
                      <span className="text-xs text-text-secondary line-clamp-1">
                        {service.shortDesc}
                      </span>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-2 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                    <span>Need a custom software consultation?</span>
                    <Link
                      to="/contact"
                      role="menuitem"
                      className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Write to our Experts &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/case-studies"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            Blogs
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors hover:text-primary ${
                isActive ? "text-primary" : "text-text-secondary"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-surface border border-border text-text-secondary hover:text-primary transition-colors"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle light and dark theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/app-cost-calculator">
            <Button variant="gradient" size="md" leftIcon={<Calculator className="w-4 h-4" />}>
              Cost Calculator
            </Button>
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface text-text-secondary transition-colors"
            aria-label="Toggle light and dark theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-surface text-text-secondary transition-colors"
            aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 top-[72px] bg-card z-40 border-t border-border overflow-y-auto px-6 py-8 flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              Home
            </NavLink>
            
            <NavLink
              to="/pandanextai"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl flex items-center gap-2 ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              <Sparkles className="w-5 h-5 text-primary" />
              PandaNext AI
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              About Us
            </NavLink>

            <div className="flex flex-col">
              <button
                onClick={() => setShowServicesDrop(!showServicesDrop)}
                className="text-lg font-bold p-2 rounded-xl flex items-center justify-between text-text-primary"
              >
                Services
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showServicesDrop ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showServicesDrop && (
                <div className="pl-4 flex flex-col gap-2 mt-2 border-l border-border/80 ml-4">
                  {servicesData.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="text-sm font-semibold py-1.5 text-text-secondary hover:text-primary transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/case-studies"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              Portfolio
            </NavLink>

            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              Blogs
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-lg font-bold p-2 rounded-xl ${
                  isActive ? "bg-primary/10 text-primary" : "text-text-primary"
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="mt-auto border-t border-border pt-6">
            <Link to="/app-cost-calculator">
              <Button
                variant="gradient"
                className="w-full justify-center"
                leftIcon={<Calculator className="w-4 h-4" />}
              >
                Run Cost Calculator
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
