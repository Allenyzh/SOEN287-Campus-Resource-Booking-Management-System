"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resource, ResourceCategory } from "@/stores/bookingStore";
import { Building2, Users, MapPin, Tag } from "lucide-react";

interface ResourceFormDialogProps {
  resource: Resource | null; // null means creating new resource
  open: boolean;
  onClose: () => void;
  onConfirm: (resourceData: Omit<Resource, "id" | "available">) => void;
  categories: ResourceCategory[];
}

export function ResourceFormDialog({
  resource,
  open,
  onClose,
  onConfirm,
  categories,
}: ResourceFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = resource !== null;

  // Debug: Log categories when they change
  useEffect(() => {
    console.log("ResourceFormDialog categories:", categories);
  }, [categories]);

  // When dialog opens in edit mode, populate form with existing data
  useEffect(() => {
    if (open && resource) {
      setName(resource.name);
      setDescription(resource.description);
      setCategory(resource.category);
      setLocation(resource.location);
      setCapacity(resource.capacity.toString());
      setImage(resource.image || "");
      setErrors({});
    } else if (open && !resource) {
      // Create mode: clear all form fields
      setName("");
      setDescription("");
      setCategory("");
      setLocation("");
      setCapacity("");
      setImage("");
      setErrors({});
    }
  }, [open, resource]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Resource name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    } else if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    const resourceData = {
      name: name.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      capacity: Number(capacity),
      imageUrl: image.trim() || undefined,
    };

    onConfirm(resourceData);
    // Note: Don't call handleClose here, parent will close the dialog
  };

  const handleClose = () => {
    // Clear form when dialog closes
    setName("");
    setDescription("");
    setCategory("");
    setLocation("");
    setCapacity("");
    setImage("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Resource" : "Add New Resource"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the resource information below"
              : "Fill in the details to create a new resource"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resource Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Resource Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Study Room 101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource and its features..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              Category <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Library Building, Floor 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Capacity (people) <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.capacity && (
              <p className="text-sm text-red-500">{errors.capacity}</p>
            )}
          </div>

          {/* Image URL (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Image URL <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Enter a URL to an image of the resource
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isEditMode ? "Update Resource" : "Create Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
