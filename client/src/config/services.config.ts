import type { Service } from "@/components/sections/Services";
import {
  TrendingUp,
  Video,
  Share2,
  Users,
  Palette,
  Film,
  Briefcase,
  Lightbulb,
  ArrowRight,
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

export const mockServices: Service[] = [
  {
    id: "1",
    title: "Content Strategy",
    description:
      "Developing data-driven content strategies that align with your business goals and speak directly to your ideal audience.",
    icon: TrendingUp,
    color: "from-blue-500/10 to-blue-600/10",
    image: null,
    isActive: true,
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Content Creation",
    description:
      "Professional videos, photography, commercials, and creative assets designed to elevate your brand.",
    icon: Video,
    color: "from-purple-500/10 to-purple-600/10",
    image: null,
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Social Media Marketing",
    description:
      "Helping businesses grow online through strategic content distribution and audience engagement.",
    icon: Share2,
    color: "from-pink-500/10 to-pink-600/10",
    image: null,
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Social Media Management",
    description:
      "Managing your social presence with planning, publishing, optimization, and community management.",
    icon: Users,
    color: "from-orange-500/10 to-orange-600/10",
    image: null,
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Branding",
    description:
      "Creating memorable identities that position your business for long-term success.",
    icon: Palette,
    color: "from-green-500/10 to-green-600/10",
    image: null,
    isActive: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Commercial Video Production",
    description:
      "Producing cinematic commercials and promotional videos that tell your story and inspire action.",
    icon: Film,
    color: "from-red-500/10 to-red-600/10",
    image: null,
    isActive: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Business Development",
    description:
      "Helping businesses identify opportunities, improve positioning, and expand sustainably.",
    icon: Briefcase,
    color: "from-indigo-500/10 to-indigo-600/10",
    image: null,
    isActive: true,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Marketing Consulting",
    description:
      "Providing strategic guidance that helps businesses make smarter marketing decisions.",
    icon: Lightbulb,
    color: "from-yellow-500/10 to-yellow-600/10",
    image: null,
    isActive: true,
    order: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
