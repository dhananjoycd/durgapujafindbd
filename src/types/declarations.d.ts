declare module "lucide-react";
declare module "fabric";

declare module "next" {
  export type Metadata = any;
  export type Viewport = any;
  export type NextConfig = any;
}

declare module "next/link" {
  import React from "react";
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module "next/server" {
  export class NextResponse extends Response {
    static json(body: any, init?: any): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
  }
  export type NextRequest = Request;
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
  export type Metadata = any;
  export type Viewport = any;
}

declare module "next/server.js" {
  export class NextResponse extends Response {
    static json(body: any, init?: any): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
  }
  export type NextRequest = Request;
}
