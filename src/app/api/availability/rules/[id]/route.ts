import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { availabilityRules } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT /api/availability/rules/[id] - Update availability rule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = getDbFromRequest(request);

    const [updatedRule] = await db
      .update(availabilityRules)
      .set(body)
      .where(eq(availabilityRules.id, parseInt(id)))
      .returning();

    if (!updatedRule) {
      return NextResponse.json(
        { success: false, error: "Availability rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedRule });
  } catch (error) {
    console.error("Error updating availability rule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update availability rule" },
      { status: 500 }
    );
  }
}

// DELETE /api/availability/rules/[id] - Delete availability rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [deletedRule] = await db
      .delete(availabilityRules)
      .where(eq(availabilityRules.id, parseInt(id)))
      .returning({ id: availabilityRules.id });

    if (!deletedRule) {
      return NextResponse.json(
        { success: false, error: "Availability rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Availability rule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability rule:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete availability rule" },
      { status: 500 }
    );
  }
}
