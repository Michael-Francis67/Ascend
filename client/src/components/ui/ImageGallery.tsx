import { Loader, Plus, X } from "lucide-react";
import React, { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  onChange,
  label = "Image Gallery",
  maxImages = 10,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAddImage = async (file: File) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/upload/single`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      onChange([...images, data.data.url || data.data.secureUrl]);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleAddImage(file);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader className="w-8 h-8 text-brand-primary animate-spin" />
            ) : (
              <>
                <Plus className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        {images.length} / {maxImages} images
      </p>
    </div>
  );
};

export default ImageGallery;
