import type { Team } from "@/components/sections/Team";
import { TEAM_CONFIG, DEFAULT_TEAM_CONFIG } from "../config/team.config";

export const mappedTeamsWithColors = (teams: Team[]) => {
  return teams.map((team) => {
    // Get the frontend config based on service title
    // @ts-ignore
    const config = TEAM_CONFIG[team.name] || DEFAULT_TEAM_CONFIG;

    return {
      ...team, // Keep all backend data
      // Replace the backend icon with frontend Lucide icon
      color: config.color,
    };
  });
};
