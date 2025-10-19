"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/stores/bookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LayoutGrid, Calendar } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { resources, bookings } = useBookingStore();

  // Calculate statistics, reusing DashboardStats component format
  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(
      (b) => b.status === "Confirmed"
    ).length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "Pending"
    ).length;
    const upcomingBookings = bookings.filter(
      (b) => b.status !== "Cancelled" && new Date(b.date) >= new Date()
    ).length;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      upcomingBookings,
    };
  }, [bookings]);

  const availableResources = useMemo(() => {
    return resources.filter(r => r.available).length;
  }, [resources]);

  const resourceAvailability = useMemo(() => {
    if (resources.length === 0) return 0;
    return Math.round((availableResources / resources.length) * 100);
  }, [resources.length, availableResources]);

  const handleLogout = () => {
    router.push("/sign-in");
  };

  const navigateToResources = () => {
    router.push("/admin/resources");
  };

  const navigateToBookings = () => {
    router.push("/admin/bookings");
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold">Administrator Dashboard</h1>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-[#e74c3c] hover:bg-[#c0392b]"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome, Administrator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Manage resources, approve bookings, and monitor system usage.
            </p>
          </CardContent>
        </Card>

        {/* Statistics Section - Using the same DashboardStats component */}
        <DashboardStats {...stats} />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Resource Management Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={navigateToResources}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <LayoutGrid className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Resource Management</h3>
                  <p className="text-gray-600">Add, edit, or remove resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Management Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={navigateToBookings}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Booking Management</h3>
                  <p className="text-gray-600">Review and approve bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {resources.length}
                </div>
                <div className="text-sm text-gray-600">Total Resources</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {availableResources}
                </div>
                <div className="text-sm text-gray-600">Available Resources</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {resourceAvailability}%
                </div>
                <div className="text-sm text-gray-600">Resource Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}