"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore, Booking } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { EditBookingDialog } from "@/components/dashboard/EditBookingDialog";
import { Edit } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { bookings, cancelBooking, updateBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter bookings for current user
  const userBookings = useMemo(() => {
    return bookings.filter((b) => b.userName === "Student");
  }, [bookings]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = userBookings.length;
    const confirmed = userBookings.filter(
      (b) => b.status === "Confirmed"
    ).length;
    const pending = userBookings.filter((b) => b.status === "Pending").length;
    const upcoming = userBookings.filter(
      (b) => b.status !== "Cancelled" && new Date(b.date) >= new Date()
    ).length;

    return { total, confirmed, pending, upcoming };
  }, [userBookings]);

  const handleLogout = () => {
    // TODO: Implement logout logic with authentication
    router.push("/");
  };

  const handleCancelBooking = (id: number) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(id);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleConfirmEdit = (
    bookingId: number,
    updates: { date: string; time: string }
  ) => {
    updateBooking(bookingId, updates);
    setIsEditDialogOpen(false);
    setSelectedBooking(null);

    // Show success message
    alert(
      `Booking updated successfully!\nNew date: ${updates.date}\nNew time: ${updates.time}`
    );
  };

  const handleBookNewResource = () => {
    router.push("/browse");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Confirmed: "default",
      Pending: "secondary",
      Cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold">Campus Resource Booking</h1>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-[#e74c3c] hover:bg-[#c0392b]"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome, Student!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Here you can view and manage your resource bookings.
            </p>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <DashboardStats
          totalBookings={stats.total}
          confirmedBookings={stats.confirmed}
          pendingBookings={stats.pending}
          upcomingBookings={stats.upcoming}
        />

        {/* Bookings Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.resourceName}
                        </TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEditBooking(booking)}
                              variant="outline"
                              size="sm"
                              disabled={
                                booking.status === "Cancelled" ||
                                booking.status === "Confirmed"
                              }
                              className="bg-[#3498db] text-white hover:bg-[#2980b9] hover:text-white disabled:opacity-50"
                              title="Edit booking"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleCancelBooking(booking.id)}
                              variant="outline"
                              size="sm"
                              disabled={booking.status === "Cancelled"}
                              className="bg-[#e67e22] text-white hover:bg-[#d35400] hover:text-white disabled:opacity-50"
                            >
                              Cancel
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
                <p>You don&apos;t have any bookings yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions Section */}
        <div className="flex justify-center">
          <Button
            onClick={handleBookNewResource}
            className="px-8 py-6 text-lg"
            size="lg"
          >
            Book New Resource
          </Button>
        </div>
      </main>

      {/* Edit Booking Dialog */}
      <EditBookingDialog
        booking={selectedBooking}
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
}
