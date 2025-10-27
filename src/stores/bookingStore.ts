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

const mockBookings: Booking[] = [];

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
          id: Date.now(),
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
    }),
    {
      name: "booking-storage",
    }
  )
);
