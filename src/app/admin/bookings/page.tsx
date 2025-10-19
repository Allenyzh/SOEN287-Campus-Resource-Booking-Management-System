"use client";

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
import { useBookingStore } from "@/stores/bookingStore";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function BookingManagementPage() {
  const router = useRouter();
  const { bookings, updateBookingStatus } = useBookingStore();

  const handleBack = () => {
    router.push("/admin");
  };

  const handleApproveBooking = (id: number) => {
    updateBookingStatus(id, "Confirmed");
  };

  const handleRejectBooking = (id: number) => {
    if (confirm("Are you sure you want to reject this booking?")) {
      updateBookingStatus(id, "Cancelled");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      Confirmed: "default",
      Pending: "secondary",
      Cancelled: "destructive",
    };
    const colors: Record<string, string> = {
      Confirmed: "bg-green-600",
      Pending: "bg-yellow-600",
      Cancelled: "bg-red-600",
    };
    return (
      <Badge 
        variant={variants[status] || "default"}
        className={colors[status] || ""}
      >
        {status}
      </Badge>
    );
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
            <h1 className="text-2xl font-bold">Booking Management</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {booking.resourceName}
                        </TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {booking.status === "Pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleApproveBooking(booking.id)}
                                  title="Approve booking"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRejectBooking(booking.id)}
                                  title="Reject booking"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {booking.status === "Confirmed" && (
                              <span className="text-sm text-gray-500">Approved</span>
                            )}
                            {booking.status === "Cancelled" && (
                              <span className="text-sm text-gray-500">Cancelled</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No bookings to manage.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}