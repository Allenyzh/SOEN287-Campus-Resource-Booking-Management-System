"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resource, useBookingStore } from "@/stores/bookingStore";
import { Calendar, Clock, AlertCircle } from "lucide-react";

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
  const [dateError, setDateError] = useState<string | null>(null);

  const { isDateAvailable, getAvailableTimeSlots, isTimeSlotAvailable } =
    useBookingStore();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setDate("");
      setTimeSlot("");
      setDateError(null);
    }
  }, [open]);

  // Check date availability when date changes
  useEffect(() => {
    if (date && resource) {
      const availability = isDateAvailable(resource.id, date);
      if (!availability.available) {
        setDateError(availability.reason || "Date not available");
        setTimeSlot(""); // Clear time slot if date is not available
      } else {
        setDateError(null);
      }
    }
  }, [date, resource, isDateAvailable]);

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!date || !resource || dateError) {
      return [];
    }
    return getAvailableTimeSlots(resource.id, date);
  }, [date, resource, dateError, getAvailableTimeSlots]);

  const handleConfirm = () => {
    if (date && timeSlot && resource) {
      // Final validation before booking
      const slotAvailability = isTimeSlotAvailable(resource.id, date, timeSlot);
      if (!slotAvailability.available) {
        alert(
          slotAvailability.reason || "This time slot is no longer available"
        );
        return;
      }

      onConfirm({ date, time: timeSlot });
      setDate("");
      setTimeSlot("");
      setDateError(null);
    }
  };

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
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004080]"
            />
          </div>

          {/* Date Error Message */}
          {dateError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{dateError}</span>
            </div>
          )}

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Select Time Slot
            </label>
            {!date ? (
              <p className="text-sm text-gray-500">
                Please select a date first
              </p>
            ) : dateError ? (
              <p className="text-sm text-gray-500">
                No time slots available for this date
              </p>
            ) : availableTimeSlots.length === 0 ? (
              <p className="text-sm text-gray-500">
                No time slots available for this date
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableTimeSlots.map((slot) => (
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
            )}
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
