import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings, resources } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { parseISO, differenceInHours } from "date-fns";

// GET /api/admin/reports/resource-usage/[id] - Get usage report for specific resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const db = getDbFromRequest(request);

    // Get resource info
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, parseInt(id)))
      .limit(1);

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Build query for bookings
    const whereConditions = [eq(bookings.resourceId, parseInt(id))];

    if (startDate) {
      whereConditions.push(
        sql`${bookings.startTime} >= ${new Date(startDate)}`
      );
    }

    if (endDate) {
      whereConditions.push(sql`${bookings.endTime} <= ${new Date(endDate)}`);
    }

    // Get total bookings
    const totalBookings = await db
      .select()
      .from(bookings)
      .where(sql`${whereConditions.join(" AND ")}`);

    // Get bookings by status
    const bookingsByStatus = await db
      .select({
        status: bookings.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(bookings)
      .where(sql`${whereConditions.join(" AND ")}`)
      .groupBy(bookings.status);

    // Calculate utilization rate
    // (This is simplified - in production, you'd want to consider availability rules)
    const totalHours = allBookings.reduce((sum, booking) => {
      const start = parseISO(booking.startTime);
      const end = parseISO(booking.endTime);
      const hours = differenceInHours(end, start);
      return sum + hours;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        resource: {
          id: resource.id,
          name: resource.name,
          location: resource.location,
        },
        totalBookings: totalBookings.length,
        totalHours: Math.round(totalHours * 10) / 10,
        bookingsByStatus,
        bookings: totalBookings,
      },
    });
  } catch (error) {
    console.error("Error fetching resource usage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource usage" },
      { status: 500 }
    );
  }
}
