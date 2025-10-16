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

interface BookingStore {
  resources: Resource[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id">) => void;
  cancelBooking: (id: number) => void;
  updateBookingStatus: (id: number, status: Booking["status"]) => void;
  getBookingsByResource: (resourceId: number) => Booking[];
  getUserBookings: (userName: string) => Booking[];
}

// 模拟资源数据
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

// 模拟初始预订数据
const mockBookings: Booking[] = [
  {
    id: 1,
    resourceId: 1,
    resourceName: "Study Room 101",
    date: "2025-10-20",
    time: "10:00 - 12:00",
    status: "Confirmed",
    userName: "Student",
  },
  {
    id: 2,
    resourceId: 2,
    resourceName: "Computer Lab 2",
    date: "2025-10-22",
    time: "14:00 - 16:00",
    status: "Pending",
    userName: "Student",
  },
];

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      resources: mockResources,
      bookings: mockBookings,

      addBooking: (booking) => {
        const newBooking: Booking = {
          ...booking,
          id: Date.now(), // 简单的 ID 生成
        };
        set((state) => ({
          bookings: [...state.bookings, newBooking],
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
    }),
    {
      name: "booking-storage",
    }
  )
);
