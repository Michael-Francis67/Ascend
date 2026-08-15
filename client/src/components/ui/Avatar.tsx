import React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className,
  onClick,
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };

  const getInitials = () => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden bg-brand-primary/10 text-brand-primary font-bold",
        sizes[size],
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className,
      )}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        getInitials()
      ) : (
        <User
          size={
            size === "sm" ? 16 : size === "md" ? 20 : size === "lg" ? 28 : 40
          }
        />
      )}
    </div>
  );
};

export default Avatar;
