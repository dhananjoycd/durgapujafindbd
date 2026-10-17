import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAdminRequest, isSameOrigin, unauthorized } from "@/lib/admin-auth";
import {
  getAllCommunityCards,
  likeCommunityCardInDb,
  deleteCommunityCardInDb,
  createCommunityCard,
  isDatabaseConfigured,
} from "@/lib/db";

export async function GET() {
  try {
    const cards = await getAllCommunityCards();
    return NextResponse.json({
      success: true,
      data: cards,
      isNeon: isDatabaseConfigured(),
    });
  } catch (error: any) {
    console.error("GET /api/community error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    const body = await request.json();

    // 1. Check if like action
    if (body.action === "like" && body.id) {
      const likes = await likeCommunityCardInDb(body.id, Boolean(body.increment));
      return NextResponse.json({ success: true, likes });
    }

    // 2. Check if create card action
    if (body.action === "create" || (!body.action && body.sender && body.greeting)) {
      const newCard = await createCommunityCard({
        id: body.id || `card-${Date.now()}`,
        sender: String(body.sender || "শ্রদ্ধেয় ভক্ত").trim(),
        location: String(body.location || "ঢাকা").trim(),
        greeting: String(body.greeting || "শুভ শারদীয়া").trim(),
        sub: String(body.sub || "").trim(),
        likes: Number(body.likes || 1),
        templateStyle: String(body.templateStyle || "ঢাকেশ্বরী লাল-সোনালী"),
        bgGradient: String(body.bgGradient || "linear-gradient(135deg, #fff5eb 0%, #fee4d2 100%)"),
        tag: String(body.tag || "শুভেচ্ছা"),
        isApproved: true,
      });

      return NextResponse.json({
        success: true,
        data: newCard,
        message: "কার্ডটি সফলভাবে কমিউনিটি গ্যালারিতে যুক্ত হয়েছে!",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/community error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Action failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    if (!isAdminRequest(request)) return unauthorized();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing card ID" }, { status: 400 });
    }

    const deleted = await deleteCommunityCardInDb(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    console.error("DELETE /api/community error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete card" },
      { status: 500 }
    );
  }
}
