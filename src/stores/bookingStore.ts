import { create } from "zustand";

export interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId?: number;
  capacity: number;
  location: string;
  available: boolean;
  status?: "available" | "unavailable";
  imageUrl?: string;
  requiresApproval?: boolean;
}

export interface Booking {
  id: number;
  resourceId: number;
  resourceName: string;
  userId: number;
  userName?: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
  createdAt?: string;
}

export interface ResourceCategory {
  id: number;
  name: string;
  description?: string;
}

export interface AvailabilityRule {
  id: number;
  resourceId: number;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  openTime: string; // Format: "HH:mm"
  closeTime: string; // Format: "HH:mm"
}

export interface AvailabilityException {
  id: number;
  resourceId: number;
  startDate: string;
  endDate: string;
  isUnavailable: boolean;
  reason?: string;
  type?: string;
}

interface BookingStore {
  resources: Resource[];
  bookings: Booking[];
  categories: ResourceCategory[];
  availabilityExceptions: AvailabilityException[];
  availabilityRules: AvailabilityRule[];
  isLoading: boolean;

  // Fetch data from API
  fetchResources: () => Promise<void>;
  fetchBookings: (userId?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAvailabilityExceptions: (resourceId?: number) => Promise<void>;
  fetchAvailabilityRules: (resourceId?: number) => Promise<void>;

  // User booking functions
  createBooking: (booking: {
    userId: number;
    resourceId: number;
    startTime: string;
    endTime: string;
    purpose?: string;
  }) => Promise<void>;
  updateBooking: (
    id: number,
    updates: { startTime?: string; endTime?: string; purpose?: string }
  ) => Promise<void>;
  cancelBooking: (id: number) => Promise<void>;

  // Admin functions
  createResource: (resource: Omit<Resource, "id">) => Promise<void>;
  updateResource: (id: number, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (id: number) => Promise<void>;
  approveBooking: (id: number) => Promise<void>;
  rejectBooking: (id: number, reason?: string) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  resources: [],
  bookings: [],
  categories: [],
  availabilityExceptions: [],
  availabilityRules: [],
  isLoading: false,

  fetchResources: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/resources");
      const result = await response.json();

      if (result.success) {
        const resources: Resource[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          category: item.category?.name || "Uncategorized",
          categoryId: item.categoryId,
          capacity: item.capacity || 0,
          location: item.location || "",
          available: item.status === "available",
          status: item.status,
          imageUrl: item.imageUrl,
          requiresApproval: item.requiresApproval,
        }));

        set({ resources, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      set({ isLoading: false });
    }
  },

  fetchBookings: async (userId?: number) => {
    set({ isLoading: true });
    try {
      const url = userId ? `/api/bookings?userId=${userId}` : "/api/bookings";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        const bookings: Booking[] = result.data.map((item: any) => ({
          id: item.id,
          resourceId: item.resourceId,
          resourceName: item.resource?.name || "Unknown",
          userId: item.userId,
          userName: item.user?.name,
          startTime: item.startTime,
          endTime: item.endTime,
          purpose: item.purpose,
          status: item.status,
          createdAt: item.createdAt,
        }));

        set({ bookings, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();

      if (result.success) {
        set({ categories: result.data });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  fetchAvailabilityExceptions: async (resourceId?: number) => {
    try {
      // If resourceId is provided, fetch for specific resource, otherwise fetch all
      if (resourceId) {
        const response = await fetch(
          `/api/resources/${resourceId}/availability-exceptions`
        );
        const result = await response.json();

        if (result.success) {
          // Update only exceptions for this resource
          set((state) => ({
            availabilityExceptions: [
              ...state.availabilityExceptions.filter(
                (e) => e.resourceId !== resourceId
              ),
              ...result.data,
            ],
          }));
        }
      } else {
        // Fetch all exceptions for all resources
        const resources = get().resources;
        const allExceptions: AvailabilityException[] = [];

        for (const resource of resources) {
          const response = await fetch(
            `/api/resources/${resource.id}/availability-exceptions`
          );
          const result = await response.json();

          if (result.success) {
            allExceptions.push(...result.data);
          }
        }

        set({ availabilityExceptions: allExceptions });
      }
    } catch (error) {
      console.error("Failed to fetch availability exceptions:", error);
    }
  },

  fetchAvailabilityRules: async (resourceId?: number) => {
    try {
      // If resourceId is provided, fetch for specific resource, otherwise fetch all
      if (resourceId) {
        const response = await fetch(
          `/api/resources/${resourceId}/availability-rules`
        );
        const result = await response.json();

        if (result.success) {
          // Update only rules for this resource
          set((state) => ({
            availabilityRules: [
              ...state.availabilityRules.filter(
                (r) => r.resourceId !== resourceId
              ),
              ...result.data,
            ],
          }));
        }
      } else {
        // Fetch all rules for all resources
        const resources = get().resources;
        const allRules: AvailabilityRule[] = [];

        for (const resource of resources) {
          const response = await fetch(
            `/api/resources/${resource.id}/availability-rules`
          );
          const result = await response.json();

          if (result.success) {
            allRules.push(...result.data);
          }
        }

        set({ availabilityRules: allRules });
      }
    } catch (error) {
      console.error("Failed to fetch availability rules:", error);
    }
  },

  createBooking: async (booking) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create booking");
      }

      // Refresh bookings
      await get().fetchBookings(booking.userId);
    } catch (error) {
      throw error;
    }
  },

  updateBooking: async (id, updates) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update booking");
      }

      // Update local state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (id) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to cancel booking");
      }

      // Update local state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: "cancelled" as const } : b
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  createResource: async (resource) => {
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create resource");
      }

      // Refresh resources
      await get().fetchResources();
    } catch (error) {
      throw error;
    }
  },

  updateResource: async (id, updates) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update resource");
      }

      // Refresh resources
      await get().fetchResources();
    } catch (error) {
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete resource");
      }

      // Update local state
      set((state) => ({
        resources: state.resources.filter((r) => r.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  approveBooking: async (id) => {
    try {
      const response = await fetch(`/api/bookings/${id}/approve`, {
        method: "POST",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to approve booking");
      }

      // Update local state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: "confirmed" as const } : b
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  rejectBooking: async (id, reason) => {
    try {
      const response = await fetch(`/api/bookings/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to reject booking");
      }

      // Update local state
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: "rejected" as const } : b
        ),
      }));
    } catch (error) {
      throw error;
    }
  },
}));
