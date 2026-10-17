import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAdminRequest, isSameOrigin, unauthorized } from "@/lib/admin-auth";
import { initDatabaseSchema, testConnection } from "@/lib/db";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const conn = await testConnection();
    if (!conn.ok) {
      return NextResponse.json({
        success: false,
        error: conn.message,
      }, { status: 400 });
    }

    const result = await initDatabaseSchema();
    return NextResponse.json({
      success: result.ok,
      message: result.message,
      seededCount: result.seededCount,
    });
  } catch (error: any) {
    console.error("DB init route error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to initialize database" },
      { status: 500 }
    );
  }
}
