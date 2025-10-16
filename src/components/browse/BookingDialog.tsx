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
import { Calendar, Clock } from "lucide-react";

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

  const handleConfirm = () => {
    if (date && timeSlot) {
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

  // 获取今天的日期，用于设置最小日期
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
          <Button onClick={handleConfirm} disabled={!date || !timeSlot}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
