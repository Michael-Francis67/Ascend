import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import { teamAPI } from "@/lib/api/index";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";

interface TeamFormData {
  name: string;
  role: string;
  specialties: string[];
  quote: string;
  image: string;
  isActive: boolean;
  order: number;
}

const TeamEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    role: "",
    specialties: [],
    quote: "",
    image: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (isEditing) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getById(id!);
      const member = response.data.data;
      setFormData({
        name: member.name,
        role: member.role,
        specialties: member.specialties || [],
        quote: member.quote || "",
        image: member.image || "",
        isActive: member.isActive,
        order: member.order || 0,
      });
    } catch (error) {
      console.error("Error fetching team member:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await teamAPI.update(id!, formData);
      } else {
        await teamAPI.create(formData);
      }
      navigate("/dashboard/team");
    } catch (error) {
      console.error("Error saving team member:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;
    try {
      await teamAPI.delete(id!);
      navigate("/dashboard/team");
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !formData.specialties.includes(newSpecialty.trim())
    ) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()],
      });
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialty();
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
            onClick={() => navigate("/dashboard/team")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Team Member" : "Add Team Member"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? `Editing: ${formData.name}`
                : "Add a new team member"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Full name"
            required
          />
          <Input
            label="Role/Position"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., CEO & Co-Founder"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialties
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a specialty (e.g., Marketing)"
              className="flex-1"
            />
            {/* @ts-ignore */}
            <Button type="button" variant="outline" onClick={addSpecialty}>
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.specialties.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(specialty)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <Textarea
          label="Quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="A quote from this team member..."
          rows={3}
        />

        <ImageUpload
          label="Profile Image"
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
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
            {saving ? "Saving..." : "Save Team Member"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/team")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeamEditor;
