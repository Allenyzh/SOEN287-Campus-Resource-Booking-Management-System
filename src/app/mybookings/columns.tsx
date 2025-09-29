"use client";

import { ColumnDef } from "@tanstack/react-table";

export type BookingColumn = {
  id: number;
  resourceName: string;
  bookingDate: string;
  status: string;
};

export const columns: ColumnDef<BookingColumn>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
  },
  {
    accessorKey: "resourceName",
    header: () => <div className="text-center">Resource Name</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.resourceName}</div>
    ),
  },
  {
    accessorKey: "bookingDate",
    header: () => <div className="text-center">Booking Date</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.bookingDate}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => <div className="text-center">{row.original.status}</div>,
  },
];
