"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  LogOut,
  MapPin,
  Heart,
  Search,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Server,
  Layers,
  Check,
  Eye,
  Sliders
} from "lucide-react";
import { PujaVenue } from "@/types/puja";
import { CommunityCard } from "@/lib/db";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [adminTab, setAdminTab] = useState<"venues" | "community" | "db">("venues");

  // Live Data
  const [venues, setVenues] = useState<PujaVenue[]>([]);
  const [cards, setCards] = useState<CommunityCard[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Search & Filter
  const [venueSearch, setVenueSearch] = useState("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("all");

  // Venue Edit Modal
  const [editingVenue, setEditingVenue] = useState<PujaVenue | null>(null);
  const [isCreatingVenue, setIsCreatingVenue] = useState(false);

  // New / Edit Venue Form Fields
  const [formVenue, setFormVenue] = useState<Partial<PujaVenue>>({
    name: "",
    zone: "পুরান ঢাকা",
    district: "ঢাকা",
    address: "",
    lat: 23.7258,
    lng: 90.3986,
    theme: "",
    crowdStatus: "low",
    isIconic: false,
    verified: true,
  });

  const showNotify = (text: string, type: "success" | "error" | "info" = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Check the server-managed session cookie.
  useEffect(() => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        setIsAuthenticated(true);
        loadAdminData();
      }
    }).catch(() => undefined);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setAuthError(data.error || "পাসওয়ার্ড ভুল হয়েছে!");
      }
    } catch {
      setAuthError("সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    fetch("/api/admin", { method: "DELETE" }).catch(() => undefined);
    setIsAuthenticated(false);
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [adminRes, venuesRes, cardsRes] = await Promise.all([
        fetch("/api/admin").then((r) => r.json()),
        fetch("/api/venues").then((r) => r.json()),
        fetch("/api/community").then((r) => r.json()),
      ]);

      if (adminRes.success) {
        setStats(adminRes.stats);
        setDbInfo(adminRes.db);
      }
      if (venuesRes.success) {
        setVenues(venuesRes.data);
      }
      if (cardsRes.success) {
        setCards(cardsRes.data);
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
      showNotify("ডেটা লোড করতে সমস্যা হয়েছে", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Run DB Schema Init / Seed
  const handleInitDb = async () => {
    if (!confirm("আপনি কি Neon DB-তে টেবিল তৈরি ও ডিফল্ট ডেটা সিড করতে চান?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/db-init", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showNotify(`✅ ${data.message}`, "success");
        loadAdminData();
      } else {
        showNotify(`❌ ${data.error || "স্কিমা তৈরি ব্যর্থ"}`, "error");
      }
    } catch (e: any) {
      showNotify(`❌ ত্রুটি: ${e?.message || "সার্ভার এরর"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Verification
  const handleToggleVerify = async (venue: PujaVenue) => {
    const updatedStatus = !venue.verified;
    try {
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) =>
          prev.map((v) => (v.id === venue.id ? { ...v, verified: updatedStatus } : v))
        );
        showNotify(updatedStatus ? "মণ্ডপ ভেরিফাইড করা হলো" : "ভেরিফিকেশন তুলে নেওয়া হলো", "info");
      }
    } catch {
      showNotify("হালনাগাদ ব্যর্থ", "error");
    }
  };

  // Toggle Iconic
  const handleToggleIconic = async (venue: PujaVenue) => {
    const updatedStatus = !venue.isIconic;
    try {
      const res = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isIconic: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) =>
          prev.map((v) => (v.id === venue.id ? { ...v, isIconic: updatedStatus } : v))
        );
        showNotify(updatedStatus ? "ঐতিহ্যবাহী (Iconic) হিসেবে মার্ক করা হলো" : "আইকনিক স্ট্যাটাস সরানো হলো", "info");
      }
    } catch {
      showNotify("হালনাগাদ ব্যর্থ", "error");
    }
  };

  // Change Crowd Status
  const handleChangeCrowd = async (venueId: string, status: "low" | "moderate" | "heavy") => {
    try {
      const res = await fetch(`/api/venues/${venueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "crowd", status }),
      });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, crowdStatus: status, crowdUpdatedAt: "এখনই" } : v))
        );
        showNotify("ভিড়ের অবস্থা আপডেট করা হয়েছে", "success");
      }
    } catch {
      showNotify("আপডেট ব্যর্থ", "error");
    }
  };

  // Reset Votes
  const handleResetVotes = async (venueId: string) => {
    if (!confirm("এই মণ্ডপের সকল রিয়েল এবং ফেক ভোট রিসেট করতে চান?")) return;
    try {
      const res = await fetch(`/api/venues/${venueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ realVotes: 1, fakeVotes: 0 }),
      });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) =>
          prev.map((v) => (v.id === venueId ? { ...v, realVotes: 1, fakeVotes: 0 } : v))
        );
        showNotify("ভোট রিসেট সম্পন্ন", "success");
      }
    } catch {
      showNotify("ভোট রিসেট করা যায়নি", "error");
    }
  };

  // Delete Venue
  const handleDeleteVenue = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}" মণ্ডপটি ডিলিট করতে চান?`)) return;
    try {
      const res = await fetch(`/api/venues/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setVenues((prev) => prev.filter((v) => v.id !== id));
        showNotify(`"${name}" মুছে ফেলা হয়েছে`, "info");
      } else {
        showNotify("ডিলিট করতে সমস্যা হয়েছে", "error");
      }
    } catch {
      showNotify("সার্ভার ত্রুটি", "error");
    }
  };

  // Save New or Edited Venue
  const handleSaveVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVenue.name || !formVenue.zone) {
      alert("নাম ও জোন আবশ্যক!");
      return;
    }

    try {
      if (editingVenue) {
        // Update existing
        const res = await fetch(`/api/venues/${editingVenue.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formVenue),
        });
        const data = await res.json();
        if (data.success) {
          setVenues((prev) => prev.map((v) => (v.id === editingVenue.id ? data.data : v)));
          showNotify("মণ্ডপের তথ্য হালনাগাদ সফল!", "success");
          setEditingVenue(null);
        }
      } else {
        // Create new
        const res = await fetch("/api/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formVenue),
        });
        const data = await res.json();
        if (data.success) {
          setVenues((prev) => [data.data, ...prev]);
          showNotify("নতুন মণ্ডপ সফলভাবে যুক্ত হয়েছে!", "success");
          setIsCreatingVenue(false);
        }
      }
    } catch {
      showNotify("সংরক্ষণ ব্যর্থ হয়েছে", "error");
    }
  };

  // Delete Community Card
  const handleDeleteCard = async (id: string) => {
    if (!confirm("এই শুভেচ্ছা কার্ডটি মুছে ফেলতে চান?")) return;
    try {
      const res = await fetch(`/api/community?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCards((prev) => prev.filter((c) => c.id !== id));
        showNotify("কার্ডটি মুছে ফেলা হয়েছে", "info");
      }
    } catch {
      showNotify("ডিলিট ব্যর্থ", "error");
    }
  };

  // Open Edit Modal
  const openEditModal = (venue: PujaVenue) => {
    setEditingVenue(venue);
    setIsCreatingVenue(false);
    setFormVenue({
      name: venue.name,
      zone: venue.zone,
      district: venue.district,
      address: venue.address,
      lat: venue.lat,
      lng: venue.lng,
      theme: venue.theme,
      crowdStatus: venue.crowdStatus,
      isIconic: venue.isIconic,
      verified: venue.verified,
    });
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingVenue(null);
    setIsCreatingVenue(true);
    setFormVenue({
      name: "",
      zone: "পুরান ঢাকা",
      district: "ঢাকা",
      address: "",
      lat: 23.7258,
      lng: 90.3986,
      theme: "সার্বজনীন ঐতিহ্যবাহী দুর্গাপূজা",
      crowdStatus: "low",
      isIconic: false,
      verified: true,
    });
  };

  // Filtered venues for admin view
  const filteredVenues = venues.filter((v) => {
    if (selectedZoneFilter !== "all" && v.zone !== selectedZoneFilter) return false;
    if (venueSearch.trim()) {
      const q = venueSearch.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.zone.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        (v.addedBy && v.addedBy.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const uniqueZones = Array.from(new Set(venues.map((v) => v.zone)));

  // ----------------------------------------------------
  // LOGIN SCREEN
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-brand-logo">
            <span className="brand-icon">শ</span>
            <h2>শারদীয়া অ্যাডমিন প্যানেল</h2>
          </div>
          <p className="login-subtext">
            ডেটাবেজ ও দুর্গাপূজা মণ্ডপ তথ্যের কেন্দ্রীয় নিয়ন্ত্রণ
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <label>অ্যাডমিন পাসওয়ার্ড</label>
              <div className="input-with-icon">
                <Lock size={16} />
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {authError && <div className="login-error-alert">{authError}</div>}

            <button type="submit" className="login-submit-btn" disabled={isLoggingIn}>
              {isLoggingIn ? "যাচাই করা হচ্ছে..." : "প্রবেশ করুন 🔐"}
            </button>
          </form>

          <div className="login-footer-hint">
          
            <Link href="/" className="back-to-site-link">
              <ChevronLeft size={14} /> মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Top Navigation */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <Link href="/" className="admin-site-brand">
            <span className="brand-icon">শ</span>
            <span className="brand-name">শারদীয়া কন্ট্রোল সেন্টার</span>
          </Link>
          <span className="admin-role-pill">অ্যাডমিন মোড</span>
        </div>

        <div className="admin-topbar-right">
          <button className="admin-refresh-btn" onClick={loadAdminData} disabled={isLoading} title="রিফ্রেশ করুন">
            <RefreshCw size={15} className={isLoading ? "spin" : ""} />
            <span>রিফ্রেশ</span>
          </button>
          <Link href="/" className="admin-view-site-btn" target="_blank">
            <Eye size={15} />
            <span>ওয়েবসাইট দেখুন</span>
          </Link>
          <button className="admin-logout-btn" onClick={handleLogout} title="লগআউট">
            <LogOut size={15} />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      {/* Floating Action Notification */}
      {actionMessage && (
        <div className={`admin-notification-toast toast-${actionMessage.type}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="admin-main-container">
        {/* Neon Database Status Banner */}
        <div className={`db-status-banner ${dbInfo?.connected ? "status-connected" : "status-warning"}`}>
          <div className="db-status-content">
            <div className="db-status-icon">
              <Database size={24} />
            </div>
            <div className="db-status-text">
              <div className="db-status-title-row">
                <h4>
                  {dbInfo?.isNeon ? "PostgreSQL (Neon Serverless)" : "লোকাল হাইব্রিড ক্যাশ (Neon কনফিগারেশনের অপেক্ষায়)"}
                </h4>
                <span className={`db-live-pill ${dbInfo?.connected ? "pill-live" : "pill-mock"}`}>
                  {dbInfo?.connected ? "🟢 লাইভ কানেক্টেড" : "🟡 লোকাল ক্যাশ মোড"}
                </span>
              </div>
              <p>
                {dbInfo?.connected
                  ? `কানেকশন সক্রিয়: ${dbInfo.version}. হোস্ট: ${dbInfo.maskedUrl}`
                  : "আপনার Neon PostgreSQL URL পাওয়া যায়নি। neon.tech থেকে কানেকশন স্ট্রিং নিয়ে .env.local ফাইলে DATABASE_URL বসিয়ে দিন।"}
              </p>
            </div>
          </div>

          <div className="db-banner-actions">
            <button className="db-action-btn primary" onClick={handleInitDb} disabled={isLoading}>
              <Server size={15} />
              <span>টেবিল তৈরি ও সিড করুন</span>
            </button>
            <button className="db-action-btn secondary" onClick={loadAdminData}>
              <RefreshCw size={15} />
              <span>টেস্ট কানেকশন</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#fee2e2", color: "#991b1b" }}>
              <MapPin size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">মোট পুজো মণ্ডপ</span>
              <h3 className="stat-value">{stats?.totalVenues || venues.length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#dcfce7", color: "#166534" }}>
              <ShieldCheck size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">ভেরিফাইড মণ্ডপ</span>
              <h3 className="stat-value">{stats?.verifiedCount || venues.filter(v => v.verified).length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#fef3c7", color: "#92400e" }}>
              <Sparkles size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">ঐতিহ্যবাহী (আইকনিক)</span>
              <h3 className="stat-value">{stats?.iconicCount || venues.filter(v => v.isIconic).length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#e0e7ff", color: "#3730a3" }}>
              <CheckCircle size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">ভক্তদের আসল ভোট</span>
              <h3 className="stat-value">{stats?.totalRealVotes || venues.reduce((a, b) => a + (b.realVotes || 0), 0)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#ffe4e6", color: "#9f1239" }}>
              <AlertTriangle size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">ভুয়া রিপোর্ট ভোট</span>
              <h3 className="stat-value">{stats?.totalFakeVotes || venues.reduce((a, b) => a + (b.fakeVotes || 0), 0)}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#f3e8ff", color: "#6b21a8" }}>
              <Heart size={20} />
            </div>
            <div className="stat-details">
              <span className="stat-label">কমিউনিটি কার্ড</span>
              <h3 className="stat-value">{stats?.totalCards || cards.length}</h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs-row">
          <button
            className={`admin-tab-btn ${adminTab === "venues" ? "active" : ""}`}
            onClick={() => setAdminTab("venues")}
          >
            <Layers size={16} />
            <span>মণ্ডপ ব্যবস্থাপনা ({venues.length})</span>
          </button>
          <button
            className={`admin-tab-btn ${adminTab === "community" ? "active" : ""}`}
            onClick={() => setAdminTab("community")}
          >
            <Heart size={16} />
            <span>কমিউনিটি কার্ড ({cards.length})</span>
          </button>
          <button
            className={`admin-tab-btn ${adminTab === "db" ? "active" : ""}`}
            onClick={() => setAdminTab("db")}
          >
            <Database size={16} />
            <span>Neon DB গাইড ও সেটআপ</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: VENUES MANAGEMENT */}
        {/* ==================================================== */}
        {adminTab === "venues" && (
          <div className="admin-section-pane">
            <div className="pane-header-row">
              <div className="pane-header-filters">
                <div className="search-box-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="মণ্ডপের নাম, এলাকা বা ঠিকানা খুঁজুন..."
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                  />
                </div>

                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="zone-select-filter"
                >
                  <option value="all">সকল জোন ({venues.length})</option>
                  {uniqueZones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <button className="add-venue-btn-primary" onClick={openCreateModal}>
                <Plus size={16} />
                <span>নতুন মণ্ডপ যোগ করুন</span>
              </button>
            </div>

            {/* Venues Table / Grid (Full Responsive) */}
            <div className="admin-table-responsive-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>মণ্ডপের নাম ও এলাকা</th>
                    <th>ভিড়ের স্থিতি</th>
                    <th>কমিউনিটি বিশ্বাসযোগ্যতা</th>
                    <th>আইকনিক</th>
                    <th>ভেরিফিকেশন</th>
                    <th>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVenues.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        কোনো মণ্ডপ পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredVenues.map((venue) => {
                      const totalVotes = (venue.realVotes || 0) + (venue.fakeVotes || 0);
                      const realPct = totalVotes > 0 ? Math.round(((venue.realVotes || 0) / totalVotes) * 100) : 100;
                      const isSuspect = totalVotes >= 2 && (venue.fakeVotes || 0) > (venue.realVotes || 0);

                      return (
                        <tr key={venue.id} className={isSuspect ? "row-suspect" : ""}>
                          <td>
                            <div className="table-venue-name-col">
                              <strong>{venue.name}</strong>
                              <small>📍 {venue.zone} · {venue.address}</small>
                              <span className="submitter-sub">যুক্ত করেছেন: {venue.addedBy || "কমিউনিটি"}</span>
                            </div>
                          </td>

                          <td>
                            <div className="crowd-status-selector">
                              <select
                                value={venue.crowdStatus}
                                onChange={(e) => handleChangeCrowd(venue.id, e.target.value as any)}
                                className={`crowd-badge-select ${venue.crowdStatus}`}
                              >
                                <option value="low">কম 🟢</option>
                                <option value="moderate">মাঝারি 🟡</option>
                                <option value="heavy">বেশি 🔴</option>
                              </select>
                              <small>{venue.crowdUpdatedAt || "এখনই"}</small>
                            </div>
                          </td>

                          <td>
                            <div className="trust-meter-cell">
                              <span className={`trust-tag ${isSuspect ? "danger" : "safe"}`}>
                                {isSuspect ? "⚠️ ভুয়া সন্দেহ" : `🛡️ ${realPct}% আসল`}
                              </span>
                              <small>✓ {venue.realVotes || 0} | ✕ {venue.fakeVotes || 0}</small>
                              {(venue.fakeVotes || 0) > 0 && (
                                <button
                                  className="reset-votes-link"
                                  onClick={() => handleResetVotes(venue.id)}
                                  title="ভোট রিসেট করুন"
                                >
                                  রিসেট
                                </button>
                              )}
                            </div>
                          </td>

                          <td>
                            <button
                              className={`status-toggle-pill ${venue.isIconic ? "active" : ""}`}
                              onClick={() => handleToggleIconic(venue)}
                              title="আইকনিক টগল করুন"
                            >
                              {venue.isIconic ? "⭐ হ্যাঁ" : "না"}
                            </button>
                          </td>

                          <td>
                            <button
                              className={`status-toggle-pill verify ${venue.verified ? "verified" : "unverified"}`}
                              onClick={() => handleToggleVerify(venue)}
                              title="ভেরিফিকেশন টগল করুন"
                            >
                              {venue.verified ? "✓ অনুমোদিত" : "✕ বাকি"}
                            </button>
                          </td>

                          <td>
                            <div className="table-actions-cell">
                              <button
                                className="icon-action-btn edit"
                                onClick={() => openEditModal(venue)}
                                title="এডিট করুন"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                className="icon-action-btn delete"
                                onClick={() => handleDeleteVenue(venue.id, venue.name)}
                                title="ডিলিট করুন"
                              >
                                <Trash2 size={14} />
                              </button>
                              {venue.mapLink && (
                                <a
                                  href={venue.mapLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="icon-action-btn link"
                                  title="গুগল ম্যাপে দেখুন"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: COMMUNITY CARDS */}
        {/* ==================================================== */}
        {adminTab === "community" && (
          <div className="admin-section-pane">
            <div className="pane-header-row">
              <h4>ভক্তদের শুভেচ্ছা কার্ড ও বার্তা ({cards.length})</h4>
              <small>অবাঞ্ছিত বা স্প্যাম বার্তা মুছে ফেলতে ডিলিট বাটনে ক্লিক করুন</small>
            </div>

            <div className="community-admin-grid">
              {cards.map((card) => (
                <div key={card.id} className="admin-card-item">
                  <div className="admin-card-top">
                    <span className="card-tag-badge">{card.tag}</span>
                    <span className="card-likes-count">❤️ {card.likes} লাইক</span>
                  </div>
                  <h4 className="card-greeting-heading">{card.greeting}</h4>
                  <p className="card-sub-quote">“{card.sub}”</p>

                  <div className="card-sender-box">
                    <strong>প্রেরক: {card.sender}</strong>
                    <small>📍 {card.location}</small>
                  </div>

                  <div className="card-action-bar">
                    <button
                      className="delete-card-btn"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <Trash2 size={14} /> <span>মুছে ফেলুন</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: NEON DB GUIDE */}
        {/* ==================================================== */}
        {adminTab === "db" && (
          <div className="admin-section-pane neon-guide-pane">
            <div className="guide-header">
              <Database size={28} className="db-brand-icon" />
              <div>
                <h3>PostgreSQL (Neon DB) কনফিগারেশন নির্দেশিকা</h3>
                <p>Neon একটি অতি দ্রুত সার্ভারলেস ক্লাউড PostgreSQL ডেটাবেজ। এটি শারদীয়া প্ল্যাটফর্মের সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ।</p>
              </div>
            </div>

            <div className="guide-steps-list">
              <div className="guide-step-card">
                <span className="step-num">১</span>
                <div className="step-content">
                  <h4>Neon অ্যাকাউন্টে লগইন ও প্রজেক্ট তৈরি</h4>
                  <p>
                    <a href="https://console.neon.tech/" target="_blank" rel="noreferrer" className="inline-link">
                      console.neon.tech <ExternalLink size={12} />
                    </a>-এ যান এবং বিনামূল্যে একটি নতুন PostgreSQL প্রজেক্ট তৈরি করুন (নাম দিন যেমন: <code>durga-puja</code>)।
                  </p>
                </div>
              </div>

              <div className="guide-step-card">
                <span className="step-num">২</span>
                <div className="step-content">
                  <h4>Connection String কপি ও .env.local এ যুক্ত করা</h4>
                  <p>
                    Neon ড্যাশবোর্ড থেকে <strong>Connection String</strong> কপি করুন এবং আপনার প্রোজেক্টের <code>.env.local</code> ফাইলে বসিয়ে দিন:
                  </p>
                  <pre className="code-block">
                    DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
                  </pre>
                </div>
              </div>

              <div className="guide-step-card">
                <span className="step-num">৩</span>
                <div className="step-content">
                  <h4>এক ক্লিকে ডেটাবেজ স্কিমা তৈরি ও সিড</h4>
                  <p>
                    কানেকশন স্ট্রিং বসানো শেষ হলে ওপরের <strong>"টেবিল তৈরি ও সিড করুন"</strong> বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে মণ্ডপ, ভোট এবং শুভেচ্ছা কার্ডের টেবিলগুলো তৈরি হয়ে প্রাথমিক ডেটা সংরক্ষিত হয়ে যাবে!
                  </p>
                  <button className="btn-primary" onClick={handleInitDb} style={{ marginTop: "10px" }}>
                    🚀 এখনই টেবিল তৈরি ও সিড করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* EDIT / CREATE VENUE MODAL */}
      {/* ==================================================== */}
      {(editingVenue || isCreatingVenue) && (
        <div className="modal-backdrop" onClick={() => { setEditingVenue(null); setIsCreatingVenue(false); }}>
          <div className="modal-content admin-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingVenue ? `মণ্ডপের তথ্য এডিট: ${editingVenue.name}` : "নতুন মণ্ডপ যুক্ত করুন"}</h3>
              <button className="close-btn" onClick={() => { setEditingVenue(null); setIsCreatingVenue(false); }}>
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVenue} className="admin-venue-form">
              <div className="form-grid-2">
                <div className="form-field">
                  <label>মণ্ডপের নাম *</label>
                  <input
                    type="text"
                    required
                    value={formVenue.name || ""}
                    onChange={(e) => setFormVenue({ ...formVenue, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>এলাকা / জোন *</label>
                  <input
                    type="text"
                    required
                    value={formVenue.zone || ""}
                    onChange={(e) => setFormVenue({ ...formVenue, zone: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>জেলা</label>
                  <input
                    type="text"
                    value={formVenue.district || "ঢাকা"}
                    onChange={(e) => setFormVenue({ ...formVenue, district: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>বিস্তারিত ঠিকানা</label>
                  <input
                    type="text"
                    value={formVenue.address || ""}
                    onChange={(e) => setFormVenue({ ...formVenue, address: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>অক্ষাংশ (Latitude)</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formVenue.lat || 0}
                    onChange={(e) => setFormVenue({ ...formVenue, lat: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-field">
                  <label>দ্রাঘিমাংশ (Longitude)</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={formVenue.lng || 0}
                    onChange={(e) => setFormVenue({ ...formVenue, lng: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>মণ্ডপের বিশেষ আকর্ষণ ও থিম</label>
                <textarea
                  rows={2}
                  value={formVenue.theme || ""}
                  onChange={(e) => setFormVenue({ ...formVenue, theme: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>ভিড়ের স্থিতি</label>
                  <select
                    value={formVenue.crowdStatus || "low"}
                    onChange={(e) => setFormVenue({ ...formVenue, crowdStatus: e.target.value as any })}
                  >
                    <option value="low">কম 🟢</option>
                    <option value="moderate">মাঝারি 🟡</option>
                    <option value="heavy">বেশি 🔴</option>
                  </select>
                </div>

                <div className="form-checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(formVenue.isIconic)}
                      onChange={(e) => setFormVenue({ ...formVenue, isIconic: e.target.checked })}
                    />
                    <span>⭐ ঐতিহ্যবাহী (Iconic) মণ্ডপ</span>
                  </label>
                </div>

                <div className="form-checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(formVenue.verified)}
                      onChange={(e) => setFormVenue({ ...formVenue, verified: e.target.checked })}
                    />
                    <span>🛡️ অনুমোদিত (Verified)</span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setEditingVenue(null); setIsCreatingVenue(false); }}
                >
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  সংরক্ষণ করুন ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
