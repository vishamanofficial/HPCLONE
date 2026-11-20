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
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-text-secondary tracking-caption uppercase"
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
          className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-base md:text-sm text-text-primary transition-all duration-150 ease-out placeholder:text-text-muted/60 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[96px] custom-scrollbar ${
            error
              ? "border-red-500 ring-1 ring-red-500 focus:border-red-500"
              : "border-border hover:border-text-muted/40"
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
