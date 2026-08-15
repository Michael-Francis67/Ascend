import React from "react";
import { motion } from "framer-motion";
import { Search, Target, Sparkles, Rocket } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "We understand your business, customers, goals, and current challenges.",
  },
  {
    number: "02",
    icon: Target,
    title: "Strategize",
    description:
      "We build a tailored marketing roadmap designed specifically for your business.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Create",
    description:
      "We produce premium content that attracts attention and builds trust.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Scale",
    description:
      "We monitor performance, optimize campaigns, and help your business grow consistently.",
  },
];

const Process: React.FC = () => {
  return (
    <Section background="light" padding="lg" id="process">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            How We Help Businesses Grow
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A proven framework that takes your business from concept to market
            leadership.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-brand-primary/10 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group">
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto group-hover:bg-brand-primary/20 transition-colors">
                      <step.icon className="w-10 h-10 text-brand-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-primary text-white text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block lg:hidden text-center my-2">
                    <div className="w-6 h-0.5 bg-brand-primary/30 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Process;
