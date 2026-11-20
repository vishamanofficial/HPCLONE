import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "orange" | "pink" | "outline" | "ghost" | "gradient" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  // Apple HIG: Minimum 44x44pt hit region, subtle spring press state, visible focus
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

  const sizeClasses = {
    sm: "min-h-[36px] px-3.5 py-1.5 text-xs gap-1.5",
    md: "min-h-[44px] px-5 py-2.5 text-sm gap-2",
    lg: "min-h-[48px] px-7 py-3 text-base font-semibold gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow active:bg-primary-hover/90",
    secondary:
      "bg-surface border border-border text-text-primary hover:bg-card hover:border-text-muted/30 shadow-xs",
    orange:
      "bg-accent-orange text-white hover:opacity-90 shadow-sm",
    pink:
      "bg-accent-pink text-white hover:opacity-90 shadow-sm",
    outline:
      "bg-transparent border border-border text-text-primary hover:border-primary hover:text-primary",
    ghost:
      "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary",
    gradient:
      "bg-gradient-to-r from-primary to-accent-orange text-white shadow-sm hover:shadow-md hover:brightness-105",
    glass:
      "apple-glass text-text-primary hover:border-primary/40 shadow-xs",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span className="leading-none">{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
export default Button;
