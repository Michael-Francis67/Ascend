import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import { sectionsAPI } from "@/lib/api/index";
import {
  ArrowUpDown,
  Copy,
  Edit,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

interface Section {
  id: string;
  key: string;
  title: string;
  content: any;
  image: string | null;
  images: string[] | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const Sections: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"order" | "title" | "updatedAt">(
    "order",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    filterAndSortSections();
  }, [sections, searchTerm, filterActive, sortBy, sortDirection]);

  const fetchSections = async () => {
    try {
      const response = await sectionsAPI.getAll();
      const data = response.data.data;
      setSections(data);
      setFilteredSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
      showNotification("Failed to load sections", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSections = () => {
    let result = [...sections];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (section) =>
          section.title.toLowerCase().includes(term) ||
          section.key.toLowerCase().includes(term),
      );
    }

    // Filter by active status
    if (filterActive === "active") {
      result = result.filter((section) => section.isActive);
    } else if (filterActive === "inactive") {
      result = result.filter((section) => !section.isActive);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "order") {
        comparison = (a.order || 0) - (b.order || 0);
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "updatedAt") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredSections(result);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await sectionsAPI.toggleActive(id);
      setSections((prev) =>
        prev.map((section) =>
          section.id === id
            ? { ...section, isActive: !currentStatus }
            : section,
        ),
      );
      showNotification(
        `Section ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error toggling section status:", error);
      showNotification("Failed to toggle section status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this section? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await sectionsAPI.delete(id);
      setSections((prev) => prev.filter((section) => section.id !== id));
      showNotification("Section deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting section:", error);
      showNotification("Failed to delete section", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSections.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedSections.length} section(s)? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedSections.map((id) => sectionsAPI.delete(id)));
      setSections((prev) =>
        prev.filter((section) => !selectedSections.includes(section.id)),
      );
      setSelectedSections([]);
      showNotification(
        `${selectedSections.length} section(s) deleted successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error deleting sections:", error);
      showNotification("Failed to delete some sections", "error");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedSections.length === filteredSections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(filteredSections.map((s) => s.id));
    }
  };

  const handleSelectSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleDuplicate = async (section: Section) => {
    try {
      const newSection = {
        ...section,
        key: `${section.key}-copy-${Date.now()}`,
        title: `${section.title} (Copy)`,
        order: sections.length,
      };
      delete (newSection as any).id;
      delete (newSection as any).createdAt;
      delete (newSection as any).updatedAt;

      await sectionsAPI.create(newSection);
      fetchSections();
      showNotification("Section duplicated successfully", "success");
    } catch (error) {
      console.error("Error duplicating section:", error);
      showNotification("Failed to duplicate section", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sections</h1>
          <p className="text-gray-500">
            Manage all sections of your website
            <span className="ml-2 text-sm font-medium text-brand-primary">
              ({filteredSections.length} sections)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSections.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className={`text-red-600 border-red-300 hover:bg-red-50 ${isBulkDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={isBulkDeleting ? undefined : handleBulkDelete}
              aria-disabled={isBulkDeleting}
            >
              <Trash2 size={16} className="mr-1" />
              Delete Selected ({selectedSections.length})
            </Button>
          )}
          <Link to="/dashboard/sections/new">
            <Button variant="primary">
              <Plus size={18} className="mr-2" />
              Add Section
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search sections by title or key..."
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

      {/* Sections Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedSections.length === filteredSections.length &&
                      filteredSections.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => {
                      if (sortBy === "order") {
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc",
                        );
                      } else {
                        setSortBy("order");
                        setSortDirection("asc");
                      }
                    }}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Order
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => {
                      if (sortBy === "title") {
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc",
                        );
                      } else {
                        setSortBy("title");
                        setSortDirection("asc");
                      }
                    }}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Title
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => {
                      if (sortBy === "updatedAt") {
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc",
                        );
                      } else {
                        setSortBy("updatedAt");
                        setSortDirection("desc");
                      }
                    }}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Updated
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSections.map((section) => (
                <tr
                  key={section.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(section.id)}
                      onChange={() => handleSelectSection(section.id)}
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GripVertical
                        size={16}
                        className="text-gray-300 cursor-move"
                      />
                      <span className="text-sm text-gray-500">
                        {section.order || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-charcoal">
                        {section.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {section.content ? "Has content" : "No content"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">
                      {section.key}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleToggleActive(section.id, section.isActive)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        section.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {section.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {section.image ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(section.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDuplicate(section)}
                        className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <Link
                        to={`/dashboard/sections/${section.id}/edit`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          {searchTerm || filterActive !== "all" ? (
            <div>
              <p className="text-gray-500">No sections match your filters</p>
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
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No sections added yet</p>
              <Link
                to="/dashboard/sections/new"
                className="text-brand-primary hover:underline mt-2 inline-block"
              >
                Create your first section
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {filteredSections.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filteredSections.length} of {sections.length} sections
          </span>
          <span>
            {sections.filter((s) => s.isActive).length} active,{" "}
            {sections.filter((s) => !s.isActive).length} inactive
          </span>
        </div>
      )}
    </div>
  );
};

export default Sections;
