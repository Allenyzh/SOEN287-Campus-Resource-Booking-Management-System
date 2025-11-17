import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings } from "@/db/schema";
import { sql, count } from "drizzle-orm";

// GET /api/admin/reports/peak-times - Get peak booking times
export async function GET(request: NextRequest) {
  try {
    const db = getDbFromRequest(request);

    // Get booking counts by hour of day
    const peakTimes = await db
      .select({
        hour: sql<number>`CAST(strftime('%H', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`,
        bookingCount: count(),
      })
      .from(bookings)
      .groupBy(
        sql`CAST(strftime('%H', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`
      )
      .orderBy(
        sql`CAST(strftime('%H', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`
      );

    // Get booking counts by day of week
    const peakDays = await db
      .select({
        dayOfWeek: sql<number>`CAST(strftime('%w', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`,
        bookingCount: count(),
      })
      .from(bookings)
      .groupBy(
        sql`CAST(strftime('%w', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`
      )
      .orderBy(
        sql`CAST(strftime('%w', datetime(${bookings.startTime}, 'unixepoch')) AS INTEGER)`
      );

    return NextResponse.json({
      success: true,
      data: {
        byHour: peakTimes,
        byDayOfWeek: peakDays,
      },
    });
  } catch (error) {
    console.error("Error fetching peak times:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch peak times" },
      { status: 500 }
    );
  }
}
