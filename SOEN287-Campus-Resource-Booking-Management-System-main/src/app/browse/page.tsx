"use client";

import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
import { useBookingStore, Resource } from "@/stores/bookingStore";
import { ResourceCard } from "@/components/browse/ResourceCard";
import { BookingDialog } from "@/components/browse/BookingDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

export default function BrowseResourcesPage() {
  // const _router = useRouter(); // Reserved for future navigation
  const { resources, addBooking } = useBookingStore();

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get all unique categories from resources
  const categories = useMemo(() => {
    const cats = new Set(resources.map((r) => r.category));
    return ["All", ...Array.from(cats)];
  }, [resources]);

  // Filter resources based on search and category
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  const handleBookResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = (bookingDetails: {
    date: string;
    time: string;
  }) => {
    if (!selectedResource) return;

    addBooking({
      resourceId: selectedResource.id,
      resourceName: selectedResource.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      status: "Pending",
      userName: "Student", // In production, this should come from user authentication
    });

    // TODO: Add toast notification for better UX
    alert(
      `Successfully booked ${selectedResource.name} for ${bookingDetails.date} at ${bookingDetails.time}`
    );

    setIsDialogOpen(false);
    setSelectedResource(null);
  };

  // const handleViewBookings = () => {
  //   router.push("/dashboard");
  // };

  return (
    <div className="flex-1 ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080]"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Category
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className={`cursor-pointer ${
                      selectedCategory === category
                        ? "bg-[#6bb5ff] hover:bg-cyan-500"
                        : "hover:bg-cyan-800"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {filteredResources.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Available Resources
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {filteredResources.filter((r) => r.available).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Currently Available
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBook={handleBookResource}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">
                No resources found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Booking Dialog */}
      <BookingDialog
        resource={selectedResource}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
