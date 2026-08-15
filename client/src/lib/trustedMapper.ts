import type { Trusted } from "@/components/sections/TrustedBy";
import { TEAM_CONFIG, DEFAULT_TEAM_CONFIG } from "../config/team.config";

export const mapTrustedWithColors = (trusted: Trusted) => {
  return trusted.content.clients.map((client) => {
    // Get the frontend config based on service title
    // @ts-ignore
    const config = TEAM_CONFIG[client.name] || DEFAULT_TEAM_CONFIG;

    return {
      ...client, // Keep all backend data
      // Replace the backend icon with frontend Lucide icon
      color: config.color,
    };
  });
};
