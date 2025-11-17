import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/notifications - Get all notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const query = db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, parseInt(userId)));

    const allNotifications = await query;

    // Filter unread if requested
    const filteredNotifications = unreadOnly
      ? allNotifications.filter((n) => !n.isRead)
      : allNotifications;

    return NextResponse.json({
      success: true,
      data: filteredNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, message, type, relatedBookingId } = body;

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId,
        title,
        message,
        type,
        relatedBookingId,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newNotification },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
