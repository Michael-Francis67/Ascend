import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Target, TrendingUp, Zap } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import { sectionsAPI } from "@/lib/api/sections";

const stats = [
  { number: "200+", label: "Businesses Transformed" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "5x", label: "Average ROI" },
  { number: "50+", label: "Industry Awards" },
];

interface AboutData {
  content: {
    heroDescription: string;
    heroTitle: string;
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

const About: React.FC = () => {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const about = await sectionsAPI.getByKey("about");

        setAbout(about.data.data as AboutData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAbout();
  }, []);

  if (!about) {
    return <LoadingSpinner />;
  }

  return (
    <Section background="light" padding="lg" id="about">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
              {about.title}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              {about.content.heroTitle.split(" ")[0]}{" "}
              {about.content.heroTitle.split(" ")[1]}{" "}
              {about.content.heroTitle.split(" ")[2]}{" "}
              <span className="text-brand-primary">
                {about.content.heroTitle.split(" ")[3]}{" "}
                {about.content.heroTitle.split(" ")[4]}
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {about.content.heroDescription.split(".")[0]}.{" "}
              {about.content.heroDescription.split(".")[1]}.
            </p>
            <p className="text-gray-600 leading-relaxed">
              {about.content.heroDescription.split(".")[2]}.
            </p>
            <p className="text-gray-600 leading-relaxed">
              {about.content.heroDescription.split(".")[3]}.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary">Learn More</Button>
              <Button variant="outline">Our Approach</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl font-bold text-brand-primary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Values */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-charcoal mb-4">
                Our Philosophy
              </h4>
              <div className="space-y-3">
                {[
                  { icon: Eye, text: "Strategic storytelling that resonates" },
                  { icon: Target, text: "Data-driven decisions for growth" },
                  { icon: TrendingUp, text: "Sustainable marketing systems" },
                  { icon: Zap, text: "Creative excellence with purpose" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <item.icon className="w-5 h-5 text-brand-primary flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
