import { NextRequest, NextResponse } from "next/server";
import { getDb, getDbFromRequest } from "@/db";
import { resources, resourceCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/resources/[id] - Get resource by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [resource] = await db
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
          description: resourceCategories.description,
        },
      })
      .from(resources)
      .leftJoin(
        resourceCategories,
        eq(resources.categoryId, resourceCategories.id)
      )
      .where(eq(resources.id, parseInt(id)))
      .limit(1);

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const db = getDbFromRequest(request);

    const [updatedResource] = await db
      .update(resources)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, parseInt(id)))
      .returning();

    if (!updatedResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedResource });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDbFromRequest(request);

    const [deletedResource] = await db
      .delete(resources)
      .where(eq(resources.id, parseInt(id)))
      .returning({ id: resources.id });

    if (!deletedResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
