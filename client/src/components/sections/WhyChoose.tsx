import React from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, TrendingUp, Users } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";

const benefits = [
  {
    icon: Target,
    title: "Strategy Before Content",
    description:
      "Every piece of content begins with a clear business objective.",
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    icon: Sparkles,
    title: "Creativity With Purpose",
    description: "Beautiful visuals backed by smart marketing strategy.",
    color: "from-purple-500/10 to-purple-600/10",
  },
  {
    icon: TrendingUp,
    title: "Marketing That Drives Growth",
    description:
      "We don't chase vanity metrics. We focus on attracting customers and growing businesses.",
    color: "from-green-500/10 to-green-600/10",
  },
  {
    icon: Users,
    title: "Long-Term Partnership",
    description:
      "We become an extension of your team, helping your business evolve over time.",
    color: "from-orange-500/10 to-orange-600/10",
  },
];

const WhyChoose: React.FC = () => {
  return (
    <Section background="white" padding="lg" id="why-choose">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Why ASCEND
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Why Businesses Choose ASCEND
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine strategic thinking with creative excellence to deliver
            marketing that truly moves the needle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${benefit.color} p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default WhyChoose;
