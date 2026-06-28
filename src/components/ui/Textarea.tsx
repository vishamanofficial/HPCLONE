import React, { forwardRef, useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, id, rows = 4, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = id || defaultId;
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-text-secondary tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={`w-full px-4 py-3 bg-surface border rounded-lg text-sm text-text-primary transition-all duration-300 placeholder:text-text-muted/60 focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary resize-y ${
            error
              ? "border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-border"
          } ${className}`}
          {...props}
        />
        {error && <span id={`${textareaId}-error`} className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
