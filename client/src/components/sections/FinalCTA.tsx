import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Button from "../ui/Button";

const benefits = [
  "Strategic marketing systems",
  "Premium content creation",
  "Data-driven growth",
  "Long-term partnership",
];

const FinalCTA: React.FC = () => {
  return (
    <Section background="gradient" padding="xl" id="contact">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready To Build A Brand People Can't Ignore?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you're launching a new business, growing an existing
            company, or strengthening your online presence, ASCEND is ready to
            help you attract attention, build trust, and drive sustainable
            growth.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="!bg-white !text-brand-primary hover:!bg-gray-100 !shadow-none"
            >
              Book a Discovery Call
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="!border-white !text-white hover:!bg-white/10"
            >
              View Our Work
            </Button>
          </div>

          <p className="mt-8 text-sm text-white/70">
            No commitment. Just a conversation about your goals.
          </p>
        </motion.div>
      </Container>
    </Section>
  );
};

export default FinalCTA;
