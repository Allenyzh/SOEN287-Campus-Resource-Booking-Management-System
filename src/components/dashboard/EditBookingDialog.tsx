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
import { Booking } from "@/stores/bookingStore";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface EditBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (
    bookingId: number,
    updates: { date: string; time: string }
  ) => void;
}

export function EditBookingDialog({
  booking,
  open,
  onClose,
  onConfirm,
}: EditBookingDialogProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // Update local state when booking prop changes
  useEffect(() => {
    if (booking) {
      setDate(booking.date);
      setTimeSlot(booking.time);
    }
  }, [booking]);

  const handleConfirm = () => {
    if (booking && date && timeSlot) {
      onConfirm(booking.id, { date, time: timeSlot });
      onClose();
    }
  };

  const handleClose = () => {
    // Reset to original values on cancel
    if (booking) {
      setDate(booking.date);
      setTimeSlot(booking.time);
    }
    onClose();
  };

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "18:00 - 20:00",
  ];

  // Get today's date for setting minimum date in date picker
  const today = new Date().toISOString().split("T")[0];

  // Check if any changes were made
  const hasChanges =
    booking && (date !== booking.date || timeSlot !== booking.time);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#004080]">
            Edit Booking
          </DialogTitle>
          <DialogDescription>
            Modify your booking for {booking?.resourceName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resource Info */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Resource:
              </span>
              <span className="text-sm font-medium">
                {booking?.resourceName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Status:
              </span>
              <span className="text-sm font-medium capitalize">
                {booking?.status}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          {booking?.status === "pending" && (
            <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">Pending Approval:</p>
                <p>
                  Your booking is waiting for admin approval. Any changes will
                  keep it in pending status.
                </p>
              </div>
            </div>
          )}

          {booking?.status === "confirmed" && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Important:</p>
                <p>
                  Modifying a confirmed booking will reset it to pending status
                  and require re-approval from administrators.
                </p>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004080] bg-background"
            />
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    timeSlot === slot
                      ? "bg-[#004080] text-white border-[#004080]"
                      : "bg-background border-gray-300 dark:border-gray-700 hover:border-[#004080]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Change Indicator */}
          {hasChanges && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
              <span>Changes detected</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!date || !timeSlot || !hasChanges}
            className="bg-[#004080] hover:bg-[#003060]"
          >
            {hasChanges ? "Update Booking" : "No Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
