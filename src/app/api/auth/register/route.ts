import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Use getDbFromRequest to properly handle both dev and production environments
    const db = getDbFromRequest(request);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // In production, use proper password hashing (bcrypt)
    const passwordHash = Buffer.from(password).toString("base64");

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: "user", // Default role
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
        message: "Registration successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    // Return more detailed error information in development
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    const errorDetails = error instanceof Error ? error.stack : String(error);

    console.error("Registration error details:", {
      message: errorMessage,
      details: errorDetails,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
