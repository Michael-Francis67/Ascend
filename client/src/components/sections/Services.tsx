import { servicesAPI } from "@/lib/api/index";
import { mapServicesWithIcons } from "@/lib/serviceMapper";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Section from "../ui/Section";
import { mockServices } from "@/config/services.config";

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
          {service.length > 0 ? (
            service.map((service, index) => (
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
            ))
          ) : (
            mockServices.map((service, index) => (
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
            ))
          )}
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
