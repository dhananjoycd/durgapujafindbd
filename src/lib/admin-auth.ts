import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "sharodiya_admin";
const SESSION_SECONDS = 60 * 60 * 12;

function sessionSecret() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 16 || password === "replace-with-a-long-random-password") {
    return null;
  }
  return createHmac("sha256", password).update("sharodiya-admin-session").digest("hex");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminSession(response: NextResponse) {
  const secret = sessionSecret();
  if (!secret) return false;
  const payload = `${Date.now() + SESSION_SECONDS * 1000}`;
  response.headers.append("Set-Cookie", `${COOKIE_NAME}=${payload}.${sign(payload, secret)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_SECONDS}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  return true;
}

export function isAdminRequest(request: NextRequest) {
  const secret = sessionSecret();
  const token = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!secret || !token) return false;
  const [expiresAt, signature, extra] = token.split(".");
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;
  const expected = sign(expiresAt, secret);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
}

export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
