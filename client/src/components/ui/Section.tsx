import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "light" | "brand" | "gradient";
  padding?: "sm" | "md" | "lg" | "xl" | "none";
}

const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id = "",
  background = "white",
  padding = "lg",
}) => {
  const backgroundClasses = {
    white: "bg-white",
    light: "bg-brand-light/30",
    brand: "bg-brand-primary text-white",
    gradient:
      "bg-gradient-to-br from-brand-primary to-brand-secondary text-white",
  };

  const paddingClasses = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
    xl: "py-20 md:py-32",
    none: "py-0",
  };

  return (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Section;
