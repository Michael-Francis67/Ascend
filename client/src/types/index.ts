export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
}

export interface Section {
  id: string;
  key: string;
  title: string;
  content: any; // JSON field for flexible content
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  results: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  quote: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
