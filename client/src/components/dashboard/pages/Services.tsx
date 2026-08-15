import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import {
  CheckCircle,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { servicesAPI } from "../../../lib/api/index";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      showNotification("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await servicesAPI.toggleActive(id);
      setServices((prev) =>
        prev.map((service) =>
          service.id === id
            ? { ...service, isActive: !currentStatus }
            : service,
        ),
      );
      showNotification(
        `Service ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error toggling service status:", error);
      showNotification("Failed to toggle service status", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      await servicesAPI.delete(selectedService.id);
      setServices((prev) =>
        prev.filter((service) => service.id !== selectedService.id),
      );
      showNotification("Service deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Error deleting service:", error);
      showNotification("Failed to delete service", "error");
    }
  };

  const handleDuplicate = async (service: Service) => {
    try {
      const newService = {
        title: `${service.title} (Copy)`,
        description: service.description,
        icon: service.icon,
        image: service.image,
        isActive: false,
        order: services.length,
      };

      await servicesAPI.create(newService);
      await fetchServices();
      showNotification("Service duplicated successfully", "success");
    } catch (error) {
      console.error("Error duplicating service:", error);
      showNotification("Failed to duplicate service", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && service.isActive) ||
      (filterActive === "inactive" && !service.isActive);
    return matchesSearch && matchesFilter;
  });

  const getIconDisplay = (icon: string) => {
    if (icon.length <= 2) return icon;
    return "📦";
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
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500">
            Manage your services
            <span className="ml-2 text-sm font-medium text-brand-primary">
              ({filteredServices.length} services)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchServices}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/services/new")}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Service
          </Button>
        </div>
      </div>

      {/* ============ FILTERS AND SEARCH ============ */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search services by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => setSearchTerm(value)}
          />
        </div>
        <div className="flex gap-2">
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
            Active
          </button>
          <button
            onClick={() => setFilterActive("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "inactive"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* ============ SERVICES GRID ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-2xl">
                    {getIconDisplay(service.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Order: {service.order}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      handleToggleActive(service.id, service.isActive)
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      service.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={service.isActive ? "Deactivate" : "Activate"}
                  >
                    {service.isActive ? (
                      <Eye size={16} />
                    ) : (
                      <EyeOff size={16} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {service.description}
              </p>

              {/* ============ ACTION BUTTONS ============ */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    navigate(`/dashboard/services/${service.id}/edit`)
                  }
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(service)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Copy size={16} className="inline mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    service.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {service.isActive ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          {searchTerm || filterActive !== "all" ? (
            <div>
              <p className="text-gray-500">No services match your filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
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
                No Services Added Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start adding your services to showcase what you offer to your
                clients.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard/services/new")}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add Your First Service
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Service"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{selectedService?.title}</strong>? This action cannot be
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
              Delete Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Services;
