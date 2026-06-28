import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countryCodes } from "../../data/countryCodes";
import type { Country } from "../../data/countryCodes";

interface PhoneInputProps {
  label?: string;
  countryCode: string;
  phone: string;
  error?: string;
  onChange: (payload: { countryCode: string; phone: string }) => void;
  placeholder?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  countryCode,
  phone,
  error,
  onChange,
  placeholder = "e.g. 93116 75528"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected country
  const selectedCountry = countryCodes.find((c) => c.dialCode === countryCode) || {
    flag: "🇮🇳",
    dialCode: "+91",
    name: "India"
  };

  // Filter countries based on search query
  const filteredCountries = countryCodes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dialCode.includes(searchQuery)
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectCountry = (country: Country) => {
    onChange({ countryCode: country.dialCode, phone });
    setIsOpen(false);
    setSearchQuery("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ countryCode, phone: e.target.value });
  };

  return (
    <div className="w-full flex flex-col gap-1.5 relative text-left" ref={dropdownRef}>
      {label && (
        <label className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
          {label}
        </label>
      )}
      
      <div className="flex gap-2 items-start relative">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-1 px-3 py-3 bg-surface border border-border rounded-lg text-sm text-text-primary hover:bg-card focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-300 h-[46px] min-w-[95px] cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-base select-none">{selectedCountry.flag}</span>
            <span className="font-medium text-xs sm:text-sm">{selectedCountry.dialCode}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        </button>

        {/* Phone Digits Input */}
        <div className="flex-grow">
          <input
            type="tel"
            placeholder={placeholder}
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-3 bg-surface border rounded-lg text-sm text-text-primary transition-all duration-300 placeholder:text-text-muted/60 focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary h-[46px] ${
              error ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500" : "border-border"
            }`}
          />
        </div>

        {/* Custom Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-[52px] left-0 z-50 w-72 max-h-64 overflow-hidden bg-card border border-border rounded-xl shadow-2xl flex flex-col">
            {/* Search Box */}
            <div className="p-2 border-b border-border flex items-center gap-3.5 bg-surface">
              <Search className="w-3.5 h-3.5 text-text-muted" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-text-primary border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent [box-shadow:none] focus-visible:[box-shadow:none] placeholder:text-text-muted/50 py-1"
              />
            </div>

            {/* Country List */}
            <div className="overflow-y-auto max-h-48 p-1 scrollbar-thin">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={`${c.code}-${c.dialCode}`}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className={`flex items-center justify-between w-full px-2.5 py-2 text-left rounded-lg text-xs hover:bg-primary/10 hover:text-primary transition-all cursor-pointer ${
                      c.dialCode === countryCode ? "bg-primary/5 text-primary font-medium" : "text-text-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <span className="text-base select-none">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="text-text-muted text-[11px] font-mono flex-shrink-0">
                      {c.dialCode}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-text-muted">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>
      )}
    </div>
  );
};

export default PhoneInput;
