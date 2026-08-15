import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Film, Image, Layout, Palette } from "lucide-react";
import React, { useState } from "react";
import Button from "../ui/Button";
import Container from "../ui/Container";
import Section from "../ui/Section";

const categories = [
  "All",
  "Commercial Productions",
  "Brand Story Videos",
  "Social Media Campaigns",
  "Photography",
  "Graphic Design",
  "Marketing Campaigns",
  "Case Studies",
  "Before & After",
];

const projects = [
  {
    id: 1,
    title: "Brand Transformation",
    category: "Before & After",
    image: "/work/brand-transformation.jpg",
    icon: Palette,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 2,
    title: "Commercial Campaign",
    category: "Commercial Productions",
    image: "/work/commercial-campaign.jpg",
    icon: Film,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 3,
    title: "Social Media Takeover",
    category: "Social Media Campaigns",
    image: "/work/social-takeover.jpg",
    icon: Layout,
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: 4,
    title: "Product Photography",
    category: "Photography",
    image: "/work/product-photography.jpg",
    icon: Image,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: 5,
    title: "Brand Identity Design",
    category: "Graphic Design",
    image: "/work/brand-identity.jpg",
    icon: Palette,
    color: "from-indigo-500/20 to-blue-500/20",
  },
  {
    id: 6,
    title: "Marketing Campaign",
    category: "Marketing Campaigns",
    image: "/work/marketing-campaign.jpg",
    icon: Layout,
    color: "from-rose-500/20 to-pink-500/20",
  },
];

const Work: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [, setSelectedProject] = useState<number | null>(null);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <Section background="white" padding="lg" id="work">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            Our Work Speaks For Itself.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of premium content that delivers results.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group relative bg-gradient-to-br ${project.color} rounded-2xl overflow-hidden cursor-pointer aspect-video`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <project.icon className="w-12 h-12 mx-auto mb-2" />
                    <h4 className="font-bold text-lg">{project.title}</h4>
                    <p className="text-sm text-white/80">{project.category}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-sm">
                      View Project
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-charcoal">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="primary" size="lg">
            View All Projects
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
};

export default Work;
