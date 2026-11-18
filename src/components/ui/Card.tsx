import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface" | "bordered" | "gradient" | "glass";
  hoverEffect?: "scale" | "shadow" | "glow" | "none";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hoverEffect = "scale",
  ...props
}) => {
  // Apple HIG: Standard materials for content layer with smooth continuous radii & subtle specular edges
  const baseClasses =
    "p-6 sm:p-7 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden";

  const variantClasses = {
    default: "bg-card border border-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.02)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]",
    surface: "bg-surface border border-border/60 shadow-xs",
    bordered: "bg-transparent border border-border",
    gradient: "bg-gradient-to-b from-card to-surface border border-border shadow-xs",
    glass: "apple-glass",
  };

  const hoverClasses = {
    scale: "hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.08)] hover:border-primary/30",
    shadow: "hover:shadow-md hover:border-border",
    glow: "hover:shadow-[0_0_20px_rgba(220,38,38,0.12)] hover:border-primary/40",
    none: "",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses[hoverEffect]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
