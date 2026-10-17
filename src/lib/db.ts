import { neon } from "@neondatabase/serverless";
import { PujaVenue } from "@/types/puja";
import { initialVenues as bangladeshVenues } from "./venues";

export interface CommunityCard {
  id: string;
  sender: string;
  location: string;
  greeting: string;
  sub: string;
  likes: number;
  templateStyle: string;
  bgGradient: string;
  tag: string;
  createdAt?: string;
  isApproved?: boolean;
}

export const initialCommunityCards: CommunityCard[] = [
  {
    id: "card-1",
    sender: "সৌম্য ও প্রিয়ন্তী",
    location: "শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির · পুরান ঢাকা",
    greeting: "শুভ শারদীয়া ১৪৩৩",
    sub: "কাশবনের শুভ্রতায় ভরে উঠুক প্রতিটি ক্ষণ। পরিবারে শান্তি ও মায়ের আশীর্বাদ থাকুক নিরন্তর।",
    likes: 248,
    templateStyle: "ঢাকেশ্বরী লাল-সোনালী",
    bgGradient: "linear-gradient(135deg, #fff5eb 0%, #fee4d2 100%)",
    tag: "সেরা কার্ড",
  },
  {
    id: "card-2",
    sender: "তনুশ্রী রায়",
    location: "রমনা কালী মন্দির প্রাঙ্গণ · ঢাকা",
    greeting: "মা আসছেন",
    sub: "ঢাকের আওয়াজে মুখরিত চারপাশ। মা দুর্গার আগমনে সকলের জীবন আনন্দে রাঙিয়ে উঠুক।",
    likes: 195,
    templateStyle: "কাশফুল ও শুভ্র মেঘ",
    bgGradient: "linear-gradient(135deg, #eef7ff 0%, #d4e8fa 100%)",
    tag: "জনপ্রিয়",
  },
  {
    id: "card-3",
    sender: "অর্ক ও বন্ধুরা",
    location: "জগন্নাথ হল · ঢাকা বিশ্ববিদ্যালয়",
    greeting: "উৎসবের রঙে রাঙুক মন",
    sub: "ক্যাম্পাসের আড্ডা, চারুকলার নান্দনিক প্রতিমা আর একরাশ নস্টালজিয়া নিয়ে শারদ শুভেচ্ছা!",
    likes: 312,
    templateStyle: "শাঁখারীবাজারের ধুনুচি আরতি",
    bgGradient: "linear-gradient(135deg, #1f1b2e 0%, #110d1c 100%)",
    tag: "ট্রেন্ডিং",
  },
  {
    id: "card-4",
    sender: "অনুপম ও পূজা",
    location: "গুলশান-বনানী পূজা মণ্ডপ · ঢাকা",
    greeting: "শুভ দুর্গোৎসব",
    sub: "১০৮ পদ্মের পুণ্য অর্ঘ্যে মা দূর করুন সকল অন্ধকার, আসুক অনাবিল শান্তি।",
    likes: 167,
    templateStyle: "বনানী সোনালী রাজমহল",
    bgGradient: "linear-gradient(135deg, #fff2f2 0%, #ffd8d8 100%)",
    tag: "নতুন",
  },
];

// In-Memory Fallback State (used when Neon connection string is not yet added)
let fallbackVenues: PujaVenue[] = [...bangladeshVenues];
let fallbackCards: CommunityCard[] = [...initialCommunityCards];
let fallbackCardDownloadCount = 0;

export function cleanDbUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  let url = rawUrl.trim();
  // Strip "psql " command prefix if pasted from Neon quick copy
  if (url.startsWith("psql ")) {
    url = url.slice(5).trim();
  }
  // Strip single or double quotes wrapping the URL
  if ((url.startsWith("'") && url.endsWith("'")) || (url.startsWith('"') && url.endsWith('"'))) {
    url = url.slice(1, -1).trim();
  }
  return url;
}

export function isDatabaseConfigured(): boolean {
  const url = cleanDbUrl(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);
  return Boolean(url && url.length > 10 && !url.includes("neondb_owner:password"));
}

export function getDatabaseUrl(): string | null {
  return cleanDbUrl(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL);
}

