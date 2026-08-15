import Button from "@/components/ui/Button";
import ImageGallery from "@/components/ui/ImageGallery";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Textarea from "@/components/ui/Textarea";
import Toast from "@/components/ui/Toast";
import { sectionsAPI } from "@/lib/api/index";
import {
  AlertCircle,
  ArrowLeft,
  Code,
  Layout,
  Save,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

interface SectionFormData {
  key: string;
  title: string;
  content: any;
  image: string;
  images: string[];
  isActive: boolean;
  order: number;
}

const SectionEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");
  const [formData, setFormData] = useState<SectionFormData>({
    key: "",
    title: "",
    content: {},
    image: "",
    images: [],
    isActive: true,
    order: 0,
  });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isEditing) {
      fetchSection();
    }
  }, [id]);

  const fetchSection = async () => {
    setLoading(true);
    try {
      const response = await sectionsAPI.getById(id!);
      const section = response.data.data;
      setFormData({
        key: section.key,
        title: section.title,
        content: section.content || {},
        image: section.image || "",
        images: section.images || [],
        isActive: section.isActive,
        order: section.order || 0,
      });
    } catch (error) {
      console.error("Error fetching section:", error);
      showNotification("Failed to load section", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate JSON content
      if (typeof formData.content === "string") {
        try {
          formData.content = JSON.parse(formData.content);
        } catch (error) {
          showNotification("Invalid JSON content", "error");
          setSaving(false);
          return;
        }
      }

      if (isEditing) {
        await sectionsAPI.update(id!, formData);
        showNotification("Section updated successfully", "success");
      } else {
        await sectionsAPI.create(formData);
        showNotification("Section created successfully", "success");
      }

      setTimeout(() => {
        navigate("/dashboard/sections");
      }, 1000);
    } catch (error) {
      console.error("Error saving section:", error);
      showNotification("Failed to save section", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this section? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await sectionsAPI.delete(id!);
      showNotification("Section deleted successfully", "success");
      setTimeout(() => {
        navigate("/dashboard/sections");
      }, 500);
    } catch (error) {
      console.error("Error deleting section:", error);
      showNotification("Failed to delete section", "error");
    }
  };

  const updateContent = (path: string, value: any) => {
    const keys = path.split(".");
    const newContent = { ...formData.content };
    let current = newContent;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setFormData({ ...formData, content: newContent });
  };

  const handleJsonChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, content: parsed });
      setJsonError(null);
    } catch (error) {
      setJsonError("Invalid JSON format");
      // Still allow editing, but show error
      setFormData({ ...formData, content: value });
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/sections")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Section" : "Create Section"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? `Editing: ${formData.key}`
                : "Add a new section to your website"}
            </p>
          </div>
        </div>
        {isEditing && (
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Key (Unique Identifier)"
                  value={formData.key}
                  onChange={(e) =>
                    setFormData({ ...formData, key: e.target.value })
                  }
                  placeholder="e.g., hero, about, services"
                  disabled={isEditing}
                  required
                  hint="Used to reference this section in code"
                />
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Section Title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  hint="Lower numbers appear first"
                />
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Images</h3>
              <div className="space-y-4">
                <ImageUpload
                  label="Main Image"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <ImageGallery
                  label="Gallery Images"
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                  maxImages={10}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setActiveTab("visual")}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === "visual"
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Layout size={16} />
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("json")}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                      activeTab === "json"
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Code size={16} />
                    JSON Editor
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "visual" ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Edit the section content using the visual editor. This
                      content will be displayed on the frontend.
                    </p>

                    {/* Dynamic fields based on section type */}
                    <Input
                      label="Hero Title"
                      value={formData.content?.heroTitle || ""}
                      onChange={(e) =>
                        updateContent("heroTitle", e.target.value)
                      }
                      placeholder="Building Businesses. Scaling Brands."
                    />

                    <Textarea
                      label="Hero Description"
                      value={formData.content?.heroDescription || ""}
                      onChange={(e) =>
                        updateContent("heroDescription", e.target.value)
                      }
                      placeholder="We help businesses attract attention..."
                      rows={4}
                    />

                    <Input
                      label="Hero Button Text"
                      value={formData.content?.heroButtonText || ""}
                      onChange={(e) =>
                        updateContent("heroButtonText", e.target.value)
                      }
                      placeholder="Book a Discovery Call"
                    />

                    <Textarea
                      label="About Title"
                      value={formData.content?.aboutTitle || ""}
                      onChange={(e) =>
                        updateContent("aboutTitle", e.target.value)
                      }
                      placeholder="Attention Is The New Currency."
                      rows={2}
                    />

                    <Textarea
                      label="About Description"
                      value={formData.content?.aboutDescription || ""}
                      onChange={(e) =>
                        updateContent("aboutDescription", e.target.value)
                      }
                      placeholder="The businesses winning today aren't always the ones with the best products..."
                      rows={6}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>
                        These fields are examples. The actual fields depend on
                        your section type. Use the JSON editor for full control.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">
                      Edit the section content as JSON. This gives you full
                      control over all fields.
                    </p>
                    {jsonError && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
                        <AlertCircle
                          size={16}
                          className="flex-shrink-0 mt-0.5"
                        />
                        <span>{jsonError}</span>
                      </div>
                    )}
                    <Textarea
                      value={
                        typeof formData.content === "string"
                          ? formData.content
                          : JSON.stringify(formData.content, null, 2)
                      }
                      onChange={(e) => handleJsonChange(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                      placeholder="{}"
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      <code>
                        Example:{" "}
                        {
                          '{ "heroTitle": "Building Businesses.", "heroDescription": "We help..." }'
                        }
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="bg-brand-light/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-sm text-charcoal">
                        {formData.title || "Section Title"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.key || "section-key"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded-lg mt-2"
                    />
                  )}
                  <div className="flex gap-1 mt-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        formData.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500">
                      Order: {formData.order}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Section Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Content Fields</span>
                  <span className="font-medium">
                    {Object.keys(formData.content || {}).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Images</span>
                  <span className="font-medium">
                    {(formData.image ? 1 : 0) + (formData.images?.length || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`font-medium ${formData.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    {formData.isActive ? "Published" : "Draft"}
                  </span>
                </div>
                {isEditing && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Modified</span>
                      <span className="text-gray-600">Now</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use unique keys for each section</li>
                <li>• Keep content organized with JSON</li>
                <li>• Add descriptive alt text to images</li>
                <li>• Preview changes before publishing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          {/* @ts-ignore */}
          <Button variant="primary" type="submit" disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Section"
                : "Create Section"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/sections")}
          >
            Cancel
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SectionEditor;
