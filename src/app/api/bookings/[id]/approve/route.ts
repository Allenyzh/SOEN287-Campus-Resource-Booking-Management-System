import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/bookings/[id]/approve - Approve booking (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [approvedBooking] = await db
      .update(bookings)
      .set({
        status: "confirmed",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (!approvedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking approved successfully",
      data: approvedBooking,
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to approve booking" },
      { status: 500 }
    );
  }
}
