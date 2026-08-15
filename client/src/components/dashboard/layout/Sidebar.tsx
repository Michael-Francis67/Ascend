import {
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { cn } from "../../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/dashboard/sections", icon: FileText, label: "Sections" },
  { path: "/dashboard/projects", icon: Home, label: "Projects" },
  { path: "/dashboard/services", icon: Briefcase, label: "Services" },
  { path: "/dashboard/trusted-by", icon: Building2, label: "Trusted By" },
  {
    path: "/dashboard/testimonials",
    icon: MessageSquare,
    label: "Testimonials",
  },
  { path: "/dashboard/team", icon: Users, label: "Team" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const bottomMenuItems = [
  { path: "/dashboard/help", icon: HelpCircle, label: "Help & Support" },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  variant = "desktop",
}) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const sidebarClasses = cn(
    "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
    variant === "mobile" ? "fixed inset-y-0 left-0 z-50 w-72" : "relative",
    variant === "mobile" && !isOpen && "-translate-x-full",
    variant === "desktop" && isOpen ? "w-64" : "w-20",
    variant === "desktop" && !isOpen && "w-20",
  );

  const logoClasses = cn(
    "flex items-center h-16 border-b border-gray-200",
    isOpen ? "px-4" : "px-2 justify-center",
  );

  const linkClasses = (path: string) =>
    cn(
      "flex items-center rounded-lg transition-all duration-200",
      isActive(path)
        ? "bg-brand-primary/10 text-brand-primary"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      isOpen ? "px-4 py-3 mx-2" : "px-2 py-3 mx-1 justify-center",
    );

  const iconClasses = cn("flex-shrink-0", isOpen ? "mr-3" : "mr-0");

  const labelClasses = cn(
    "text-sm font-medium transition-opacity duration-200 hidden md:block",
    isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
  );

  return (
    <aside className={sidebarClasses}>
      {/* Logo */}
      <div className={logoClasses}>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          {isOpen && (
            <span className="text-xl hidden md:block font-bold text-brand-primary whitespace-nowrap">
              ASCEND
            </span>
          )}
        </Link>
        {variant === "desktop" && (
          <button
            onClick={onToggle}
            className={cn(
              "p-1 rounded-lg hover:bg-gray-100 transition-colors",
              isOpen ? "ml-auto" : "mt-2",
            )}
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        {variant === "mobile" && (
          <button
            onClick={onToggle}
            className="ml-auto p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div
        className={cn(
          "flex items-center gap-3 border-b border-gray-200 py-4",
          isOpen ? "px-4" : "px-2 justify-center",
        )}
      >
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-brand-primary font-bold text-sm">
            {user?.name?.charAt(0) || "A"}
          </span>
        </div>
        {isOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "admin@ascend.com"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          <p
            className={cn(
              "text-xs font-semibold text-gray-400 uppercase tracking-wider",
              isOpen ? "px-4 mb-2" : "sr-only",
            )}
          >
            Main Menu
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClasses(item.path)}
            >
              <item.icon size={20} className={iconClasses} />
              <span className={labelClasses}>{item.label}</span>
            </Link>
          ))}
        </div>

        <div
          className={cn(
            "border-t border-gray-200 mt-4 pt-4",
            isOpen ? "mx-4" : "mx-2",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold text-gray-400 uppercase tracking-wider",
              isOpen ? "px-4 mb-2" : "sr-only",
            )}
          >
            Support
          </p>
          {bottomMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={linkClasses(item.path)}
            >
              <item.icon size={20} className={iconClasses} />
              <span className={labelClasses}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-gray-200 py-4",
          isOpen ? "px-4" : "px-2",
        )}
      >
        <button
          onClick={logout}
          className={cn(
            "flex items-center w-full rounded-lg transition-colors text-red-600 hover:bg-red-50",
            isOpen ? "px-4 py-3" : "px-2 py-3 justify-center",
          )}
        >
          <LogOut size={20} className={isOpen ? "mr-3" : ""} />
          <span
            className={cn(
              "text-sm font-medium transition-opacity duration-200",
              isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
            )}
          >
            Logout
          </span>
        </button>

        {isOpen && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">ASCEND v1.0.0</p>
            <p className="text-xs text-gray-400">
              Building Businesses. Scaling Brands.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
