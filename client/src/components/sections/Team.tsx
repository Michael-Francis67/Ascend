import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Quote } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import { FaLinkedin } from "react-icons/fa";
import { teamAPI } from "@/lib/api/team";
import { mappedTeamsWithColors } from "@/lib/teamMapper";

export interface Team {
  createdAt: string;
  id: string;
  image: string | null;
  isActive: boolean;
  name: string;
  order: number;
  quote: string | null;
  role: string;
  specialties: string[];
  updatedAt: string;
  color: string;
}

const Team: React.FC = () => {
  const [teams, setTeams] = useState<Team[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from backend
      const response = await teamAPI.getAll();
      let fetchedData = [];
      fetchedData = response.data.data;

      const mappedTeams = mappedTeamsWithColors(fetchedData);

      console.log({ mappedTeams });

      const activeTeam = mappedTeams.filter((team) => team.isActive);

      setTeams(activeTeam);

      if (activeTeam.length === 0) {
        setError("No testimonials found");
      }
    } catch (error: any) {
      const mockData = getMockTeams();
      setTeams(mockData);

      setError("Could not load testimonials from server. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  const getMockTeams = (): Team[] => {
    return [
      {
        name: "Henry",
        role: "Founder & Chief Creative Officer",
        specialties: [
          "Creative Strategist",
          "Marketing Strategist",
          "Creative Director",
        ],
        quote: "Helping businesses turn ideas into brands people remember.",
        image: "/team/henry.jpg",
        color: "from-blue-500/10 to-blue-600/10",
      },
      {
        name: "Mary-Ann",
        role: "CEO & Co-Founder",
        specialties: [
          "Operations",
          "Client Relationships",
          "Partnerships",
          "Business Growth",
        ],
        quote: "Building lasting partnerships through trust and results.",
        image: "/team/mary-ann.jpg",
        color: "from-purple-500/10 to-purple-600/10",
      },
    ] as unknown as Team[];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // No team state
  if (teams.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Quote size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No Testimonials Yet
            </h3>
            <p className="text-gray-400 mt-2">
              Check back soon for client feedback
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error but still render with data
  if (error && teams.length > 0) {
    console.warn("⚠️", error);
  }

  return (
    <Section background="white" padding="lg" id="team">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            The People Behind ASCEND
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Passionate experts dedicated to helping your business thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teams.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${member.color} p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-charcoal">
                  {member.name}
                </h3>
                <p className="text-brand-primary font-semibold mb-2">
                  {member.role}
                </p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {member.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-0.5 bg-white/50 rounded-full text-xs text-gray-600"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic text-sm mb-4">
                  "{member.quote}"
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="p-2 bg-white rounded-lg hover:bg-brand-primary/10 transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <FaLinkedin className="w-5 h-5 text-charcoal" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white rounded-lg hover:bg-brand-primary/10 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-5 h-5 text-charcoal" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Team;
