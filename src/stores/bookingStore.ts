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

interface BookingStore {
  resources: Resource[];
  bookings: Booking[];
  categories: ResourceCategory[];
  isLoading: boolean;

  // Fetch data from API
  fetchResources: () => Promise<void>;
  fetchBookings: (userId?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;

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
