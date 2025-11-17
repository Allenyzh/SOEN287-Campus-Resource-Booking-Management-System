import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings, resources, users } from "@/db/schema";
import { sql, eq, and, gte, lte, count } from "drizzle-orm";

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const db = getDbFromRequest(request);

    // Total resources
    const [{ totalResources }] = await db
      .select({ totalResources: count() })
      .from(resources);

    // Total users
    const [{ totalUsers }] = await db
      .select({ totalUsers: count() })
      .from(users);

    // Total bookings
    const [{ totalBookings }] = await db
      .select({ totalBookings: count() })
      .from(bookings);

    // Active bookings (confirmed and pending)
    const activeBookings = await db
      .select({ count: count() })
      .from(bookings)
      .where(
        sql`${bookings.status} IN ('confirmed', 'pending') AND ${bookings.endTime} > ${new Date()}`
      );

    // Bookings by status
    const bookingsByStatus = await db
      .select({
        status: bookings.status,
        count: count(),
      })
      .from(bookings)
      .groupBy(bookings.status);

    return NextResponse.json({
      success: true,
      data: {
        totalResources,
        totalUsers,
        totalBookings,
        activeBookings: activeBookings[0]?.count || 0,
        bookingsByStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
