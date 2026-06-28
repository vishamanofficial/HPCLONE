import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface" | "bordered" | "gradient";
  hoverEffect?: "scale" | "shadow" | "glow" | "none";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  hoverEffect = "scale",
  ...props
}) => {
  const baseClasses =
    "p-6 rounded-card transition-all duration-300 relative overflow-hidden";

  const variantClasses = {
    default: "bg-card border border-border shadow-sm",
    surface: "bg-surface border border-transparent shadow-sm",
    bordered: "bg-transparent border border-border",
    gradient: "bg-gradient-to-br from-surface to-card border border-border shadow-sm",
  };

  const hoverClasses = {
    scale: "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5",
    shadow: "hover:shadow-lg",
    glow: "hover:shadow-md hover:shadow-primary/10 hover:border-primary/30",
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
