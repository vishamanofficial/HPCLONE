import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, leftIcon, type = "text", id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-secondary tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-text-muted inline-flex pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full px-4 py-3 bg-surface border rounded-lg text-base md:text-sm text-text-primary transition-all duration-300 placeholder:text-text-muted/60 focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary ${
              leftIcon ? "pl-11" : ""
            } ${
              error
                ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-border"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span id={`${inputId}-error`} className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
