import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings, resources } from "@/db/schema";
import { sql, count, desc } from "drizzle-orm";

// GET /api/admin/reports/popular-resources - Get most popular resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const db = getDbFromRequest(request);

    const popularResources = await db
      .select({
        resourceId: bookings.resourceId,
        resourceName: resources.name,
        bookingCount: count(),
      })
      .from(bookings)
      .leftJoin(resources, sql`${bookings.resourceId} = ${resources.id}`)
      .groupBy(bookings.resourceId, resources.name)
      .orderBy(desc(count()))
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: popularResources,
    });
  } catch (error) {
    console.error("Error fetching popular resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular resources" },
      { status: 500 }
    );
  }
}
