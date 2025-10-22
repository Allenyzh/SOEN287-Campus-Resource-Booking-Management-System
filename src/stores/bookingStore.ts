import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  capacity: number;
  location: string;
  available: boolean;
  image?: string;
}

export interface Booking {
  id: number;
  resourceId: number;
  resourceName: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  userName: string;
}

export interface AvailabilityRule {
  id: number;
  resourceId: number;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  openTime: string; // "HH:mm" format, e.g., "08:00"
  closeTime: string; // "HH:mm" format, e.g., "20:00"
}

export interface AvailabilityException {
  id: number;
  resourceId: number;
  startDate: string; // "YYYY-MM-DD" format
  endDate: string; // "YYYY-MM-DD" format
  isUnavailable: boolean; // true = blocked/unavailable, false = special availability
  reason?: string; // Optional reason/description
  type: "holiday" | "maintenance" | "special_event" | "other";
}

interface BookingStore {
  resources: Resource[];
  bookings: Booking[];
  availabilityRules: AvailabilityRule[];
  availabilityExceptions: AvailabilityException[];

  // User booking functions
  addBooking: (booking: Omit<Booking, "id">) => void;
  updateBooking: (id: number, updates: { date: string; time: string }) => void;
  cancelBooking: (id: number) => void;
  updateBookingStatus: (id: number, status: Booking["status"]) => void;
  getBookingsByResource: (resourceId: number) => Booking[];
  getUserBookings: (userName: string) => Booking[];

  // Admin resource management functions
  addResource: (resource: Omit<Resource, "id">) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: number) => void;
  toggleResourceAvailability: (id: number) => void;

  // Availability rules management
  addAvailabilityRule: (rule: Omit<AvailabilityRule, "id">) => void;
  updateAvailabilityRule: (rule: AvailabilityRule) => void;
  deleteAvailabilityRule: (id: number) => void;
  getAvailabilityRulesByResource: (resourceId: number) => AvailabilityRule[];

  // Availability exceptions management
  addAvailabilityException: (
    exception: Omit<AvailabilityException, "id">
  ) => void;
  updateAvailabilityException: (exception: AvailabilityException) => void;
  deleteAvailabilityException: (id: number) => void;
  getAvailabilityExceptionsByResource: (
    resourceId: number
  ) => AvailabilityException[];

  // Availability validation functions
  isDateAvailable: (
    resourceId: number,
    date: string
  ) => {
    available: boolean;
    reason?: string;
  };
  getAvailableTimeSlots: (resourceId: number, date: string) => string[];
  isTimeSlotAvailable: (
    resourceId: number,
    date: string,
    timeSlot: string
  ) => {
    available: boolean;
    reason?: string;
  };
}

// Mock resource data
const mockResources: Resource[] = [
  {
    id: 1,
    name: "Study Room 101",
    description: "Quiet study room with whiteboard and projector",
    category: "Study Room",
    capacity: 8,
    location: "Library Building, Floor 1",
    available: true,
  },
  {
    id: 2,
    name: "Computer Lab 2",
    description: "Lab with 30 high-performance computers",
    category: "Computer Lab",
    capacity: 30,
    location: "Engineering Building, Floor 2",
    available: true,
  },
  {
    id: 3,
    name: "Conference Room A",
    description: "Large conference room with video conferencing equipment",
    category: "Conference Room",
    capacity: 20,
    location: "Administration Building, Floor 3",
    available: true,
  },
  {
    id: 4,
    name: "Study Room 205",
    description: "Small group study room with comfortable seating",
    category: "Study Room",
    capacity: 6,
    location: "Library Building, Floor 2",
    available: true,
  },
  {
    id: 5,
    name: "Media Lab",
    description: "Multimedia production lab with editing equipment",
    category: "Computer Lab",
    capacity: 15,
    location: "Arts Building, Floor 1",
    available: false,
  },
  {
    id: 6,
    name: "Presentation Room B",
    description: "Professional presentation room with smart board",
    category: "Conference Room",
    capacity: 12,
    location: "Business Building, Floor 2",
    available: true,
  },
  {
    id: 7,
    name: "Group Study Space 3",
    description: "Open collaborative space with movable furniture",
    category: "Study Room",
    capacity: 10,
    location: "Library Building, Floor 3",
    available: true,
  },
  {
    id: 8,
    name: "VR Lab",
    description: "Virtual reality lab with latest VR equipment",
    category: "Computer Lab",
    capacity: 8,
    location: "Engineering Building, Floor 4",
    available: true,
  },
];

