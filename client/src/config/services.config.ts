import {
  TrendingUp,
  Video,
  Share2,
  Users,
  Palette,
  Film,
  Briefcase,
  Lightbulb,
} from "lucide-react";

// Your frontend icon and color configuration
export const SERVICE_MAP = {
  "Content Strategy": {
    icon: TrendingUp,
    color: "from-blue-500/10 to-blue-600/10",
  },
  "Content Creation": {
    icon: Video,
    color: "from-purple-500/10 to-purple-600/10",
  },
  "Social Media Marketing": {
    icon: Share2,
    color: "from-pink-500/10 to-pink-600/10",
  },
  "Social Media Management": {
    icon: Users,
    color: "from-orange-500/10 to-orange-600/10",
  },
  Branding: {
    icon: Palette,
    color: "from-green-500/10 to-green-600/10",
  },
  "Commercial Video Production": {
    icon: Film,
    color: "from-red-500/10 to-red-600/10",
  },
  "Business Development": {
    icon: Briefcase,
    color: "from-indigo-500/10 to-indigo-600/10",
  },
  "Marketing Consulting": {
    icon: Lightbulb,
    color: "from-yellow-500/10 to-yellow-600/10",
  },
};

export type ServiceConfig = (typeof SERVICE_MAP)[keyof typeof SERVICE_MAP][];

// Default fallback for any service not in the map
export const DEFAULT_SERVICE_CONFIG = {
  icon: TrendingUp,
  color: "from-gray-500/10 to-gray-600/10",
};
