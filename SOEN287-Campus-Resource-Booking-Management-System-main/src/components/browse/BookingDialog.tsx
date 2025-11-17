"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resource } from "@/stores/bookingStore";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";

interface BookingDialogProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: { date: string; time: string }) => void;
}

export function BookingDialog({
  resource,
  open,
  onClose,
  onConfirm,
}: BookingDialogProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [dateError, setDateError] = useState<string>("");

  const availabilityExceptions = useBookingStore(
    (state) => state.availabilityExceptions
  );

  // Check if a date is within an unavailable exception period
  const checkDateAvailability = (selectedDate: string): string | null => {
    if (!resource || !selectedDate) return null;

    const exceptions = availabilityExceptions.filter(
      (exception) =>
        exception.resourceId === resource.id && exception.isUnavailable
    );

    for (const exception of exceptions) {
      const selected = new Date(selectedDate);
      const start = new Date(exception.startDate);
      const end = new Date(exception.endDate);

      // Set time to midnight for accurate date comparison
      selected.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      if (selected >= start && selected <= end) {
        // Return a user-friendly message based on exception type
        const typeMessages: Record<string, string> = {
          maintenance: "is maintaining",
          holiday: "a holiday",
          special_event: "has a special event",
          other: "is unavailable",
        };
        const typeMsg = typeMessages[exception.type] || "unavailable";
        const reason = exception.reason ? ` (${exception.reason})` : "";
        return `This Date ${typeMsg}，Can not book${reason}`;
      }
    }

    return null;
  };

  const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
    const error = checkDateAvailability(selectedDate);
    setDateError(error || "");

    // Clear time slot if date is unavailable
    if (error) {
      setTimeSlot("");
    }
  };

  const handleConfirm = () => {
    if (date && timeSlot && !dateError) {
      onConfirm({ date, time: timeSlot });
      setDate("");
      setTimeSlot("");
      onClose();
    }
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#004080]">
            Book {resource?.name}
          </DialogTitle>
          <DialogDescription>{resource?.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resource Info */}
          <div className=" p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{resource?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Capacity:</span>
              <span className="text-sm font-medium">
                {resource?.capacity} people
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Category:</span>
              <span className="text-sm font-medium">{resource?.category}</span>
            </div>
          </div>

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
              onChange={(e) => handleDateChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                dateError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#004080]"
              }`}
            />
            {dateError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{dateError}</p>
              </div>
            )}
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
                  onClick={() => setTimeSlot(slot)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    timeSlot === slot
                      ? "bg-[#004080] text-white border-[#004080]"
                      : "bg-white border-gray-300 text-black hover:border-[#004080]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!date || !timeSlot || !!dateError}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
