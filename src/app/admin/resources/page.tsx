"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Resource, ResourceCategory } from "@/stores/bookingStore";
import { Edit, Trash2, Plus, ArrowLeft, Clock, Calendar } from "lucide-react";
import { ResourceFormDialog } from "@/components/admin/ResourceFormDialog";
import { WorkingHoursDialog } from "@/components/admin/WorkingHoursDialog";
import { ExceptionsDialog } from "@/components/admin/ExceptionsDialog";

export default function ResourceManagementPage() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isWorkingHoursDialogOpen, setIsWorkingHoursDialogOpen] =
    useState(false);
  const [isExceptionsDialogOpen, setIsExceptionsDialogOpen] = useState(false);
  const [scheduleResourceId, setScheduleResourceId] = useState<number | null>(
    null
  );
  const [availabilityRules, setAvailabilityRules] = useState<any[]>([]);
  const [availabilityExceptions, setAvailabilityExceptions] = useState<any[]>(
    []
  );

  // Fetch resources and categories
  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      const result = await response.json();
      if (result.success) {
        const mappedResources: Resource[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category?.name || "Uncategorized",
          categoryId: item.categoryId,
          capacity: item.capacity || 0,
          location: item.location || "",
          available: item.status === "available",
          status: item.status,
          imageUrl: item.imageUrl,
          requiresApproval: item.requiresApproval,
        }));
        setResources(mappedResources);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      console.log("Categories API response:", result);
      if (result.success) {
        console.log("Setting categories:", result.data);
        setCategories(result.data);
      } else {
        console.error("Failed to fetch categories:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleBack = () => {
    router.push("/admin");
  };

  const handleAddResource = () => {
    setDialogMode("create");
    setSelectedResource(null);
    setIsDialogOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setDialogMode("edit");
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  const handleDeleteResource = async (resource: Resource) => {
    if (confirm(`Are you sure you want to delete ${resource.name}?`)) {
      try {
        const response = await fetch(`/api/resources/${resource.id}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
          await fetchResources();
        } else {
          alert("Failed to delete resource: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert("Failed to delete resource");
      }
    }
  };

  const handleToggleAvailability = async (resource: Resource) => {
    try {
      const newStatus =
        resource.status === "available" ? "unavailable" : "available";
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchResources();
      } else {
        alert("Failed to update resource: " + result.error);
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("Failed to update resource");
    }
  };

  const handleConfirmResource = async (
    resourceData: Omit<Resource, "id" | "available">
  ) => {
    try {
      // Find categoryId from category name
      const selectedCategory = categories.find(
        (c) => c.name === resourceData.category
      );
      if (!selectedCategory) {
        alert("Invalid category selected");
        return;
      }

      // Map frontend fields to backend fields
      const apiData = {
        name: resourceData.name,
        description: resourceData.description,
        categoryId: selectedCategory.id,
        location: resourceData.location,
        capacity: resourceData.capacity,
        imageUrl: resourceData.imageUrl,
        requiresApproval: resourceData.requiresApproval || false,
      };

      if (dialogMode === "create") {
        const response = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
        const result = await response.json();
        if (result.success) {
          await fetchResources();
          setIsDialogOpen(false);
          setSelectedResource(null);
        } else {
          alert("Failed to create resource: " + result.error);
        }
      } else if (selectedResource) {
        const response = await fetch(`/api/resources/${selectedResource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
        const result = await response.json();
        if (result.success) {
          await fetchResources();
          setIsDialogOpen(false);
          setSelectedResource(null);
        } else {
          alert("Failed to update resource: " + result.error);
        }
      }
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("Failed to save resource");
    }
  };

  const handleSetWorkingHours = async (resourceId: number) => {
    setScheduleResourceId(resourceId);
    // Fetch existing rules for this resource
    try {
      const response = await fetch(
        `/api/resources/${resourceId}/availability-rules`
      );
      const result = await response.json();
      if (result.success) {
        setAvailabilityRules(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch availability rules:", error);
    }
    setIsWorkingHoursDialogOpen(true);
  };

  const handleSetExceptions = async (resourceId: number) => {
    setScheduleResourceId(resourceId);
    // Fetch existing exceptions for this resource
    try {
      const response = await fetch(
        `/api/resources/${resourceId}/availability-exceptions`
      );
      const result = await response.json();
      if (result.success) {
        setAvailabilityExceptions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch availability exceptions:", error);
    }
    setIsExceptionsDialogOpen(true);
  };

  const handleSaveWorkingHours = async (rules: any[], deletedIds: number[]) => {
    if (!scheduleResourceId) return;

    try {
      const response = await fetch(
        `/api/resources/${scheduleResourceId}/availability-rules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rules, deletedIds }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Working hours updated successfully!");
        setIsWorkingHoursDialogOpen(false);
      } else {
        alert("Failed to update working hours: " + result.error);
      }
    } catch (error) {
      console.error("Error saving working hours:", error);
      alert("Failed to save working hours");
    }
  };

  const handleSaveExceptions = async (
    exceptions: any[],
    deletedIds: number[]
  ) => {
    if (!scheduleResourceId) return;

    try {
      const response = await fetch(
        `/api/resources/${scheduleResourceId}/availability-exceptions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exceptions, deletedIds }),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Exceptions updated successfully!");
        setIsExceptionsDialogOpen(false);
      } else {
        alert("Failed to update exceptions: " + result.error);
      }
    } catch (error) {
      console.error("Error saving exceptions:", error);
      alert("Failed to save exceptions");
    }
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-row flex-col justify-between md:items-center h-16 gap-4">
          <h1 className="text-2xl font-bold">Resource Management</h1>
          <div className="flex-1 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              className="md:flex-0 flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleAddResource}
              className="dark:bg-accent-foreground dark:hover:bg-foreground/70 md:flex-0 flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Resource
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-2 py-8">
        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources ({resources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {resources.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          {resource.name}
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell>{resource.location}</TableCell>
                        <TableCell>{resource.capacity}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              resource.available ? "default" : "secondary"
                            }
                            className={
                              resource.available
                                ? "bg-green-600"
                                : "bg-gray-600"
                            }
                          >
                            {resource.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetWorkingHours(resource.id)}
                              title="Set working hours"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Hours
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetExceptions(resource.id)}
                              title="Set exceptions and blackout dates"
                            >
                              <Calendar className="w-4 h-4 mr-1" />
                              Exceptions
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(resource)}
                              title={
                                resource.available
                                  ? "Mark as unavailable"
                                  : "Mark as available"
                              }
                            >
                              {resource.available ? "Disable" : "Enable"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditResource(resource)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteResource(resource)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No resources available.</p>
                <Button
                  onClick={handleAddResource}
                  className="mt-4 bg-[#004080] hover:bg-[#003060]"
                >
                  Add Your First Resource
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Resource Form Dialog */}
      <ResourceFormDialog
        resource={dialogMode === "edit" ? selectedResource : null}
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedResource(null);
        }}
        onConfirm={handleConfirmResource}
        categories={categories}
      />

      {/* Working Hours Dialog */}
      {scheduleResourceId && (
        <WorkingHoursDialog
          resource={resources.find((r) => r.id === scheduleResourceId) || null}
          open={isWorkingHoursDialogOpen}
          onClose={() => {
            setIsWorkingHoursDialogOpen(false);
            setScheduleResourceId(null);
          }}
          existingRules={availabilityRules}
          onSave={handleSaveWorkingHours}
        />
      )}

      {/* Exceptions Dialog */}
      {scheduleResourceId && (
        <ExceptionsDialog
          resource={resources.find((r) => r.id === scheduleResourceId) || null}
          open={isExceptionsDialogOpen}
          onClose={() => {
            setIsExceptionsDialogOpen(false);
            setScheduleResourceId(null);
          }}
          existingExceptions={availabilityExceptions}
          onSave={handleSaveExceptions}
        />
      )}
    </div>
  );
}
