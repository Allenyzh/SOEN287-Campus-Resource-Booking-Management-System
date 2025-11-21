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
import { Resource } from "@/stores/bookingStore";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { useBookingStore } from "@/stores/bookingStore";
import { format, parseISO, getDay } from "date-fns";

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

  const {
    availabilityExceptions,
    availabilityRules,
    fetchAvailabilityExceptions,
    fetchAvailabilityRules,
  } = useBookingStore();

  // Fetch availability exceptions and rules when dialog opens with a resource
  useEffect(() => {
    if (open && resource) {
      fetchAvailabilityExceptions(resource.id);
      fetchAvailabilityRules(resource.id);
    }
  }, [open, resource, fetchAvailabilityExceptions, fetchAvailabilityRules]);

  // Check if a date is within an unavailable exception period
  const checkDateAvailability = (selectedDate: string): string | null => {
    if (
      !resource ||
      !selectedDate ||
      !availabilityExceptions ||
      availabilityExceptions.length === 0
    )
      return null;

    const exceptions = availabilityExceptions.filter(
      (exception) =>
        exception.resourceId === resource.id && exception.isUnavailable
    );

    for (const exception of exceptions) {
      // Use date strings for comparison (already in YYYY-MM-DD format)
      if (
        selectedDate >= exception.startDate &&
        selectedDate <= exception.endDate
      ) {
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

    // Always clear time slot when date changes so user can see new available slots
    setTimeSlot("");
  };

  const handleConfirm = () => {
    if (date && timeSlot && !dateError) {
      onConfirm({ date, time: timeSlot });
      setDate("");
      setTimeSlot("");
      onClose();
    }
  };

  // Generate time slots based on working hours for the selected date
  const getAvailableTimeSlots = (): string[] => {
    if (
      !date ||
      !resource ||
      !availabilityRules ||
      availabilityRules.length === 0
    ) {
      // Default time slots if no working hours are set
      return [
        "08:00 - 10:00",
        "10:00 - 12:00",
        "12:00 - 14:00",
        "14:00 - 16:00",
        "16:00 - 18:00",
        "18:00 - 20:00",
      ];
    }

    // Parse date string (YYYY-MM-DD) and get day of week
    const dayOfWeek = getDay(parseISO(date)); // 0=Sunday, 1=Monday, ..., 6=Saturday

    // Find the working hours rule for this day
    const rule = availabilityRules.find(
      (r) => r.resourceId === resource.id && r.dayOfWeek === dayOfWeek
    );

    if (!rule) {
      // No working hours defined for this day
      return [];
    }

    // Parse open and close times
    const [openHour, openMinute] = rule.openTime.split(":").map(Number);
    const [closeHour, closeMinute] = rule.closeTime.split(":").map(Number);

    // Generate 2-hour time slots within working hours
    const slots: string[] = [];
    let currentHour = openHour;
    let currentMinute = openMinute;

    while (true) {
      const slotStart = `${String(currentHour).padStart(2, "0")}:${String(
        currentMinute
      ).padStart(2, "0")}`;

      // Add 2 hours for slot end
      let endHour = currentHour + 2;
      let endMinute = currentMinute;

      // Check if end time exceeds closing time
      const endTimeInMinutes = endHour * 60 + endMinute;
      const closeTimeInMinutes = closeHour * 60 + closeMinute;

      if (endTimeInMinutes > closeTimeInMinutes) {
        // Check if we can fit at least a partial slot (1 hour minimum)
        const remainingMinutes =
          closeTimeInMinutes - (currentHour * 60 + currentMinute);
        if (remainingMinutes >= 60) {
          // Create a slot that ends at closing time
          const slotEnd = `${String(closeHour).padStart(2, "0")}:${String(
            closeMinute
          ).padStart(2, "0")}`;
          slots.push(`${slotStart} - ${slotEnd}`);
        }
        break;
      }

      const slotEnd = `${String(endHour).padStart(2, "0")}:${String(
        endMinute
      ).padStart(2, "0")}`;
      slots.push(`${slotStart} - ${slotEnd}`);

      // Move to next slot (add 2 hours)
      currentHour += 2;

      // Check if we've reached or passed closing time
      if (currentHour * 60 + currentMinute >= closeTimeInMinutes) {
        break;
      }
    }

    return slots;
  };

  const timeSlots = getAvailableTimeSlots();

  // Get today's date for setting minimum date in date picker
  const today = format(new Date(), "yyyy-MM-dd");

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
            {timeSlots.length > 0 ? (
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
            ) : (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  {date
                    ? "This resource is not available on the selected day. Please choose another date."
                    : "Please select a date first to see available time slots."}
                </p>
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
