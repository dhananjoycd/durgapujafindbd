# শারদীয়া — Durga Puja Platform Roadmap & Implementation Progress

## Product Direction
Bengali-first Durga Puja celebration platform with two flagship experiences:
1. **Dynamic Photo Card Generator**: 12 festive templates (Traditional Red-Gold, Royal Kashful, Crimson Night, Golden Grandeur, Shashthi to Bijoya Dashami), custom photo framing (rounded, circle, arch), Bengali typography, decorative stickers (Alpana, Trishul, Dhunuchi, Dhak, Shankha, Lotus, Diya, Shiuli, Kashful), AI lighting tones (Golden Hour, Dhunuchi Twilight, Kashful Breeze, Sindoor Khela, Vintage Sepia) with A/B compare, multi-ratio formats (Portrait, Square 1:1, Story 9:16, Landscape 16:9), 2x HD PNG export, and 1-click WhatsApp share.
2. **Interactive Puja Finder Map**: Dynamic Leaflet + OpenStreetMap integration, custom festive markers, rich venue directory for Kolkata (North, South, Central) & Dhaka (Old Dhaka, Central, Banani/Gulshan), real-time crowdsourced crowd status reporting (🟢 Low, 🟡 Moderate, 🔴 Heavy), venue search & zone filters, Google Maps directions, and community "Add New Mandap" submission.
3. **Viral Community & Sharing**: "Friends & Family Puja Challenge", community card gallery with likes, and one-click festive greeting sharing.

## Milestones & Status
- [x] **Phase 1: Foundation & Architecture** (Next.js App Router, TypeScript, Turbopack, Bengali Typography, responsive styling).
- [x] **Phase 2: Comprehensive Card Studio MVP** (12 festive templates, custom shape frames, client-side canvas editing, Bengali greetings customization, decorative stickers catalog, HD PNG 2x export, WhatsApp share).
- [x] **Phase 3: AI Enhancement & Festive Looks** (Festive lighting presets, A/B toggle comparison, subject framing, zero-cloud local fallback).
- [x] **Phase 4: Interactive Puja Finder Map** (Leaflet OpenStreetMap client loader, Kolkata & Dhaka venue directory, crowd status reporting, search & zone filters, Google Maps direction linking, add new venue modal).
- [x] **Phase 5: Viral Sharing & Community Features** (Puja Challenge, card showcase gallery, venue-to-card attachment).
- [ ] **Phase 6: Dedicated Backend & PostgreSQL/PostGIS** (Optional dedicated Express + Postgres persistence layer for server-side venue moderation).
- [ ] **Phase 7: Production Cloud Deployment & SEO enhancements**.
