import { NextRequest, NextResponse } from "next/server";
import { getDbFromRequest } from "@/db";
import { availabilityRules } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/resources/:id/availability-rules - Get all availability rules for a resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { success: false, error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);
    const rules = await db
      .select()
      .from(availabilityRules)
      .where(eq(availabilityRules.resourceId, resourceId));

    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    console.error("Error fetching availability rules:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability rules" },
      { status: 500 }
    );
  }
}

// POST /api/resources/:id/availability-rules - Create or update availability rules
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);

    if (isNaN(resourceId)) {
      return NextResponse.json(
        { success: false, error: "Invalid resource ID" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);
    const body = await request.json();
    const { rules, deletedIds } = body;

    // Delete removed rules
    if (deletedIds && deletedIds.length > 0) {
      for (const id of deletedIds) {
        await db
          .delete(availabilityRules)
          .where(
            and(
              eq(availabilityRules.id, id),
              eq(availabilityRules.resourceId, resourceId)
            )
          );
      }
    }

    // Insert new rules (ones without a valid database ID)
    const newRules = rules.filter(
      (rule: any) => !rule.id || rule.id > 1000000000 // Temporary IDs are timestamps
    );

    if (newRules.length > 0) {
      for (const rule of newRules) {
        await db.insert(availabilityRules).values({
          resourceId,
          dayOfWeek: rule.dayOfWeek,
          openTime: rule.openTime,
          closeTime: rule.closeTime,
        });
      }
    }

    // Fetch all current rules
    const updatedRules = await db
      .select()
      .from(availabilityRules)
      .where(eq(availabilityRules.resourceId, resourceId));

    return NextResponse.json({ success: true, data: updatedRules });
  } catch (error) {
    console.error("Error saving availability rules:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save availability rules" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/:id/availability-rules - Delete a specific rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get("ruleId");

    if (isNaN(resourceId) || !ruleId) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);
    await db
      .delete(availabilityRules)
      .where(
        and(
          eq(availabilityRules.id, parseInt(ruleId)),
          eq(availabilityRules.resourceId, resourceId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting availability rule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete availability rule" },
      { status: 500 }
    );
  }
}
