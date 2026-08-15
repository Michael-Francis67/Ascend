export const TRUSTED_CONFIG = {
  "Adelois Consulting": {
    color: "from-blue-500/10 to-blue-600/10",
  },
  "Pedro Chibuzo Obi": {
    color: "from-purple-500/10 to-purple-600/10",
  },
  "Micaimiah Real Estate": {
    color: "from-green-500/10 to-green-600/10",
  },
};

export type TeamConfig = (typeof TRUSTED_CONFIG)[keyof typeof TRUSTED_CONFIG][];

// Default fallback for any service not in the map
export const DEFAULT_TRUSTED_CONFIG = {
  color: "from-green-500/10 to-green-600/10",
};

export const clients = [
  {
    name: "Adelois Consulting",
    type: "Business Consulting",
    logo: "/adelois.jpg",
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    name: "Pedro Chibuzo Obi",
    type: "Industrialist | Energy, Commodities & Manufacturing",
    logo: "/clients/pedro.png",
    color: "from-purple-500/10 to-purple-600/10",
    isProfile: true,
  },
  {
    name: "Micaimiah Real Estate",
    type: "Real Estate Development & Investment",
    logo: "/estate.png",
    color: "from-green-500/10 to-green-600/10",
  },
];
