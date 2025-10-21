"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingStore } from "@/stores/bookingStore";
import { ArrowLeft, TrendingUp, BarChart3, Award } from "lucide-react";

export default function ResourceUsageReportPage() {
  const router = useRouter();
  const { resources, bookings } = useBookingStore();

  const handleBack = () => {
    router.push("/admin/reports");
  };

  // Calculate resource usage statistics
  const resourceStats = useMemo(() => {
    // Count bookings per resource
    const bookingsByResource = bookings.reduce((acc, booking) => {
      if (booking.status !== "Cancelled") {
        acc[booking.resourceId] = (acc[booking.resourceId] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    // Create stats array with resource info
    const stats = resources.map((resource) => {
      const bookingCount = bookingsByResource[resource.id] || 0;
      const totalBookings = bookings.filter(
        (b) => b.status !== "Cancelled"
      ).length;
      const usageRate =
        totalBookings > 0
          ? Math.round((bookingCount / totalBookings) * 100)
          : 0;

      return {
        id: resource.id,
        name: resource.name,
        category: resource.category,
        location: resource.location,
        capacity: resource.capacity,
        bookingCount,
        usageRate,
        available: resource.available,
      };
    });

    // Sort by booking count (most popular first)
    return stats.sort((a, b) => b.bookingCount - a.bookingCount);
  }, [resources, bookings]);

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; bookings: number }> = {};

    resources.forEach((resource) => {
      if (!stats[resource.category]) {
        stats[resource.category] = { count: 0, bookings: 0 };
      }
      stats[resource.category].count++;
    });

    bookings.forEach((booking) => {
      if (booking.status !== "Cancelled") {
        const resource = resources.find((r) => r.id === booking.resourceId);
        if (resource && stats[resource.category]) {
          stats[resource.category].bookings++;
        }
      }
    });

    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        resourceCount: data.count,
        bookingCount: data.bookings,
        avgBookingsPerResource: Math.round(data.bookings / data.count),
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount);
  }, [resources, bookings]);

  // Top 3 most popular resources
  const topResources = resourceStats.slice(0, 3);

  // Get usage rate badge color
  const getUsageRateBadge = (rate: number) => {
    if (rate >= 20) return { color: "bg-red-600", label: "High" };
    if (rate >= 10) return { color: "bg-yellow-600", label: "Medium" };
    return { color: "bg-green-600", label: "Low" };
  };

  const totalBookings = bookings.filter((b) => b.status !== "Cancelled").length;
  const mostPopularResource = topResources[0];

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Resource Usage Report</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Resources
                  </p>
                  <p className="text-2xl font-bold">{resources.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Most Popular</p>
                  <p className="text-lg font-bold truncate">
                    {mostPopularResource?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mostPopularResource?.bookingCount || 0} bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Popular Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 " />
              Top 3 Most Popular Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow"
                  // style={{
                  //   borderColor:
                  //     index === 0
                  //       ? "#FFD700"
                  //       : index === 1
                  //       ? "#C0C0C0"
                  //       : "#CD7F32",
                  // }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">#{index + 1}</span>
                    </div>
                    <Badge className="bg-blue-600">
                      {resource.bookingCount} bookings
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{resource.name}</h3>
                  <p className="text-sm text-gray-600">{resource.category}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {resource.location}
                  </p>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Usage Rate:</span>
                      <span className="font-semibold text-blue-600">
                        {resource.usageRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Resource Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Usage Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceStats.map((resource, index) => {
                    const badge = getUsageRateBadge(resource.usageRate);
                    return (
                      <TableRow key={resource.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {resource.name}
                        </TableCell>
                        <TableCell>{resource.category}</TableCell>
                        <TableCell className="text-sm">
                          {resource.location}
                        </TableCell>
                        <TableCell>{resource.capacity}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {resource.bookingCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    resource.usageRate * 5,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {resource.usageRate}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={badge.color}>{badge.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Category Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Number of Resources</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Avg Bookings/Resource</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryStats.map((stat) => (
                    <TableRow key={stat.category}>
                      <TableCell className="font-medium">
                        {stat.category}
                      </TableCell>
                      <TableCell>{stat.resourceCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{stat.bookingCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">
                          {stat.avgBookingsPerResource}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-transparent rounded-lg">
                <p className="text-sm">
                  <strong>Most Popular:</strong>{" "}
                  {mostPopularResource?.name || "N/A"} with{" "}
                  {mostPopularResource?.bookingCount || 0} bookings (
                  {mostPopularResource?.usageRate || 0}% of total)
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-transparent rounded-lg">
                <p className="text-sm">
                  <strong>Top Category:</strong>{" "}
                  {categoryStats[0]?.category || "N/A"} with{" "}
                  {categoryStats[0]?.bookingCount || 0} total bookings
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-transparent rounded-lg">
                <p className="text-sm">
                  <strong>Under-utilized Resources:</strong>{" "}
                  {resourceStats.filter((r) => r.bookingCount === 0).length}{" "}
                  resources with 0 bookings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
