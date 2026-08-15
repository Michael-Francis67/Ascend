import React, { useState, useEffect } from "react";
import { testimonialsAPI } from "../../lib/api/index";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image: string | null;
  isActive: boolean;
  createdAt: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch from backend
      const response = await testimonialsAPI.getActive();

      // IMPORTANT: Check the actual data structure
      let fetchedData = [];

      // Option 1: If response is { success: true, data: [...] }
      if (response.data?.data && Array.isArray(response.data.data)) {
        fetchedData = response.data.data;
      }
      // Option 2: If response is { success: true, data: { testimonials: [...] } }
      else if (
        response.data?.data?.testimonials &&
        Array.isArray(response.data.data.testimonials)
      ) {
        fetchedData = response.data.data.testimonials;
      }
      // Option 3: If response is directly an array
      else if (Array.isArray(response.data)) {
        fetchedData = response.data;
      }
      // Option 4: If response is { data: [...] }
      else if (Array.isArray(response.data?.data)) {
        fetchedData = response.data.data;
      }

      // Filter only active testimonials (if not already filtered by backend)
      const activeTestimonials = fetchedData.filter(
        (t: Testimonial) => t.isActive !== false,
      );

      setTestimonials(activeTestimonials);

      if (activeTestimonials.length === 0) {
        setError("No testimonials found");
      }
    } catch (error: any) {
      const mockData = getMockTestimonials();
      setTestimonials(mockData);

      setError("Could not load testimonials from server. Showing sample data.");
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockTestimonials = (): Testimonial[] => {
    return [
      {
        id: "1",
        name: "Adelois Consulting",
        position: "CEO",
        company: "Adelois Consulting",
        content:
          "ASCEND transformed our digital presence completely. Their strategic approach to content and branding helped us attract high-value clients we never thought possible.",
        rating: 5,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Micaimiah Real Estate",
        position: "Director",
        company: "Micaimiah Real Estate",
        content:
          "Working with ASCEND has been a game-changer for our real estate business. Their commercial video production and social media strategy helped us close deals faster.",
        rating: 5,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Pedro Chibuzo Obi",
        position: "Industrialist",
        company: "Energy, Commodities & Manufacturing",
        content:
          "ASCEND understood my vision from day one. They helped me build a personal brand that commands respect and attracts the right partnerships.",
        rating: 5,
        image: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Quote size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No Testimonials Yet
            </h3>
            <p className="text-gray-400 mt-2">
              Check back soon for client feedback
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error but still render with data
  if (error && testimonials.length > 0) {
    console.warn("⚠️", error);
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real results from real businesses we've helped grow.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            {/* Quote Icon */}
            <Quote className="w-12 h-12 text-brand-primary/10 absolute top-6 right-6" />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < currentTestimonial.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6">
              "{currentTestimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl">
                {currentTestimonial.image ? (
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  currentTestimonial.name.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {currentTestimonial.name}
                </p>
                <p className="text-sm text-gray-500">
                  {currentTestimonial.position}
                </p>
                <p className="text-sm text-brand-primary">
                  {currentTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevTestimonial}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-brand-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
