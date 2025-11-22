"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingStore } from "@/stores/bookingStore";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function BookingManagementPage() {
  const router = useRouter();
  const { bookings, fetchBookings, approveBooking, rejectBooking } =
    useBookingStore();
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      await fetchBookings();
      setIsLoading(false);
    };
    loadBookings();
  }, [fetchBookings]);

  const handleBack = () => {
    router.push("/admin");
  };

  const handleApproveBooking = async (id: number) => {
    try {
      setIsProcessing(id);
      await approveBooking(id);
    } catch (error) {
      console.error("Failed to approve booking:", error);
      alert("Failed to approve booking. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectBooking = async (id: number) => {
    if (confirm("Are you sure you want to reject this booking?")) {
      try {
        setIsProcessing(id);
        await rejectBooking(id);
      } catch (error) {
        console.error("Failed to reject booking:", error);
        alert("Failed to reject booking. Please try again.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive",
      rejected: "destructive",
    };
    const colors: Record<string, string> = {
      confirmed: "bg-green-600",
      pending: "bg-yellow-600",
      cancelled: "bg-red-600",
      rejected: "bg-red-600",
    };
    return (
      <Badge
        variant={variants[status] || "default"}
        className={colors[status] || ""}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = parseISO(dateTimeStr);
      return {
        date: format(date, "yyyy-MM-dd"),
        time: format(date, "HH:mm"),
      };
    } catch {
      return { date: "N/A", time: "N/A" };
    }
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-6xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
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
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 py-3 border-b last:border-0"
                  >
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-[180px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20 rounded" />
                      <Skeleton className="h-8 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bookings.length > 0 ? (
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
                    {bookings.map((booking) => {
                      const startDateTime = formatDateTime(booking.startTime);
                      const endDateTime = formatDateTime(booking.endTime);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.resourceName}
                          </TableCell>
                          <TableCell>
                            {booking.userName || "Unknown User"}
                          </TableCell>
                          <TableCell>{startDateTime.date}</TableCell>
                          <TableCell>
                            {startDateTime.time} - {endDateTime.time}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() =>
                                      handleApproveBooking(booking.id)
                                    }
                                    disabled={isProcessing === booking.id}
                                    title="Approve booking"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleRejectBooking(booking.id)
                                    }
                                    disabled={isProcessing === booking.id}
                                    title="Reject booking"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <span className="text-sm text-gray-500">
                                  Approved
                                </span>
                              )}
                              {booking.status === "cancelled" && (
                                <span className="text-sm text-gray-500">
                                  Cancelled
                                </span>
                              )}
                              {booking.status === "rejected" && (
                                <span className="text-sm text-gray-500">
                                  Rejected
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bookings found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
