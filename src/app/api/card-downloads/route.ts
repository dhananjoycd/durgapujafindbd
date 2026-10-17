import { NextRequest, NextResponse } from "next/server";
import { getCardDownloadCount, recordCardDownload, isDatabaseConfigured } from "@/lib/db";
import { isSameOrigin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const count = await getCardDownloadCount();
    return NextResponse.json({ success: true, count, persistent: isDatabaseConfigured() });
  } catch (error) {
    console.error("GET /api/card-downloads error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  try {
    const count = await recordCardDownload();
    return NextResponse.json({ success: true, count, persistent: isDatabaseConfigured() });
  } catch (error) {
    console.error("POST /api/card-downloads error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
