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
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-secondary tracking-caption uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-text-muted inline-flex pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full min-h-[44px] px-3.5 py-2.5 bg-surface border rounded-xl text-base md:text-sm text-text-primary transition-all duration-150 ease-out placeholder:text-text-muted/60 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              leftIcon ? "pl-10" : ""
            } ${
              error
                ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-border hover:border-text-muted/40"
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
