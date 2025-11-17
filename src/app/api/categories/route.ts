import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { resourceCategories } from "@/db/schema";

// GET /api/categories - Get all resource categories
export async function GET(request: NextRequest) {
  try {
    const db = getDbFromRequest(request);
    const categories = await db.select().from(resourceCategories);

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const [newCategory] = await db
      .insert(resourceCategories)
      .values({ name, description })
      .returning();

    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
