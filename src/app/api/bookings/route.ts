import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { bookings, resources, users } from "@/db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { parseISO } from "date-fns";

// GET /api/bookings - Get all bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const resourceId = searchParams.get("resourceId");
    const status = searchParams.get("status");

    const db = getDbFromRequest(request);

    const query = db
      .select({
        id: bookings.id,
        userId: bookings.userId,
        resourceId: bookings.resourceId,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        purpose: bookings.purpose,
        status: bookings.status,
        createdAt: bookings.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        resource: {
          id: resources.id,
          name: resources.name,
          location: resources.location,
        },
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(resources, eq(bookings.resourceId, resources.id));

    const allBookings = await query;

    // Filter in memory for now (for complex queries, use SQL WHERE)
    let filteredBookings = allBookings;

    if (userId) {
      filteredBookings = filteredBookings.filter(
        (b) => b.userId === parseInt(userId)
      );
    }

    if (resourceId) {
      filteredBookings = filteredBookings.filter(
        (b) => b.resourceId === parseInt(resourceId)
      );
    }

    if (status) {
      filteredBookings = filteredBookings.filter((b) => b.status === status);
    }

    return NextResponse.json({ success: true, data: filteredBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, resourceId, startTime, endTime, purpose } = body;

    if (!userId || !resourceId || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    // Parse ISO date strings properly
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    // Check for booking conflicts
    const conflicts = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.resourceId, resourceId),
          or(
            // New booking starts during existing booking
            and(gte(bookings.startTime, start), lte(bookings.startTime, end)),
            // New booking ends during existing booking
            and(gte(bookings.endTime, start), lte(bookings.endTime, end)),
            // New booking encompasses existing booking
            and(lte(bookings.startTime, start), gte(bookings.endTime, end))
          )
        )
      );

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Time slot conflict with existing booking",
          conflicts,
        },
        { status: 409 }
      );
    }

    // All bookings require admin approval - default status is 'pending'
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId,
        resourceId,
        startTime: start,
        endTime: end,
        purpose,
        status: "pending", // All bookings start as pending
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
