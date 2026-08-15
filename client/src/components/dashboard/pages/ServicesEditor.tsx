import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { servicesAPI } from "@/lib/api/index";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

const ServiceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    icon: "📊",
    isActive: true,
    order: 0,
  });

  const iconOptions = [
    "📊",
    "🎬",
    "📱",
    "👥",
    "🎨",
    "🎥",
    "💼",
    "💡",
    "🚀",
    "🎯",
    "✨",
    "⚡",
    "🔥",
    "🌟",
    "💎",
    "🏆",
  ];

  useEffect(() => {
    if (isEditing) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getById(id!);
      const service = response.data.data;
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        isActive: service.isActive,
        order: service.order || 0,
      });
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await servicesAPI.update(id!, formData);
      } else {
        await servicesAPI.create(formData);
      }
      navigate("/dashboard/services");
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await servicesAPI.delete(id!);
      navigate("/dashboard/services");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/services")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Service" : "Add Service"}
            </h1>
            <p className="text-gray-500">
              {isEditing ? `Editing: ${formData.title}` : "Add a new service"}
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Input
          label="Service Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter service title"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <div className="grid grid-cols-8 gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData({ ...formData, icon })}
                className={`p-3 text-2xl rounded-lg border transition-colors ${
                  formData.icon === icon
                    ? "border-brand-primary bg-brand-primary/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the service..."
          rows={4}
          required
        />

        <Input
          label="Order (lower numbers appear first)"
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
          }
          placeholder="0"
        />

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          {/* @ts-ignore */}
          <Button variant="primary" type="submit" disabled={saving}>
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save Service"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/services")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceEditor;
