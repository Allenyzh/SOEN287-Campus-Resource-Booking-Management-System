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
import { Resource, AvailabilityRule } from "@/stores/bookingStore";
import { Clock, Trash2 } from "lucide-react";

interface WorkingHoursDialogProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
  existingRules: AvailabilityRule[];
  onSave: (rules: AvailabilityRule[], deletedIds: number[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function WorkingHoursDialog({
  resource,
  open,
  onClose,
  existingRules,
  onSave,
}: WorkingHoursDialogProps) {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday by default
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    if (open && resource) {
      // Initialize with existing rules (keep the full rule with id)
      setRules([...existingRules]);
      setDeletedIds([]); // Reset deleted IDs when opening
    }
  }, [open, resource, existingRules]);

  const handleAddRule = () => {
    if (!resource) return;

    // Check if rule already exists for this day
    const exists = rules.some((r) => r.dayOfWeek === selectedDay);
    if (exists) {
      alert(
        "A rule already exists for this day. Please delete it first or use a different day."
      );
      return;
    }

    // Validate times
    if (openTime >= closeTime) {
      alert("Opening time must be before closing time.");
      return;
    }

    const newRule: AvailabilityRule = {
      id: Date.now() + Math.random(), // Temporary ID, will be replaced when saved to store
      resourceId: resource.id,
      dayOfWeek: selectedDay,
      openTime,
      closeTime,
    };

    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (ruleId: number) => {
    // Track deleted IDs (only if it's an existing rule from the database)
    const ruleToDelete = rules.find((r) => r.id === ruleId);
    if (ruleToDelete && existingRules.some((r) => r.id === ruleId)) {
      setDeletedIds([...deletedIds, ruleId]);
    }
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  const handleSave = () => {
    if (!resource) return;
    onSave(rules, deletedIds);
    onClose();
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === dayOfWeek)?.label || "";
  };

  const sortedRules = [...rules].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Set Working Hours for {resource?.name}
          </DialogTitle>
          <DialogDescription>
            Define the operating hours for each day of the week
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Rule Form */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Add Working Hours
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option
                      key={day.value}
                      value={day.value}
                      className="dark:text-gray-600"
                    >
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Open Time</label>
                <input
                  type="time"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Close Time</label>
                <input
                  type="time"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleAddRule}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Current Working Hours</h3>

            {sortedRules.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border rounded-lg">
                <p>
                  No working hours set. Add rules above to define operating
                  hours.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="font-medium w-24">
                        {getDayLabel(rule.dayOfWeek)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {rule.openTime} - {rule.closeTime}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> These hours define when the resource is
              available for booking. Bookings outside these hours will be
              prevented.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Working Hours
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
