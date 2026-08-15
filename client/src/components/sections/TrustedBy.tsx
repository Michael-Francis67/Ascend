import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { sectionsAPI } from "@/lib/api/sections";
import { mapTrustedWithColors } from "@/lib/trustedMapper";
interface Client {
  featured: boolean;
  id: string;
  isActive: boolean;
  isProfile: boolean;
  link: string;
  logo: string;
  name: string;
  type: string;
  color: string;
}

export interface Trusted {
  content: {
    aboutDescription: string;
    clients: Client[];
    description: string;
    heroButtonText: string;
    heroDescription: string;
    heroTitle: string;
    title: string;
  };
  createdAt: string;
  id: string;
  image: string;
  images: string[];
  isActive: boolean;
  key: string;
  order: number;
  title: string;
  updatedAt: string;
}

const TrustedBy: React.FC = () => {
  const [trusted, setTrusted] = useState<Trusted | null>(null);

  useEffect(() => {
    fetchTrusted();
  }, []);

  const fetchTrusted = async () => {
    try {
      const response = await sectionsAPI.getByKey("trusted-by");
      const data = response.data.data;

      const mappedData = mapTrustedWithColors(data);

      const trusted = {
        ...data,
        content: {
          ...data.content,
          clients: mappedData,
        },
      };

      setTrusted(trusted);
    } catch (error) {
      console.error("Error fetching trusted:", error);
    }
  };
  return (
    <Section background="white" padding="lg" id="trusted">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Trusted Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {trusted?.content.heroTitle}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {trusted?.content.heroDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trusted?.content.clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${client.color} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {client.isProfile ? (
                // Premium profile card
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">PB</span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{client.type}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center gap-1 text-xs text-brand-primary font-medium">
                      <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
                      Premium Partner
                    </span>
                  </div>
                </div>
              ) : (
                // Logo card
                <div className="text-center">
                  <div className="aspect-video bg-white rounded-xl flex items-center justify-center mb-4 border border-gray-100">
                    <div className="font-bold text-brand-primary/40 w-40 h-40">
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="size-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-charcoal">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.type}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            {trusted?.content.aboutDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="text-sm font-medium text-charcoal">
              {trusted?.content.heroButtonText.split("?")[0]}
            </span>
            <Button variant="primary" size="sm">
              {trusted?.content.heroButtonText.split("?")[1]}
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};

export default TrustedBy;
