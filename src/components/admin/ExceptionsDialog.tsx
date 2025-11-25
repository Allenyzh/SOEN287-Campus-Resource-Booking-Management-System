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
import { Badge } from "@/components/ui/badge";
import { Resource, AvailabilityException } from "@/stores/bookingStore";
import { Calendar, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ExceptionsDialogProps {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
  existingExceptions: AvailabilityException[];
  onSave: (exceptions: AvailabilityException[], deletedIds: number[]) => void;
}

const EXCEPTION_TYPES = [
  { value: "holiday", label: "Holiday", color: "bg-red-100 text-red-800" },
  {
    value: "maintenance",
    label: "Maintenance",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "special_event",
    label: "Special Event",
    color: "bg-purple-100 text-purple-800",
  },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
];

export function ExceptionsDialog({
  resource,
  open,
  onClose,
  existingExceptions,
  onSave,
}: ExceptionsDialogProps) {
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isUnavailable, setIsUnavailable] = useState(true);
  const [reason, setReason] = useState("");
  const [type, setType] = useState<
    "holiday" | "maintenance" | "special_event" | "other"
  >("maintenance");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // Get today's date for minimum date validation
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (open && resource) {
      setExceptions([...existingExceptions]);
      setDeletedIds([]); // Reset deleted IDs when opening
      // Reset form
      setStartDate("");
      setEndDate("");
      setIsUnavailable(true);
      setReason("");
      setType("maintenance");
    }
  }, [open, resource, existingExceptions]);

  const handleAddException = () => {
    if (!resource) return;

    // Validation
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      alert("Start date must be before or equal to end date.");
      return;
    }

    const newException: AvailabilityException = {
      id: Date.now() + Math.random(), // Temporary ID, will be replaced when saved to store
      resourceId: resource.id,
      startDate,
      endDate,
      isUnavailable,
      reason: reason.trim() || undefined,
      type,
    };

    setExceptions([...exceptions, newException]);

    // Reset form
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleDeleteException = (exceptionId: number) => {
    // Track deleted IDs (only if it's an existing exception from the database)
    const exceptionToDelete = exceptions.find((e) => e.id === exceptionId);
    if (
      exceptionToDelete &&
      existingExceptions.some((e) => e.id === exceptionId)
    ) {
      setDeletedIds([...deletedIds, exceptionId]);
    }
    setExceptions(exceptions.filter((e) => e.id !== exceptionId));
  };

  const handleSave = () => {
    if (!resource) return;
    onSave(exceptions, deletedIds);
    onClose();
  };

  const getTypeLabel = (typeValue: string) => {
    return (
      EXCEPTION_TYPES.find((t) => t.value === typeValue)?.label || typeValue
    );
  };

  const getTypeColor = (typeValue: string) => {
    return (
      EXCEPTION_TYPES.find((t) => t.value === typeValue)?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const sortedExceptions = [...exceptions].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Set Exceptions & Blackout Dates for {resource?.name}
          </DialogTitle>
          <DialogDescription>
            Define holidays, maintenance periods, or special availability
            exceptions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Exception Form */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Add Exception / Blackout Date
            </h3>

            <div className="space-y-4">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exception Type</label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(
                        e.target.value as
                          | "holiday"
                          | "maintenance"
                          | "special_event"
                          | "other"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {EXCEPTION_TYPES.map((t) => (
                      <option
                        key={t.value}
                        value={t.value}
                        className="dark:text-gray-600"
                      >
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={isUnavailable ? "blocked" : "available"}
                    onChange={(e) =>
                      setIsUnavailable(e.target.value === "blocked")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blocked" className="dark:text-gray-600">
                      Blocked (Unavailable)
                    </option>
                    <option value="available" className="dark:text-gray-600">
                      Special Availability
                    </option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Christmas Holiday, AC Maintenance, Special Conference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleAddException}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Add Exception
              </Button>
            </div>
          </div>

          {/* Existing Exceptions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Current Exceptions</h3>

            {sortedExceptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border rounded-lg">
                <p>
                  No exceptions set. Add exceptions above to block dates or set
                  special availability.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedExceptions.map((exception) => (
                  <div
                    key={exception.id}
                    className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(exception.type)}>
                          {getTypeLabel(exception.type)}
                        </Badge>
                        <Badge
                          variant={
                            exception.isUnavailable ? "destructive" : "default"
                          }
                        >
                          {exception.isUnavailable ? "Blocked" : "Available"}
                        </Badge>
                      </div>
                      <div className="text-sm font-medium">
                        {exception.reason}
                      </div>
                      <div className="text-xs text-gray-500">
                        {exception.startDate} to {exception.endDate}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteException(exception.id)}
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
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Blocked dates will prevent any
              bookings during the specified period. Use this for holidays,
              maintenance, or temporary closures.
            </div>
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
            Save Exceptions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