export function getSql() {
  const url = getDatabaseUrl();
  if (!url || !isDatabaseConfigured()) {
    return null;
  }
  return neon(url);
}

// Test Neon Connection
export async function testConnection(): Promise<{ ok: boolean; message: string; version?: string }> {
  try {
    const sql = getSql();
    if (!sql) {
      return {
        ok: false,
        message: "DATABASE_URL সেট করা নেই। .env.local ফাইলে Neon DB কানেকশন স্ট্রিং যুক্ত করুন।",
      };
    }
    const result = await sql`SELECT 1 as status, version() as ver, NOW() as server_time;`;
    return {
      ok: true,
      message: "Neon PostgreSQL ডেটাবেজ সফলভাবে সংযুক্ত হয়েছে!",
      version: result[0]?.ver || "PostgreSQL (Neon Serverless)",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: `কানেকশন ত্রুটি: ${error?.message || String(error)}`,
    };
  }
}

// Initialize tables and seed initial data
export async function initDatabaseSchema(): Promise<{ ok: boolean; message: string; seededCount?: number }> {
  const sql = getSql();
  if (!sql) {
    return {
      ok: false,
      message: "DATABASE_URL পাওয়া যায়নি। দয়া করে .env.local ফাইলে Neon PostgreSQL স্ট্রিং বসান।",
    };
  }

  try {
    // 1. Create venues table
    await sql`
      CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        zone VARCHAR(255) NOT NULL,
        district VARCHAR(255) NOT NULL,
        address TEXT,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        theme TEXT,
        highlights JSONB DEFAULT '[]'::jsonb,
        crowd_status VARCHAR(50) DEFAULT 'low',
        crowd_updated_at VARCHAR(255),
        crowd_reports_count INT DEFAULT 0,
        is_iconic BOOLEAN DEFAULT FALSE,
        verified BOOLEAN DEFAULT FALSE,
        map_link TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        added_by VARCHAR(255),
        added_at VARCHAR(255),
        real_votes INT DEFAULT 0,
        fake_votes INT DEFAULT 0
      );
    `;

    // 2. Create community cards table
    await sql`
      CREATE TABLE IF NOT EXISTS community_cards (
        id VARCHAR(255) PRIMARY KEY,
        sender VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        greeting TEXT NOT NULL,
        sub TEXT,
        likes INT DEFAULT 0,
        template_style VARCHAR(255),
        bg_gradient TEXT,
        tag VARCHAR(100),
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 3. Create site settings table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Seed default venues if table is empty
    const countRes = await sql`SELECT COUNT(*)::int as count FROM venues;`;
    const venueCount = countRes[0]?.count || 0;
    let seeded = 0;

    if (venueCount === 0) {
      for (const v of bangladeshVenues) {
        await sql`
          INSERT INTO venues (
            id, name, zone, district, address, lat, lng, theme, highlights,
            crowd_status, crowd_updated_at, crowd_reports_count, is_iconic,
            verified, map_link, tags, added_by, added_at, real_votes, fake_votes
          ) VALUES (
            ${v.id}, ${v.name}, ${v.zone}, ${v.district}, ${v.address},
            ${v.lat}, ${v.lng}, ${v.theme}, ${JSON.stringify(v.highlights || [])}::jsonb,
            ${v.crowdStatus}, ${v.crowdUpdatedAt}, ${v.crowdReportsCount || 0},
            ${Boolean(v.isIconic)}, ${Boolean(v.verified)}, ${v.mapLink || ""},
            ${JSON.stringify(v.tags || [])}::jsonb, ${v.addedBy || "কমিউনিটি"},
            ${v.addedAt || "শারদীয়া ১৪৩৩"}, ${v.realVotes || 1}, ${v.fakeVotes || 0}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
        seeded++;
      }
    }

    // Seed default cards if empty
    const cardCountRes = await sql`SELECT COUNT(*)::int as count FROM community_cards;`;
    if ((cardCountRes[0]?.count || 0) === 0) {
      for (const c of initialCommunityCards) {
        await sql`
          INSERT INTO community_cards (
            id, sender, location, greeting, sub, likes, template_style, bg_gradient, tag
          ) VALUES (
            ${c.id}, ${c.sender}, ${c.location}, ${c.greeting}, ${c.sub},
            ${c.likes}, ${c.templateStyle}, ${c.bgGradient}, ${c.tag}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    return {
      ok: true,
      message: `ডেটাবেজ স্কিমা প্রস্তুত ও ${seeded} টি প্রাথমিক মণ্ডপ ডেটা সিড সম্পন্ন হয়েছে!`,
      seededCount: seeded,
    };
  } catch (error: any) {
    console.error("Init database schema error:", error);
    return {
      ok: false,
      message: `স্কিমা তৈরি করতে ব্যর্থ: ${error?.message || String(error)}`,
    };
  }
}

function safeJsonParse(val: any, fallback: any[] = []): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

// Convert DB row to PujaVenue type
function mapRowToVenue(row: any): PujaVenue {
  return {
    id: row.id,
    name: row.name,
    zone: row.zone,
    district: row.district,
    address: row.address,
    lat: Number(row.lat),
    lng: Number(row.lng),
    theme: row.theme,
    highlights: safeJsonParse(row.highlights),
    crowdStatus: (row.crowd_status || row.crowdStatus || "low") as any,
    crowdUpdatedAt: row.crowd_updated_at || row.crowdUpdatedAt || "এখনই",
    crowdReportsCount: Number(row.crowd_reports_count || row.crowdReportsCount || 0),
    isIconic: Boolean(row.is_iconic ?? row.isIconic),
    verified: Boolean(row.verified),
    mapLink: row.map_link || row.mapLink || "",
    tags: safeJsonParse(row.tags),
    addedBy: row.added_by || row.addedBy || "কমিউনিটি",
    addedAt: row.added_at || row.addedAt || "শারদীয়া ১৪৩৩",
    realVotes: Number(row.real_votes ?? row.realVotes ?? 1),
    fakeVotes: Number(row.fake_votes ?? row.fakeVotes ?? 0),
  };
}

// Venues API Helpers
export async function getAllVenues(): Promise<PujaVenue[]> {
  const sql = getSql();
  if (!sql) {
    return fallbackVenues;
  }

  try {
    const rows = await sql`
      SELECT * FROM venues
      ORDER BY is_iconic DESC, name ASC;
    `;
    if (rows.length === 0) {
      // If table exists but empty, return fallback or auto-seed
      return fallbackVenues;
    }
    return rows.map(mapRowToVenue);
  } catch (e) {
    console.warn("Neon DB query failed, using in-memory venues fallback:", e);
    return fallbackVenues;
  }
}

export async function createVenue(venue: PujaVenue): Promise<PujaVenue> {
  const sql = getSql();
  if (!sql) {
    fallbackVenues = [venue, ...fallbackVenues];
    return venue;
  }

  try {
    await sql`
      INSERT INTO venues (
        id, name, zone, district, address, lat, lng, theme, highlights,
        crowd_status, crowd_updated_at, crowd_reports_count, is_iconic,
        verified, map_link, tags, added_by, added_at, real_votes, fake_votes
      ) VALUES (
        ${venue.id}, ${venue.name}, ${venue.zone}, ${venue.district}, ${venue.address},
        ${venue.lat}, ${venue.lng}, ${venue.theme}, ${JSON.stringify(venue.highlights || [])}::jsonb,
        ${venue.crowdStatus}, ${venue.crowdUpdatedAt}, ${venue.crowdReportsCount || 1},
        ${Boolean(venue.isIconic)}, ${Boolean(venue.verified)}, ${venue.mapLink},
        ${JSON.stringify(venue.tags || [])}::jsonb, ${venue.addedBy || "কমিউনিটি"},
        ${venue.addedAt || "এইমাত্র"}, ${venue.realVotes || 1}, ${venue.fakeVotes || 0}
      );
    `;
    return venue;
  } catch (e) {
    console.error("Neon DB insert failed, adding to memory:", e);
    fallbackVenues = [venue, ...fallbackVenues];
    return venue;
  }
}

export async function updateVenue(id: string, updates: Partial<PujaVenue>): Promise<PujaVenue | null> {
  const sql = getSql();
  if (!sql) {
    const index = fallbackVenues.findIndex((v) => v.id === id);
    if (index === -1) return null;
    fallbackVenues[index] = { ...fallbackVenues[index], ...updates };
    return fallbackVenues[index];
  }

  try {
    // Dynamic update
    const current = await sql`SELECT * FROM venues WHERE id = ${id} LIMIT 1;`;
    if (!current || current.length === 0) return null;

    const row = current[0];
    const newName = updates.name ?? row.name;
    const newZone = updates.zone ?? row.zone;
    const newDistrict = updates.district ?? row.district;
    const newAddress = updates.address ?? row.address;
    const newLat = updates.lat ?? Number(row.lat);
    const newLng = updates.lng ?? Number(row.lng);
    const newTheme = updates.theme ?? row.theme;
    const newCrowd = updates.crowdStatus ?? row.crowd_status;
    const newCrowdTime = updates.crowdUpdatedAt ?? row.crowd_updated_at;
    const newCrowdReports = updates.crowdReportsCount ?? row.crowd_reports_count;
    const newVerified = updates.verified ?? row.verified;
    const newIsIconic = updates.isIconic ?? row.is_iconic;
    const newReal = updates.realVotes ?? row.real_votes;
    const newFake = updates.fakeVotes ?? row.fake_votes;

    const updated = await sql`
      UPDATE venues SET
        name = ${newName},
        zone = ${newZone},
        district = ${newDistrict},
        address = ${newAddress},
        lat = ${newLat},
        lng = ${newLng},
        theme = ${newTheme},
        crowd_status = ${newCrowd},
        crowd_updated_at = ${newCrowdTime},
        crowd_reports_count = ${newCrowdReports},
        verified = ${newVerified},
        is_iconic = ${newIsIconic},
        real_votes = ${newReal},
        fake_votes = ${newFake}
      WHERE id = ${id}
      RETURNING *;
    `;

    return updated[0] ? mapRowToVenue(updated[0]) : null;
  } catch (e) {
    console.error("Neon DB update failed:", e);
    return null;
  }
}

export async function deleteVenue(id: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) {
    const prevLen = fallbackVenues.length;
    fallbackVenues = fallbackVenues.filter((v) => v.id !== id);
    return fallbackVenues.length < prevLen;
  }

  try {
    const res = await sql`DELETE FROM venues WHERE id = ${id} RETURNING id;`;
    return res.length > 0;
  } catch (e) {
    console.error("Neon DB delete failed:", e);
    return false;
  }
}

export async function voteVenueInDb(id: string, type: "real" | "fake"): Promise<PujaVenue | null> {
  const sql = getSql();
  if (!sql) {
    const v = fallbackVenues.find((item) => item.id === id);
    if (!v) return null;
    if (type === "real") v.realVotes = (v.realVotes || 0) + 1;
    if (type === "fake") v.fakeVotes = (v.fakeVotes || 0) + 1;
    return v;
  }

  try {
    const res = type === "real"
      ? await sql`UPDATE venues SET real_votes = real_votes + 1 WHERE id = ${id} RETURNING *;`
      : await sql`UPDATE venues SET fake_votes = fake_votes + 1 WHERE id = ${id} RETURNING *;`;

    return res[0] ? mapRowToVenue(res[0]) : null;
  } catch (e) {
    console.error("Vote in DB failed:", e);
    return null;
  }
}

export async function reportCrowdInDb(id: string, status: "low" | "moderate" | "heavy"): Promise<PujaVenue | null> {
  const sql = getSql();
  const timeNow = "এইমাত্র হালনাগাদ";
  if (!sql) {
    const v = fallbackVenues.find((item) => item.id === id);
    if (!v) return null;
    v.crowdStatus = status;
    v.crowdUpdatedAt = timeNow;
    v.crowdReportsCount = (v.crowdReportsCount || 0) + 1;
    return v;
  }

  try {
    const res = await sql`
      UPDATE venues
      SET crowd_status = ${status},
          crowd_updated_at = ${timeNow},
          crowd_reports_count = crowd_reports_count + 1
      WHERE id = ${id}
      RETURNING *;
    `;
    return res[0] ? mapRowToVenue(res[0]) : null;
  } catch (e) {
    console.error("Crowd report in DB failed:", e);
    return null;
  }
}

// Community Cards API Helpers
export async function getAllCommunityCards(): Promise<CommunityCard[]> {
  const sql = getSql();
  if (!sql) {
    return fallbackCards;
  }

  try {
    const rows = await sql`
      SELECT * FROM community_cards
      ORDER BY likes DESC, created_at DESC;
    `;
    if (rows.length === 0) return fallbackCards;
    return rows.map((r: any) => ({
      id: r.id,
      sender: r.sender,
      location: r.location,
      greeting: r.greeting,
      sub: r.sub,
      likes: Number(r.likes || 0),
      templateStyle: r.template_style || r.templateStyle || "",
      bgGradient: r.bg_gradient || r.bgGradient || "",
      tag: r.tag || "শুভেচ্ছা",
      createdAt: r.created_at,
      isApproved: Boolean(r.is_approved ?? true),
    }));
  } catch (e) {
    console.warn("Neon DB query cards failed:", e);
    return fallbackCards;
  }
}

export async function likeCommunityCardInDb(id: string, increment: boolean): Promise<number | null> {
  const sql = getSql();
  if (!sql) {
    const c = fallbackCards.find((card) => card.id === id);
    if (!c) return null;
    c.likes = Math.max(0, c.likes + (increment ? 1 : -1));
    return c.likes;
  }

  try {
    const diff = increment ? 1 : -1;
    const res = await sql`
      UPDATE community_cards
      SET likes = GREATEST(0, likes + ${diff})
      WHERE id = ${id}
      RETURNING likes;
    `;
    return res[0] ? Number(res[0].likes) : null;
  } catch (e) {
    console.error("Like card in DB failed:", e);
    return null;
  }
}

export async function deleteCommunityCardInDb(id: string): Promise<boolean> {
  const sql = getSql();
  if (!sql) {
    const prev = fallbackCards.length;
    fallbackCards = fallbackCards.filter((c) => c.id !== id);
    return fallbackCards.length < prev;
  }

  try {
    const res = await sql`DELETE FROM community_cards WHERE id = ${id} RETURNING id;`;
    return res.length > 0;
  } catch (e) {
    console.error("Delete card in DB failed:", e);
    return false;
  }
}

export async function createCommunityCard(card: CommunityCard): Promise<CommunityCard> {
  const sql = getSql();
  if (!sql) {
    fallbackCards = [card, ...fallbackCards];
    return card;
  }

  try {
    await sql`
      INSERT INTO community_cards (
        id, sender, location, greeting, sub, likes, template_style, bg_gradient, tag, is_approved
      ) VALUES (
        ${card.id}, ${card.sender}, ${card.location}, ${card.greeting}, ${card.sub},
        ${card.likes || 1}, ${card.templateStyle || "ঢাকেশ্বরী লাল-সোনালী"},
        ${card.bgGradient || "linear-gradient(135deg, #fff5eb 0%, #fee4d2 100%)"},
        ${card.tag || "শুভেচ্ছা"}, ${card.isApproved ?? true}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
    return card;
  } catch (e) {
    console.error("Create card in DB failed:", e);
    fallbackCards = [card, ...fallbackCards];
    return card;
  }
}

async function ensureCardDownloadsTable() {
  const sql = getSql();
  if (!sql) return null;
  await sql`
    CREATE TABLE IF NOT EXISTS card_downloads (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  return sql;
}

export async function getCardDownloadCount(): Promise<number> {
  const sql = await ensureCardDownloadsTable();
  if (!sql) return fallbackCardDownloadCount;

  const rows = await sql`SELECT COUNT(*)::int AS count FROM card_downloads;`;
  return Number(rows[0]?.count ?? 0);
}

export async function recordCardDownload(): Promise<number> {
  const sql = await ensureCardDownloadsTable();
  if (!sql) {
    fallbackCardDownloadCount += 1;
    return fallbackCardDownloadCount;
  }

  await sql`INSERT INTO card_downloads DEFAULT VALUES;`;
  const rows = await sql`SELECT COUNT(*)::int AS count FROM card_downloads;`;
  return Number(rows[0]?.count ?? 0);
}

