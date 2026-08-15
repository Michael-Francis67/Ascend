import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import Container from "../ui/Container";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Our Work", href: "#work" },
  { name: "Industries", href: "#industries" },
  { name: "Contact", href: "#contact" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-white"
      }`}
    >
      <Container className="flex items-center justify-between h-20">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img src="/logo.jpg" alt="Logo" className="h-16 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-charcoal/80 hover:text-brand-primary transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <Button variant="primary" size="sm">
            Book a Discovery Call
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-white shadow-lg p-6 flex flex-col space-y-4 md:hidden border-t">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-charcoal/80 hover:text-brand-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button variant="primary" size="sm" className="w-full text-center">
              Book a Discovery Call
            </Button>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
