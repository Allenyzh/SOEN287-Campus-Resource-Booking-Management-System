import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT /api/notifications/mark-all-read - Mark all notifications as read for a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
