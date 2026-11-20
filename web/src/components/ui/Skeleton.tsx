import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  ...props
}) => {
  const baseClasses = "animate-pulse bg-text-muted/20";

  const variantClasses = {
    text: "h-4 w-full rounded",
    rectangular: "h-32 w-full rounded-xl",
    circular: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};
export default Skeleton;
