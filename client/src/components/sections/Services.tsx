import { servicesAPI } from "@/lib/api/index";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Film,
  Lightbulb,
  Palette,
  Share2,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Section from "../ui/Section";
import { mapServicesWithIcons } from "@/lib/serviceMapper";

const services = [
  {
    order: 1,
    icon: TrendingUp,
    title: "Content Strategy",
    description:
      "Developing data-driven content strategies that align with your business goals and speak directly to your ideal audience.",
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    order: 2,
    icon: Video,
    title: "Content Creation",
    description:
      "Professional videos, photography, commercials, and creative assets designed to elevate your brand.",
    color: "from-purple-500/10 to-purple-600/10",
  },
  {
    order: 3,
    icon: Share2,
    title: "Social Media Marketing",
    description:
      "Helping businesses grow online through strategic content distribution and audience engagement.",
    color: "from-pink-500/10 to-pink-600/10",
  },
  {
    order: 4,
    icon: Users,
    title: "Social Media Management",
    description:
      "Managing your social presence with planning, publishing, optimization, and community management.",
    color: "from-orange-500/10 to-orange-600/10",
  },
  {
    order: 5,
    icon: Palette,
    title: "Branding",
    description:
      "Creating memorable identities that position your business for long-term success.",
    color: "from-green-500/10 to-green-600/10",
  },
  {
    order: 6,
    icon: Film,
    title: "Commercial Video Production",
    description:
      "Producing cinematic commercials and promotional videos that tell your story and inspire action.",
    color: "from-red-500/10 to-red-600/10",
  },
  {
    order: 7,
    icon: Briefcase,
    title: "Business Development",
    description:
      "Helping businesses identify opportunities, improve positioning, and expand sustainably.",
    color: "from-indigo-500/10 to-indigo-600/10",
  },
  {
    order: 8,
    icon: Lightbulb,
    title: "Marketing Consulting",
    description:
      "Providing strategic guidance that helps businesses make smarter marketing decisions.",
    color: "from-yellow-500/10 to-yellow-600/10",
  },
];

export interface Service {
  createdAt: string;
  description: string;
  id: string;
  image: string | null;
  isActive: boolean;
  order: number;
  title: string;
  updatedAt: string;
  icon: LucideIcon;
  color: string;
}

const Services: React.FC = () => {
  const [service, setServices] = React.useState<Service[] | []>([]);

  React.useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();

      const data = response.data.data;
      const mappedServices = mapServicesWithIcons(data);
      console.log({ mappedServices });

      setServices(mappedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  return (
    <Section background="white" padding="lg" id="services">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            What We Do
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive marketing solutions designed to elevate your brand and
            drive sustainable growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`group bg-gradient-to-br ${service.color} p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-brand-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
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
          <Button variant="primary" size="lg">
            View All Services
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Services;
