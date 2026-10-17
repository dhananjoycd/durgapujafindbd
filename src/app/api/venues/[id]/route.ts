import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAdminRequest, isSameOrigin, unauthorized } from "@/lib/admin-auth";
import { updateVenue, deleteVenue, voteVenueInDb, reportCrowdInDb, isDatabaseConfigured } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    const { id } = await params;
    const body = await request.json();

    // Check if voting action
    if (body.action === "vote" && (body.voteType === "real" || body.voteType === "fake")) {
      const updated = await voteVenueInDb(id, body.voteType);
      return NextResponse.json({ success: true, data: updated });
    }

    // Check if crowd report action
    if (body.action === "crowd" && body.status) {
      if (!["low", "moderate", "heavy"].includes(body.status)) return NextResponse.json({ success: false, error: "Invalid crowd status" }, { status: 400 });
      const updated = await reportCrowdInDb(id, body.status);
      return NextResponse.json({ success: true, data: updated });
    }

    // Generic admin update
    if (!isAdminRequest(request)) return unauthorized();
    const updated = await updateVenue(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Venue not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      isNeon: isDatabaseConfigured(),
    });
  } catch (error: any) {
    console.error("PATCH /api/venues/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update venue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    if (!isAdminRequest(request)) return unauthorized();
    const { id } = await params;
    const deleted = await deleteVenue(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Venue not found or could not be deleted" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Venue deleted successfully",
      isNeon: isDatabaseConfigured(),
    });
  } catch (error: any) {
    console.error("DELETE /api/venues/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete venue" },
      { status: 500 }
    );
  }
}
