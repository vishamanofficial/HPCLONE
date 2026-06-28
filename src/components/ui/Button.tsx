import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "orange" | "pink" | "outline" | "ghost" | "gradient";
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
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-button transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-sm";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base font-semibold",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20",
    secondary:
      "bg-surface border border-border text-text-primary hover:bg-border/30 hover:text-text-primary",
    orange:
      "bg-accent-orange text-white hover:bg-orange-700 hover:shadow-lg hover:shadow-accent-orange/20",
    pink:
      "bg-accent-pink text-white hover:bg-pink-700 hover:shadow-lg hover:shadow-accent-pink/20",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary/10",
    ghost:
      "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary",
    gradient:
      "bg-gradient-to-r from-primary to-accent-orange text-white hover:shadow-lg hover:shadow-primary/30 hover:brightness-110",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      <span className="leading-none">{children}</span>
      {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  );
};
export default Button;
