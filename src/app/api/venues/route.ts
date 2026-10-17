import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAdminRequest, isSameOrigin, unauthorized } from "@/lib/admin-auth";
import { getAllVenues, createVenue, isDatabaseConfigured } from "@/lib/db";
import { PujaVenue } from "@/types/puja";

export async function GET() {
  try {
    const venues = await getAllVenues();
    return NextResponse.json({
      success: true,
      data: venues,
      isNeon: isDatabaseConfigured(),
    });
  } catch (error: any) {
    console.error("GET /api/venues error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    const body = await request.json();
    if (!body.name || !body.zone || body.lat === undefined || body.lng === undefined) {
      return NextResponse.json(
        { success: false, error: "নাম, জোন ও অবস্থান (lat, lng) প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(Number(body.lat)) || Number(body.lat) < -90 || Number(body.lat) > 90 || !Number.isFinite(Number(body.lng)) || Number(body.lng) < -180 || Number(body.lng) > 180) {
      return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
    }

    const newVenue: PujaVenue = {
      id: body.id || `venue-bd-${Date.now()}`,
      name: body.name.trim(),
      zone: body.zone.trim(),
      district: body.district?.trim() || "ঢাকা",
      address: body.address?.trim() || `${body.zone}, ঢাকা`,
      lat: Number(body.lat),
      lng: Number(body.lng),
      theme: body.theme?.trim() || "কমিউনিটি সার্বজনীন শারদীয় দুর্গোৎসব",
      highlights: Array.isArray(body.highlights) ? body.highlights : ["কমিউনিটি পূজা", "শারদীয় উৎসব"],
      crowdStatus: body.crowdStatus || "low",
      crowdUpdatedAt: "এইমাত্র যোগ করা হয়েছে",
      crowdReportsCount: 1,
      isIconic: Boolean(body.isIconic),
      verified: Boolean(body.verified ?? true),
      mapLink: body.mapLink || `https://maps.google.com/?q=${body.lat},${body.lng}`,
      tags: Array.isArray(body.tags) ? body.tags : ["নতুন মণ্ডপ", body.zone],
      addedBy: body.addedBy?.trim() || "ভক্ত / কমিউনিটি সদস্য",
      addedAt: "এইমাত্র যুক্ত করা হয়েছে",
      realVotes: 1,
      fakeVotes: 0,
    };

    const saved = await createVenue(newVenue);
    return NextResponse.json({
      success: true,
      data: saved,
      isNeon: isDatabaseConfigured(),
    });
  } catch (error: any) {
    console.error("POST /api/venues error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create venue" },
      { status: 500 }
    );
  }
}
