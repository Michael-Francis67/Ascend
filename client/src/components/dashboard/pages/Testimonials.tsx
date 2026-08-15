import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import { testimonialsAPI } from "@/lib/api/index";
import {
  CheckCircle,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Quote,
  RefreshCw,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data.data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      showNotification("Failed to load testimonials", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await testimonialsAPI.toggleActive(id);
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id
            ? { ...testimonial, isActive: !currentStatus }
            : testimonial,
        ),
      );
      showNotification(
        `Testimonial ${!currentStatus ? "published" : "unpublished"} successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error toggling testimonial status:", error);
      showNotification("Failed to toggle testimonial status", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;

    try {
      await testimonialsAPI.delete(selectedTestimonial.id);
      setTestimonials((prev) =>
        prev.filter((t) => t.id !== selectedTestimonial.id),
      );
      showNotification("Testimonial deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedTestimonial(null);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      showNotification("Failed to delete testimonial", "error");
    }
  };

  const handleDuplicate = async (testimonial: Testimonial) => {
    try {
      const newTestimonial = {
        name: `${testimonial.name} (Copy)`,
        position: testimonial.position,
        company: testimonial.company,
        content: testimonial.content,
        rating: testimonial.rating,
        image: testimonial.image,
        isActive: false,
      };

      await testimonialsAPI.create(newTestimonial);
      await fetchTestimonials();
      showNotification("Testimonial duplicated successfully", "success");
    } catch (error) {
      console.error("Error duplicating testimonial:", error);
      showNotification("Failed to duplicate testimonial", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || testimonial.rating === filterRating;
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && testimonial.isActive) ||
      (filterActive === "inactive" && !testimonial.isActive);
    return matchesSearch && matchesRating && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
            }
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* ============ HEADER WITH ACTION BUTTONS ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-gray-500">
            Manage client testimonials
            <span className="ml-2 text-sm font-medium text-brand-primary">
              ({filteredTestimonials.length} testimonials)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchTestimonials}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/testimonials/new")}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* ============ FILTERS AND SEARCH ============ */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search testimonials by name, company, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => setSearchTerm(value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterRating}
            onChange={(e) =>
              setFilterRating(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          >
            <option value="all">All Ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilterActive("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "all"
                ? "bg-brand-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilterActive("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "inactive"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* ============ TESTIMONIALS GRID ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-brand-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {testimonial.position}
                      </p>
                      <p className="text-sm text-brand-primary">
                        {testimonial.company}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleActive(testimonial.id, testimonial.isActive)
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        testimonial.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                      title={testimonial.isActive ? "Unpublish" : "Publish"}
                    >
                      {testimonial.isActive ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                  <div className="mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote
                  size={16}
                  className="text-brand-primary/20 absolute -top-1 -left-1"
                />
                <p className="text-sm text-gray-600 pl-6 line-clamp-3">
                  {testimonial.content}
                </p>
              </div>

              {/* ============ ACTION BUTTONS ============ */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    navigate(`/dashboard/testimonials/${testimonial.id}/edit`)
                  }
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(testimonial)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Copy size={16} className="inline mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    setSelectedTestimonial(testimonial);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    testimonial.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {testimonial.isActive ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {testimonial.isActive ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          {searchTerm || filterRating !== "all" || filterActive !== "all" ? (
            <div>
              <p className="text-gray-500">
                No testimonials match your filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterRating("all");
                  setFilterActive("all");
                }}
                className="text-brand-primary hover:underline mt-2 inline-block"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={40} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                No Testimonials Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add client testimonials to build trust and credibility for your
                brand.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard/testimonials/new")}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add First Testimonial
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Testimonial"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the testimonial from{" "}
            <strong>{selectedTestimonial?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Testimonial
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Testimonials;
