import React, { forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, options = [], placeholder, id, children, ...props }, ref) => {
    const defaultId = useId();
    const selectId = id || defaultId;
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-text-secondary tracking-caption uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={`w-full min-h-[44px] px-3.5 py-2.5 bg-surface border rounded-xl text-base md:text-sm text-text-primary transition-all duration-150 ease-out focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer pr-10 ${
              error
                ? "border-red-500 ring-1 ring-red-500 focus:border-red-500"
                : "border-border hover:border-text-muted/40"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
          </select>
          <span className="absolute right-3.5 text-text-muted pointer-events-none inline-flex">
            <ChevronDown className="w-4 h-4" />
          </span>
        </div>
        {error && <span id={`${selectId}-error`} className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
