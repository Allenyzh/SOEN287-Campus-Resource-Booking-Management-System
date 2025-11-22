import { NextRequest, NextResponse } from "next/server";
import { getDbFromRequest } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDbFromRequest(request);
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userList[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    // Get current user
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email !== currentUser[0].email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email,
    };

    // If changing password, verify current password and update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "Current password is required to set new password",
          },
          { status: 400 }
        );
      }

      // Verify current password - compare base64 encoded passwords
      const currentPasswordHash =
        Buffer.from(currentPassword).toString("base64");
      if (currentUser[0].passwordHash !== currentPasswordHash) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Encode new password to base64
      updateData.passwordHash = Buffer.from(newPassword).toString("base64");
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(userId)));

    // Fetch updated user
    const updatedUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
