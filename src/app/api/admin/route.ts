import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createAdminSession, isAdminRequest, isSameOrigin, unauthorized } from "@/lib/admin-auth";
import {
  getAllVenues,
  getAllCommunityCards,
  isDatabaseConfigured,
  testConnection,
  getDatabaseUrl,
} from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 16) {
      return NextResponse.json({ success: false, error: "Set a long ADMIN_PASSWORD in deployment settings." }, { status: 503 });
    }
    const body = await request.json();
    const { password } = body;

    if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল অ্যাডমিন পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন।",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "অ্যাডমিন লগইন সফল হয়েছে!",
    });
    if (!createAdminSession(response)) return NextResponse.json({ success: false }, { status: 503 });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Login failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();
  try {
    const isConfigured = isDatabaseConfigured();
    const connTest = await testConnection();
    const venues = await getAllVenues();
    const cards = await getAllCommunityCards();

    const totalRealVotes = venues.reduce(
      (acc, v) => acc + (v.realVotes || 0),
      0,
    );
    const totalFakeVotes = venues.reduce(
      (acc, v) => acc + (v.fakeVotes || 0),
      0,
    );
    const verifiedCount = venues.filter((v) => v.verified).length;
    const iconicCount = venues.filter((v) => v.isIconic).length;

    // Mask database URL for safety
    const rawUrl = getDatabaseUrl();
    let maskedUrl = "সেট করা নেই";
    if (rawUrl) {
      try {
        const u = new URL(rawUrl);
        maskedUrl = `${u.protocol}//${u.username}:***@${u.host}${u.pathname}`;
      } catch {
        maskedUrl = "postgresql://***@neon.tech/***";
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalVenues: venues.length,
        verifiedCount,
        iconicCount,
        totalRealVotes,
        totalFakeVotes,
        totalCards: cards.length,
      },
      db: {
        isNeon: isConfigured,
        connected: connTest.ok,
        statusMessage: connTest.message,
        version: connTest.version || "In-Memory Hybrid Cache",
        maskedUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load admin stats" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", `sharodiya_admin=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return response;
}
