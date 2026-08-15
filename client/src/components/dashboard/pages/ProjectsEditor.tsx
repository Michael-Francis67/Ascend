import Button from "@/components/ui/Button";
import ImageGallery from "@/components/ui/ImageGallery";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { projectsAPI } from "@/lib/api/index";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

interface ProjectFormData {
  title: string;
  category: string;
  description: string;
  client: string;
  results: string;
  image: string;
  gallery: string[];
  isActive: boolean;
}

const ProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    category: "",
    description: "",
    client: "",
    results: "",
    image: "",
    gallery: [],
    isActive: true,
  });

  const categoryOptions = [
    { value: "Commercial Productions", label: "Commercial Productions" },
    { value: "Brand Story Videos", label: "Brand Story Videos" },
    { value: "Social Media Campaigns", label: "Social Media Campaigns" },
    { value: "Photography", label: "Photography" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Marketing Campaigns", label: "Marketing Campaigns" },
    { value: "Case Studies", label: "Case Studies" },
    { value: "Before & After", label: "Before & After" },
  ];

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getById(id!);
      const project = response.data.data;
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        client: project.client,
        results: project.results || "",
        image: project.image || "",
        gallery: project.gallery || [],
        isActive: project.isActive,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await projectsAPI.update(id!, formData);
      } else {
        await projectsAPI.create(formData);
      }
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await projectsAPI.delete(id!);
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
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
            onClick={() => navigate("/dashboard/projects")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Project" : "Create Project"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? `Editing: ${formData.title}`
                : "Add a new project to your portfolio"}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter project title"
            required
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            placeholder="Select category"
            required
          />
        </div>

        <Input
          label="Client Name"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          placeholder="Client or company name"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the project..."
          rows={4}
          required
        />

        <Textarea
          label="Results / Outcome"
          value={formData.results}
          onChange={(e) =>
            setFormData({ ...formData, results: e.target.value })
          }
          placeholder="What were the results achieved?"
          rows={3}
        />

        <ImageUpload
          label="Main Image"
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
        />

        <ImageGallery
          label="Gallery Images"
          images={formData.gallery}
          onChange={(gallery) => setFormData({ ...formData, gallery })}
          maxImages={10}
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
            {saving ? "Saving..." : "Save Project"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/projects")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditor;
