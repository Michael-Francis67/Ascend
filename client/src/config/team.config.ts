export const TEAM_CONFIG = {
  Henry: {
    color: "from-blue-500/10 to-blue-600/10",
  },
  "Mary-Ann": {
    color: "from-purple-500/10 to-purple-600/10",
  },
};

export type TeamConfig = (typeof TEAM_CONFIG)[keyof typeof TEAM_CONFIG][];

// Default fallback for any service not in the map
export const DEFAULT_TEAM_CONFIG = {
  color: "from-purple-500/10 to-purple-600/10",
};

// const team = [
//     {
//       name: "Henry",
//       role: "Founder & Chief Creative Officer",
//       specialties: [
//         "Creative Strategist",
//         "Marketing Strategist",
//         "Creative Director",
//       ],
//       quote: "Helping businesses turn ideas into brands people remember.",
//       image: "/team/henry.jpg",
//       color: "from-blue-500/10 to-blue-600/10",
//     },
//     {
//       name: "Mary-Ann",
//       role: "CEO & Co-Founder",
//       specialties: [
//         "Operations",
//         "Client Relationships",
//         "Partnerships",
//         "Business Growth",
//       ],
//       quote: "Building lasting partnerships through trust and results.",
//       image: "/team/mary-ann.jpg",
//       color: "from-purple-500/10 to-purple-600/10",
//     },
//   ];
