import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/bookings/[id]/reject - Reject booking (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const db = getDbFromRequest(request);

    const [rejectedBooking] = await db
      .update(bookings)
      .set({
        status: "rejected",
        purpose: reason
          ? `${reason} (Original: ${(
              await db
                .select()
                .from(bookings)
                .where(eq(bookings.id, parseInt(id)))
                .limit(1)
            )[0]?.purpose})`
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (!rejectedBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking rejected successfully",
      data: rejectedBooking,
    });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reject booking" },
      { status: 500 }
    );
  }
}
