import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Section from "../ui/Section";
import { sectionsAPI } from "@/lib/api/index";
import LoadingSpinner from "../ui/LoadingSpinner";

interface HeroData {
  content: {
    heroButtonText: string;
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

const Hero: React.FC = () => {
  const [hero, setHero] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const hero = await sectionsAPI.getByKey("hero");

        setHero(hero.data.data as HeroData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHero();
  }, []);

  if (!hero) {
    return <LoadingSpinner />;
  }

  return (
    <Section
      background="light"
      padding="xl"
      className="min-h-screen flex items-center"
      id="home"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Trusted by growing brands
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-charcoal">
                {hero.content?.heroTitle?.split(".")[0]?.split(" ")[0]}
              </span>
              <br />
              <span className="text-brand-primary">
                {hero?.content?.heroTitle?.split(".")[0]?.split(" ")[1]}.
              </span>
              <br />
              <span className="text-charcoal">
                {
                  hero?.content?.heroTitle
                    ?.split(".")[1]
                    ?.split(" ")[1] as string
                }
              </span>
              <br />
              <span className="text-brand-primary">
                {hero?.content?.heroTitle?.split(".")[1].split(" ")[2]}.
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {hero?.content?.heroDescription?.split(".")[0]}.
            </p>

            <p className="text-gray-500 italic border-l-4 border-brand-primary pl-4">
              {hero?.content?.heroDescription?.split(".")[1]}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="primary" size="lg">
                {hero?.content?.heroButtonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Work
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-brand-primary/20 border-2 border-white flex items-center justify-center text-xs font-semibold text-brand-primary"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-charcoal">200+</span>{" "}
                businesses
                <br />
                trust us
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full animate-pulse" />
              <div className="absolute inset-8 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <img
                  src={hero?.image}
                  alt="Hero"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                #1
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                ROI+
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
