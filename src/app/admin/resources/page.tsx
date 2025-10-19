"use client";

import { useState } from "react";
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
import { useBookingStore, Resource } from "@/stores/bookingStore";
import { Edit, Trash2, Plus, ArrowLeft } from "lucide-react";

export default function ResourceManagementPage() {
  const router = useRouter();
  const { resources, deleteResource, toggleResourceAvailability } = useBookingStore();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const handleBack = () => {
    router.push("/admin");
  };

  const handleAddResource = () => {
    alert("Add resource functionality - to be implemented");
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    alert(`Edit resource functionality for ${resource.name} - to be implemented`);
  };

  const handleDeleteResource = (resource: Resource) => {
    if (confirm(`Are you sure you want to delete ${resource.name}?`)) {
      deleteResource(resource.id);
    }
  };

  const handleToggleAvailability = (resource: Resource) => {
    toggleResourceAvailability(resource.id);
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Resource Management</h1>
          </div>
          <Button
            onClick={handleAddResource}
            className="bg-[#004080] hover:bg-[#003060]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Resource
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            variant={resource.available ? "default" : "secondary"}
                            className={resource.available ? "bg-green-600" : "bg-gray-600"}
                          >
                            {resource.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailability(resource)}
                              title={resource.available ? "Mark as unavailable" : "Mark as available"}
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
    </div>
  );
}