import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  hoverable = false,
  onClick,
}) => {
  const variantStyles = {
    default: "bg-white border border-gray-200",
    bordered: "bg-white border-2 border-gray-200",
    elevated: "bg-white shadow-lg border border-gray-100",
    gradient:
      "bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
