import { NextRequest, NextResponse } from "next/server";
import { getDbFromRequest } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { parseISO } from "date-fns";

// GET /api/bookings/[id] - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = getDbFromRequest(request);

    // Get current booking to check its status
    const [currentBooking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)))
      .limit(1);

    if (!currentBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Parse date strings to Date objects if present
    const updates: any = { ...body };
    if (updates.startTime) {
      updates.startTime = parseISO(updates.startTime);
    }
    if (updates.endTime) {
      updates.endTime = parseISO(updates.endTime);
    }
    updates.updatedAt = new Date();

    // If user is modifying time/date (not just status change by admin),
    // reset status to pending for admin approval
    const isTimeChange = updates.startTime || updates.endTime;

    if (isTimeChange) {
      // If modifying a confirmed booking, reset to pending
      if (currentBooking.status === "confirmed" && !updates.status) {
        updates.status = "pending";
      }
      // If already pending, keep it pending
      if (currentBooking.status === "pending" && !updates.status) {
        updates.status = "pending";
      }
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel/Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    // Instead of deleting, update status to cancelled
    const [cancelledBooking] = await db
      .update(bookings)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (!cancelledBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
