import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, Trash2, Star } from "lucide-react";
import { testimonialsAPI } from "@/lib/api/index";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUpload from "@/components/ui/ImageUpload";

interface TestimonialFormData {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  isActive: boolean;
}

const TestimonialEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    position: "",
    company: "",
    content: "",
    rating: 5,
    image: "",
    isActive: true,
  });

  useEffect(() => {
    if (isEditing) {
      fetchTestimonial();
    }
  }, [id]);

  const fetchTestimonial = async () => {
    setLoading(true);
    try {
      const response = await testimonialsAPI.getById(id!);
      const testimonial = response.data.data;
      setFormData({
        name: testimonial.name,
        position: testimonial.position,
        company: testimonial.company,
        content: testimonial.content,
        rating: testimonial.rating,
        image: testimonial.image || "",
        isActive: testimonial.isActive,
      });
    } catch (error) {
      console.error("Error fetching testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await testimonialsAPI.update(id!, formData);
      } else {
        await testimonialsAPI.create(formData);
      }
      navigate("/dashboard/testimonials");
    } catch (error) {
      console.error("Error saving testimonial:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    try {
      await testimonialsAPI.delete(id!);
      navigate("/dashboard/testimonials");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
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
            onClick={() => navigate("/dashboard/testimonials")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Testimonial" : "Add Testimonial"}
            </h1>
            <p className="text-gray-500">
              {isEditing
                ? `Editing: ${formData.name}`
                : "Add a new client testimonial"}
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
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Client name"
            required
          />
          <Input
            label="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            placeholder="e.g., CEO"
            required
          />
        </div>

        <Input
          label="Company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          placeholder="Company name"
          required
        />

        <Textarea
          label="Testimonial Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="What did the client say?"
          rows={5}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(rating)}
                className="p-1 focus:outline-none"
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    rating <= (hoverRating || formData.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {formData.rating} / 5 stars
            </span>
          </div>
        </div>

        <ImageUpload
          label="Profile Image"
          value={formData.image}
          onChange={(url) => setFormData({ ...formData, image: url })}
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
            {saving ? "Saving..." : "Save Testimonial"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/testimonials")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialEditor;
