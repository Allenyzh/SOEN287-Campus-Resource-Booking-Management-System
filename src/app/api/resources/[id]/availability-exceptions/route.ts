import { NextRequest, NextResponse } from "next/server";
import { getDbFromRequest } from "@/db";
import { availabilityExceptions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { format, parseISO } from "date-fns";

// GET /api/resources/:id/availability-exceptions - Get all availability exceptions for a resource
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
    const exceptions = await db
      .select()
      .from(availabilityExceptions)
      .where(eq(availabilityExceptions.resourceId, resourceId));

    // Convert timestamps to date strings for frontend
    const formattedExceptions = exceptions.map((exception) => ({
      ...exception,
      startDate: exception.startDatetime
        ? format(new Date(exception.startDatetime), "yyyy-MM-dd")
        : "",
      endDate: exception.endDatetime
        ? format(new Date(exception.endDatetime), "yyyy-MM-dd")
        : "",
    }));

    return NextResponse.json({ success: true, data: formattedExceptions });
  } catch (error) {
    console.error("Error fetching availability exceptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability exceptions" },
      { status: 500 }
    );
  }
}

// POST /api/resources/:id/availability-exceptions - Create or update availability exceptions
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
    const { exceptions, deletedIds } = body;

    // Delete removed exceptions
    if (deletedIds && deletedIds.length > 0) {
      for (const id of deletedIds) {
        await db
          .delete(availabilityExceptions)
          .where(
            and(
              eq(availabilityExceptions.id, id),
              eq(availabilityExceptions.resourceId, resourceId)
            )
          );
      }
    }

    // Insert new exceptions (ones without a valid database ID)
    const newExceptions = exceptions.filter(
      (exception: any) => !exception.id || exception.id > 1000000000
    );

    if (newExceptions.length > 0) {
      for (const exception of newExceptions) {
        // Parse date strings properly (YYYY-MM-DD format)
        const startDatetime = parseISO(exception.startDate + "T00:00:00");
        const endDatetime = parseISO(exception.endDate + "T23:59:59");

        await db.insert(availabilityExceptions).values({
          resourceId,
          startDatetime,
          endDatetime,
          isUnavailable: exception.isUnavailable,
          reason: exception.reason || null,
        });
      }
    }

    // Fetch all current exceptions
    const updatedExceptions = await db
      .select()
      .from(availabilityExceptions)
      .where(eq(availabilityExceptions.resourceId, resourceId));

    // Format for frontend
    const formattedExceptions = updatedExceptions.map((exception) => ({
      ...exception,
      startDate: exception.startDatetime
        ? format(new Date(exception.startDatetime), "yyyy-MM-dd")
        : "",
      endDate: exception.endDatetime
        ? format(new Date(exception.endDatetime), "yyyy-MM-dd")
        : "",
    }));

    return NextResponse.json({ success: true, data: formattedExceptions });
  } catch (error) {
    console.error("Error saving availability exceptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save availability exceptions" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/:id/availability-exceptions - Delete a specific exception
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const exceptionId = searchParams.get("exceptionId");

    if (isNaN(resourceId) || !exceptionId) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);
    await db
      .delete(availabilityExceptions)
      .where(
        and(
          eq(availabilityExceptions.id, parseInt(exceptionId)),
          eq(availabilityExceptions.resourceId, resourceId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting availability exception:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete availability exception" },
      { status: 500 }
    );
  }
}
