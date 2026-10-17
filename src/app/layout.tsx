import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "শারদীয়া — পুজোর শুভেচ্ছা কার্ড",
  description: "নিজের ছবি আর প্রিয় মানুষের জন্য বানান দুর্গাপুজোর সুন্দর বাংলা শুভেচ্ছা কার্ড।",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bn"><body>{children}</body></html>;
}
