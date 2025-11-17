import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { availabilityExceptions } from "@/db/schema";
import { eq } from "drizzle-orm";

// DELETE /api/availability/exceptions/[id] - Delete availability exception
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [deletedException] = await db
      .delete(availabilityExceptions)
      .where(eq(availabilityExceptions.id, parseInt(id)))
      .returning({ id: availabilityExceptions.id });

    if (!deletedException) {
      return NextResponse.json(
        { success: false, error: "Availability exception not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Availability exception deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability exception:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete availability exception" },
      { status: 500 }
    );
  }
}
