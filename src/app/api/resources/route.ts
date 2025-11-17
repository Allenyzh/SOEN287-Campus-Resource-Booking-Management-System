import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { resources, resourceCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/resources - Get all resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const db = getDbFromRequest(request);

    const query = db
      .select({
        id: resources.id,
        name: resources.name,
        description: resources.description,
        categoryId: resources.categoryId,
        location: resources.location,
        capacity: resources.capacity,
        imageUrl: resources.imageUrl,
        status: resources.status,
        requiresApproval: resources.requiresApproval,
        createdAt: resources.createdAt,
        category: {
          id: resourceCategories.id,
          name: resourceCategories.name,
        },
      })
      .from(resources)
      .leftJoin(
        resourceCategories,
        eq(resources.categoryId, resourceCategories.id)
      );

    // Apply filters if provided
    // Note: For more complex filtering, you'd need to build the query conditionally

    const allResources = await query;

    return NextResponse.json({ success: true, data: allResources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      location,
      capacity,
      imageUrl,
      requiresApproval = false,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Name and category are required" },
        { status: 400 }
      );
    }

    const db = getDbFromRequest(request);

    const [newResource] = await db
      .insert(resources)
      .values({
        name,
        description,
        categoryId,
        location,
        capacity,
        imageUrl,
        requiresApproval,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newResource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
