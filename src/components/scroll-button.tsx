"use client";

export default function ScrollButton() {
  return <button className="header-cta" onClick={() => document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" })}>শুরু করুন <span>↓</span></button>;
}