// Mock initial booking data with more comprehensive data for analytics
const mockBookings: Booking[] = [
  // Study Room 101 bookings (most popular)
  {
    id: 1,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-20",
    time: "10:00 - 12:00",
    status: "Confirmed",
    userName: "Student A",
  },
  {
    id: 2,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-21",
    time: "14:00 - 16:00",
    status: "Confirmed",
    userName: "Student B",
  },
  {
    id: 3,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-22",
    time: "09:00 - 11:00",
    status: "Confirmed",
    userName: "Student C",
  },
  {
    id: 4,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-23",
    time: "15:00 - 17:00",
    status: "Confirmed",
    userName: "Student D",
  },
  {
    id: 5,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-24",
    time: "11:00 - 13:00",
    status: "Confirmed",
    userName: "Student E",
  },
  // Computer Lab 2 bookings
  {
    id: 6,
    resourceId: 2,
    resourceName: "Computer Lab 2",
    date: "2025-10-20",
    time: "13:00 - 15:00",
    status: "Confirmed",
    userName: "Student F",
  },
  {
    id: 7,
    resourceId: 2,
    resourceName: "Computer Lab 2",
    date: "2025-10-21",
    time: "10:00 - 12:00",
    status: "Confirmed",
    userName: "Student G",
  },
  {
    id: 8,
    resourceId: 2,
    resourceName: "Computer Lab 2",
    date: "2025-10-22",
    time: "14:00 - 16:00",
    status: "Pending",
    userName: "Student H",
  },
  {
    id: 9,
    resourceId: 2,
    resourceName: "Computer Lab 2",
    date: "2025-10-24",
    time: "16:00 - 18:00",
    status: "Confirmed",
    userName: "Student I",
  },
  // Conference Room A bookings
  {
    id: 10,
    resourceId: 3,
    resourceName: "Conference Room A",
    date: "2025-10-21",
    time: "09:00 - 11:00",
    status: "Confirmed",
    userName: "Professor A",
  },
  {
    id: 11,
    resourceId: 3,
    resourceName: "Conference Room A",
    date: "2025-10-23",
    time: "14:00 - 16:00",
    status: "Confirmed",
    userName: "Professor B",
  },
  {
    id: 12,
    resourceId: 3,
    resourceName: "Conference Room A",
    date: "2025-10-25",
    time: "10:00 - 12:00",
    status: "Confirmed",
    userName: "Professor C",
  },
  // Study Room 205 bookings
  {
    id: 13,
    resourceId: 4,
    resourceName: "Study Room 205",
    date: "2025-10-20",
    time: "08:00 - 10:00",
    status: "Confirmed",
    userName: "Student J",
  },
  {
    id: 14,
    resourceId: 4,
    resourceName: "Study Room 205",
    date: "2025-10-22",
    time: "19:00 - 21:00",
    status: "Confirmed",
    userName: "Student K",
  },
  // Presentation Room B bookings
  {
    id: 15,
    resourceId: 6,
    resourceName: "Presentation Room B",
    date: "2025-10-21",
    time: "16:00 - 18:00",
    status: "Confirmed",
    userName: "Student L",
  },
  {
    id: 16,
    resourceId: 6,
    resourceName: "Presentation Room B",
    date: "2025-10-24",
    time: "13:00 - 15:00",
    status: "Pending",
    userName: "Student M",
  },
  // Group Study Space 3 bookings
  {
    id: 17,
    resourceId: 7,
    resourceName: "Group Study Space 3",
    date: "2025-10-20",
    time: "15:00 - 17:00",
    status: "Confirmed",
    userName: "Student N",
  },
  {
    id: 18,
    resourceId: 7,
    resourceName: "Group Study Space 3",
    date: "2025-10-23",
    time: "11:00 - 13:00",
    status: "Confirmed",
    userName: "Student O",
  },
  // VR Lab bookings
  {
    id: 19,
    resourceId: 8,
    resourceName: "VR Lab",
    date: "2025-10-22",
    time: "10:00 - 12:00",
    status: "Confirmed",
    userName: "Student P",
  },
  // Some cancelled bookings
  {
    id: 20,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-19",
    time: "14:00 - 16:00",
    status: "Cancelled",
    userName: "Student Q",
  },
];

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      resources: mockResources,
      bookings: mockBookings,
      availabilityRules: [],
      availabilityExceptions: [],

      // User booking functions
      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: Date.now(), // 简单的 ID 生成
        };
        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
      },

      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, date: updates.date, time: updates.time }
              : booking
          ),
        }));
      },

      cancelBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, status: "Cancelled" as const }
              : booking
          ),
        }));
      },

      updateBookingStatus: (id, status) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status } : booking
          ),
        }));
      },

      getBookingsByResource: (resourceId) => {
        return get().bookings.filter(
          (booking) => booking.resourceId === resourceId
        );
      },

      getUserBookings: (userName) => {
        return get().bookings.filter(
          (booking) => booking.userName === userName
        );
      },

      // Admin resource management functions
      addResource: (resource) => {
        const newResource: Resource = {
          ...resource,
          id: Date.now(),
          available: true,
        };
        set((state) => ({
          resources: [...state.resources, newResource],
        }));
      },

      updateResource: (updatedResource) => {
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === updatedResource.id ? updatedResource : resource
          ),
        }));
      },

      deleteResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((resource) => resource.id !== id),
        }));
      },

      toggleResourceAvailability: (id) => {
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === id
              ? { ...resource, available: !resource.available }
              : resource
          ),
        }));
      },

      // Availability rules management
      addAvailabilityRule: (rule) => {
        const newRule: AvailabilityRule = {
          ...rule,
          id: Date.now(),
        };
        set((state) => ({
          availabilityRules: [...state.availabilityRules, newRule],
        }));
      },

      updateAvailabilityRule: (updatedRule) => {
        set((state) => ({
          availabilityRules: state.availabilityRules.map((rule) =>
            rule.id === updatedRule.id ? updatedRule : rule
          ),
        }));
      },

      deleteAvailabilityRule: (id) => {
        set((state) => ({
          availabilityRules: state.availabilityRules.filter(
            (rule) => rule.id !== id
          ),
        }));
      },

      getAvailabilityRulesByResource: (resourceId) => {
        return get().availabilityRules.filter(
          (rule) => rule.resourceId === resourceId
        );
      },

      // Availability exceptions management
      addAvailabilityException: (exception) => {
        const newException: AvailabilityException = {
          ...exception,
          id: Date.now(),
        };
        set((state) => ({
          availabilityExceptions: [
            ...state.availabilityExceptions,
            newException,
          ],
        }));
      },

      updateAvailabilityException: (updatedException) => {
        set((state) => ({
          availabilityExceptions: state.availabilityExceptions.map(
            (exception) =>
              exception.id === updatedException.id
                ? updatedException
                : exception
          ),
        }));
      },

      deleteAvailabilityException: (id) => {
        set((state) => ({
          availabilityExceptions: state.availabilityExceptions.filter(
            (exception) => exception.id !== id
          ),
        }));
      },

      getAvailabilityExceptionsByResource: (resourceId) => {
        return get().availabilityExceptions.filter(
          (exception) => exception.resourceId === resourceId
        );
      },

      // Availability validation functions
      isDateAvailable: (resourceId, date) => {
        const state = get();
        const exceptions = state.availabilityExceptions.filter(
          (ex) => ex.resourceId === resourceId
        );

        // Check if date falls within any exception period
        const dateObj = new Date(date);
        for (const exception of exceptions) {
          const startDate = new Date(exception.startDate);
          const endDate = new Date(exception.endDate);

          if (dateObj >= startDate && dateObj <= endDate) {
            if (exception.isUnavailable) {
              return {
                available: false,
                reason: `${exception.type}: ${
                  exception.reason || "Not available"
                }`,
              };
            }
          }
        }

        // Check if day of week has availability rules
        const dayOfWeek = dateObj.getDay();
        const rules = state.availabilityRules.filter(
          (rule) =>
            rule.resourceId === resourceId && rule.dayOfWeek === dayOfWeek
        );

        if (rules.length === 0) {
          // No rules defined for this day, assume unavailable
          return {
            available: false,
            reason: "No availability rules defined for this day",
          };
        }

        return { available: true };
      },

      getAvailableTimeSlots: (resourceId, date) => {
        const state = get();
        const dateAvailability = state.isDateAvailable(resourceId, date);

        if (!dateAvailability.available) {
          return [];
        }

        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();

        // Get availability rules for this day
        const rules = state.availabilityRules.filter(
          (rule) =>
            rule.resourceId === resourceId && rule.dayOfWeek === dayOfWeek
        );

        if (rules.length === 0) {
          return [];
        }

        // Generate time slots based on rules
        const allTimeSlots = [
          "08:00 - 10:00",
          "10:00 - 12:00",
          "12:00 - 14:00",
          "14:00 - 16:00",
          "16:00 - 18:00",
          "18:00 - 20:00",
        ];

        const availableSlots = allTimeSlots.filter((slot) => {
          const [startTime] = slot.split(" - ");
          const [endTime] = slot.split(" - ")[1];

          // Check if time slot falls within any rule's open hours
          return rules.some((rule) => {
            return startTime >= rule.openTime && endTime <= rule.closeTime;
          });
        });

        // Filter out already booked slots
        const existingBookings = state.bookings.filter(
          (booking) =>
            booking.resourceId === resourceId &&
            booking.date === date &&
            booking.status !== "Cancelled"
        );

        return availableSlots.filter(
          (slot) => !existingBookings.some((booking) => booking.time === slot)
        );
      },

      isTimeSlotAvailable: (resourceId, date, timeSlot) => {
        const state = get();

        // First check if date is available
        const dateAvailability = state.isDateAvailable(resourceId, date);
        if (!dateAvailability.available) {
          return dateAvailability;
        }

        // Check if time slot is in available slots
        const availableSlots = state.getAvailableTimeSlots(resourceId, date);
        if (!availableSlots.includes(timeSlot)) {
          return {
            available: false,
            reason: "Time slot is not available or already booked",
          };
        }

        return { available: true };
      },
    }),
    {
      name: "booking-storage",
    }
  )
);
