import { cn } from "@/lib/utils";
import { Loader, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const apiUrl = import.meta.env.VITE_API_URL;

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  className,
  accept = "image/*",
  maxSize = 5,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl("");
    }
  }, [value]);

  const handleUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/upload/single`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      const imageUrl = data.data.url || data.data.secureUrl;
      onChange(imageUrl);
      setPreviewUrl(imageUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
    setPreviewUrl("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Uploaded"
            className="max-w-full max-h-64 rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            dragOver
              ? "border-brand-primary bg-brand-primary/5"
              : "border-gray-300 hover:border-brand-primary hover:bg-gray-50",
            isUploading && "opacity-50 cursor-not-allowed",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-12 h-12 text-brand-primary animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Click or drag to upload
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP up to {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
