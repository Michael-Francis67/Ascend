import React from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  Briefcase,
  User,
  Cpu,
  Rocket,
  Store,
  Factory,
  LineChart,
} from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";

const industries = [
  { icon: ShoppingBag, name: "Fashion & Lifestyle" },
  { icon: Sparkles, name: "Beauty & Cosmetics" },
  { icon: Building2, name: "Real Estate" },
  { icon: UtensilsCrossed, name: "Restaurants & Hospitality" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: Briefcase, name: "Professional Services" },
  { icon: User, name: "Personal Brands" },
  { icon: Cpu, name: "Technology" },
  { icon: Rocket, name: "Startups" },
  { icon: Store, name: "Retail" },
  { icon: Factory, name: "Manufacturing" },
  { icon: LineChart, name: "Consulting" },
];

const Industries: React.FC = () => {
  return (
    <Section background="light" padding="lg" id="industries">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Expertise
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Industries We Serve
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We work with ambitious businesses across various industries,
            delivering tailored marketing solutions that drive results.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
              className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100"
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-primary/20 transition-colors">
                <industry.icon className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-sm font-medium text-charcoal">
                {industry.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Industries;
