"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axios from "axios";

interface ImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
  const response = await axios.post(url, formData);
  return response.data.secure_url;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    const remainingSlots = maxImages - value.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];
    setUploading(true);
    for (const file of filesToUpload) {
      if (file.type.startsWith("image/")) {
        try {
          const url = await uploadToCloudinary(file);
          newImages.push(url);
        } catch (err) {
          toast({
            title: "Error",
            description: "Image upload failed.",
            variant: "error",
          });
        }
      } else {
        toast({
          title: "Invalid File",
          description: `${file.name} is not a valid image file.`,
          variant: "destructive",
        });
      }
    }
    setUploading(false);
    if (newImages.length > 0) {
      onChange([...value, ...newImages]);
      toast({
        title: "Images Added",
        description: `${newImages.length} image(s) uploaded successfully.`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    toast({
      title: "Error",
      description: "Image removal failed.",
      variant: "error",
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          value.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={value.length < maxImages ? openFileDialog : undefined}
      >
        <div className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {value.length >= maxImages
                ? "Maximum images reached"
                : "Upload Product Images"}
            </p>
            <p className="text-sm text-muted-foreground">
              {value.length >= maxImages
                ? `You can upload up to ${maxImages} images`
                : `Drag and drop images here, or click to browse (${value.length}/${maxImages})`}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF up to 10MB each
            </p>
          </div>
          {value.length < maxImages && (
            <Button
              type="button"
              variant="outline"
              className="mt-4 bg-transparent"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose Images
            </Button>
          )}
          {uploading && (
            <div className="mt-2 text-sm text-blue-500">Uploading...</div>
          )}
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
