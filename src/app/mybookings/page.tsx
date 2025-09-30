"use client";

import { columns, BookingColumn } from "./columns";
import { DataTable } from "./DataTable";

export default function page() {
  const bookings: BookingColumn[] = [
    {
      id: 1,
      resourceName: "Resource 1",
      bookingDate: "2024-07-01",
      status: "Confirmed",
    },
    {
      id: 2,
      resourceName: "Resource 2",
      bookingDate: "2024-07-05",
      status: "Pending",
    },
    {
      id: 3,
      resourceName: "Resource 3",
      bookingDate: "2024-07-10",
      status: "Cancelled",
    },
  ];

  return (
    <div className="flex-1 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <DataTable columns={columns} data={bookings} />
    </div>
  );
}
