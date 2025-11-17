import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { availabilityExceptions } from "@/db/schema";

// GET /api/availability/exceptions - Get availability exceptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId");

    const db = getDbFromRequest(request);

    const exceptions = await db.select().from(availabilityExceptions);

    // Filter by resourceId if provided
    const filteredExceptions = resourceId
      ? exceptions.filter((e) => e.resourceId === parseInt(resourceId))
      : exceptions;

    return NextResponse.json({ success: true, data: filteredExceptions });
  } catch (error) {
    console.error("Error fetching availability exceptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability exceptions" },
      { status: 500 }
    );
  }
}

// POST /api/availability/exceptions - Create availability exception
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, startDatetime, endDatetime, isUnavailable, reason } =
      body;

    if (!resourceId || !startDatetime || !endDatetime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const [newException] = await db
      .insert(availabilityExceptions)
      .values({
        resourceId,
        startDatetime: new Date(startDatetime),
        endDatetime: new Date(endDatetime),
        isUnavailable: isUnavailable ?? true,
        reason,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newException },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating availability exception:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create availability exception" },
      { status: 500 }
    );
  }
}
