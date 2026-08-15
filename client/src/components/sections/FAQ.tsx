import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Button from "../ui/Button";

const faqs = [
  {
    question: "What businesses do you work with?",
    answer:
      "We partner with startups, SMEs, personal brands, and established companies looking to grow through strategic marketing. Our expertise spans multiple industries, and we tailor our approach to each client's unique needs.",
  },
  {
    question: "Do you work internationally?",
    answer:
      "Yes. We work with businesses both within Nigeria and internationally. Our team is experienced in serving clients across different markets and time zones.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Our pricing depends on the goals and scope of your project. We offer customized packages that align with your budget and objectives. Book a discovery call for a tailored proposal.",
  },
  {
    question: "Do you only create content?",
    answer:
      "No. We provide complete marketing support, including strategy, branding, content creation, social media management, commercial production, and consulting. We're a full-service marketing partner.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply book a discovery call. We'll learn about your business, understand your goals, and recommend the best strategy for growth. It's that simple.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section background="light" padding="lg" id="faq">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about working with ASCEND.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-brand-light/30 transition-colors"
              >
                <span className="font-semibold text-charcoal">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-primary transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Button variant="primary" size="lg">
            Book a Discovery Call
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
};

export default FAQ;
