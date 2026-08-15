import type { Service } from "@/components/sections/Services";
import { SERVICE_MAP, DEFAULT_SERVICE_CONFIG } from "../config/services.config";

export const mapServicesWithIcons = (services: Service[]) => {
  return services.map((service) => {
    // Get the frontend config based on service title
    // @ts-ignore
    const config = SERVICE_MAP[service.title] || DEFAULT_SERVICE_CONFIG;

    return {
      ...service, // Keep all backend data
      // Replace the backend icon with frontend Lucide icon
      icon: config.icon, // This is the Lucide icon component
      color: config.color,
    };
  });
};
