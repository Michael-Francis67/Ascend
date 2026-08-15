import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Header";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Hero from "@/components/sections/Hero";
import Industries from "@/components/sections/Industries";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Team from "@/components/sections/Team";
import Testimonials from "@/components/sections/Testimonials";
import TrustedBy from "@/components/sections/TrustedBy";
import WhyChoose from "@/components/sections/WhyChoose";
import Work from "@/components/sections/Work";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <About />
        <Services />
        <Process />
        <Work />
        <Industries />
        <WhyChoose />
        <Testimonials />
        <Team />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
