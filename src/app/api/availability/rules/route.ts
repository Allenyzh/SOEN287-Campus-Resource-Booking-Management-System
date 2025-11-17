import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { availabilityRules } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/availability/rules - Get availability rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resourceId");

    const db = getDbFromRequest(request);

    const query = db.select().from(availabilityRules);

    const rules = await query;

    // Filter by resourceId if provided
    const filteredRules = resourceId
      ? rules.filter((r) => r.resourceId === parseInt(resourceId))
      : rules;

    return NextResponse.json({ success: true, data: filteredRules });
  } catch (error) {
    console.error("Error fetching availability rules:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability rules" },
      { status: 500 }
    );
  }
}

// POST /api/availability/rules - Create availability rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, dayOfWeek, openTime, closeTime } = body;

    if (
      resourceId === undefined ||
      dayOfWeek === undefined ||
      !openTime ||
      !closeTime
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const [newRule] = await db
      .insert(availabilityRules)
      .values({
        resourceId,
        dayOfWeek,
        openTime,
        closeTime,
      })
      .returning();

    return NextResponse.json({ success: true, data: newRule }, { status: 201 });
  } catch (error) {
    console.error("Error creating availability rule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create availability rule" },
      { status: 500 }
    );
  }
}
