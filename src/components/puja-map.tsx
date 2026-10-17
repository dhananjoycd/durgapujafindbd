"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { PujaVenue } from "@/types/puja";
import { initialVenues } from "@/lib/venues";
import { 
  MapPin, 
  Search, 
  Users, 
  Clock, 
  Navigation, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Flame, 
  SlidersHorizontal,
  Layers,
  LocateFixed,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  User,
  Info
} from "lucide-react";

interface PujaMapProps {
  onSelectForCard?: (venueName: string) => void;
}

export default function PujaMap({ onSelectForCard }: PujaMapProps) {
  // Load persisted venues or fallback to initial Bangladesh venues
  const [venues, setVenues] = useState<PujaVenue[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sharodiya_venues_bd_v2");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return initialVenues;
  });

  // Track user's own votes { [venueId]: 'real' | 'fake' }
  const [userVotes, setUserVotes] = useState<Record<string, "real" | "fake">>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sharodiya_user_votes");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {};
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedCrowd, setSelectedCrowd] = useState<string>("all");
  const [activeVenue, setActiveVenue] = useState<PujaVenue | null>(initialVenues[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("success");
  const [showDemoNoticeModal, setShowDemoNoticeModal] = useState(true);

  // User's Live Location state
  const [userLiveCoords, setUserLiveCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Clicked Location on Map for adding mandap
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // New venue form state
  const [submitterName, setSubmitterName] = useState("");
  const [newVenueName, setNewVenueName] = useState("");
  const [newVenueZone, setNewVenueZone] = useState("পুরান ঢাকা");
  const [newVenueAddress, setNewVenueAddress] = useState("");
  const [newVenueTheme, setNewVenueTheme] = useState("");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const tempClickMarkerRef = useRef<any>(null);

  const showToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Filter venues
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (selectedZone !== "all" && v.zone !== selectedZone) return false;
      if (selectedCrowd !== "all" && v.crowdStatus !== selectedCrowd) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesTheme = v.theme.toLowerCase().includes(query);
        const matchesZone = v.zone.toLowerCase().includes(query);
        const matchesAddress = v.address.toLowerCase().includes(query);
        const matchesSubmitter = v.addedBy?.toLowerCase().includes(query);
        if (!matchesName && !matchesTheme && !matchesZone && !matchesAddress && !matchesSubmitter) return false;
      }
      return true;
    });
  }, [venues, selectedZone, selectedCrowd, searchQuery]);

  // Unique zones in Bangladesh
  const zones = useMemo(() => {
    const list = venues.map((v) => v.zone);
    return Array.from(new Set(list));
  }, [venues]);

  // Load Leaflet dynamically via CDN
  useEffect(() => {
    let isMounted = true;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      if (!leafletMapRef.current) {
        // Center on Dhaka
        const center = [23.7380, 90.3950];
        const map = L.map(mapContainerRef.current, {
          center,
          zoom: 12,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        leafletMapRef.current = map;
        markersGroupRef.current = markersGroup;
        setMapLoaded(true);

        // Click on map to add venue event
        map.on("click", (e: any) => {
          const lat = Number(e.latlng.lat.toFixed(5));
          const lng = Number(e.latlng.lng.toFixed(5));
          setClickedLocation({ lat, lng });

          // Render temporary placement pin on map
          if (tempClickMarkerRef.current) {
            markersGroup.removeLayer(tempClickMarkerRef.current);
          }

          const tempIcon = L.divIcon({
            className: "temp-click-marker",
            html: `
              <div style="
                background: #b33924;
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 15px #ffd700, 0 4px 10px rgba(0,0,0,0.4);
                border: 3px solid #ffffff;
                animation: bounce 1s infinite alternate;
              ">
                <span style="transform: rotate(45deg); color: #fff; font-size: 16px;">➕</span>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          const tempMarker = L.marker([lat, lng], { icon: tempIcon }).addTo(markersGroup);
          tempClickMarkerRef.current = tempMarker;

          // Open Add Modal prefilled with coordinates
          setShowAddModal(true);
          showToast(`ম্যাপের অবস্থান নির্বাচিত: [${lat}, ${lng}]। এবার মণ্ডপের তথ্য লিখুন!`, "info");
        });
      }
    };

    if ((window as any).L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        initMap();
      };
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Update venue markers on map
  useEffect(() => {
    const L = (window as any).L;
    if (!leafletMapRef.current || !markersGroupRef.current || !L) return;

    markersGroupRef.current.clearLayers();

    // Re-add user live location if exists
    if (userLiveCoords) {
      const liveIcon = L.divIcon({
        className: "live-user-marker",
        html: `
          <div style="
            width: 22px;
            height: 22px;
            background: #0070f3;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 0 6px rgba(0, 112, 243, 0.35);
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      L.marker([userLiveCoords.lat, userLiveCoords.lng], { icon: liveIcon })
        .bindTooltip("📍 আপনার বর্তমান লাইভ অবস্থান", { permanent: true, direction: "top" })
        .addTo(markersGroupRef.current);
    }

    // Re-add temporary clicked marker if adding
    if (clickedLocation && showAddModal) {
      const tempIcon = L.divIcon({
        className: "temp-click-marker",
        html: `
          <div style="
            background: #b33924;
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 15px #ffd700, 0 4px 10px rgba(0,0,0,0.4);
            border: 3px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); color: #fff; font-size: 16px;">➕</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      L.marker([clickedLocation.lat, clickedLocation.lng], { icon: tempIcon }).addTo(markersGroupRef.current);
    }

    filteredVenues.forEach((venue) => {
      const crowdColor =
        venue.crowdStatus === "low" ? "#2e7d32" : venue.crowdStatus === "moderate" ? "#f57c00" : "#d32f2f";

      const totalVotes = (venue.realVotes || 0) + (venue.fakeVotes || 0);
      const isSuspect = totalVotes > 2 && (venue.fakeVotes || 0) > (venue.realVotes || 0);

      const customIcon = L.divIcon({
        className: "custom-puja-marker",
        html: `
          <div style="
            background: ${isSuspect ? "#777777" : crowdColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
              font-weight: bold;
              line-height: 1;
            ">${isSuspect ? "⚠️" : "🪔"}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon });

      marker.on("click", () => {
        setActiveVenue(venue);
      });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #a94532;">${venue.name}</h4>
          <p style="margin: 0 0 4px; font-size: 11px; color: #555;">${venue.zone} · ${venue.district}</p>
          <div style="font-size: 10.5px; color: #777; margin-bottom: 6px;">
            👤 যুক্ত করেছেন: <strong>${venue.addedBy || "কমিউনিটি"}</strong>
          </div>
          <div style="font-size: 11px; font-weight: 600; color: ${crowdColor};">
            ভিড়: ${venue.crowdStatus === "low" ? "কম 🟢" : venue.crowdStatus === "moderate" ? "মাঝারি 🟡" : "বেশি 🔴"}
          </div>
          <div style="font-size: 10px; color: #2e7d32; margin-top: 4px;">
            ✓ আসল ভোট: ${venue.realVotes || 0} | ✕ ভুয়া: ${venue.fakeVotes || 0}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroupRef.current.addLayer(marker);
    });
  }, [filteredVenues, userLiveCoords, clickedLocation, showAddModal]);

  // Center on active venue
  const handleSelectVenue = (venue: PujaVenue) => {
    setActiveVenue(venue);
    if (leafletMapRef.current) {
      leafletMapRef.current.panTo([venue.lat, venue.lng], { animate: true });
    }
  };

  // Locate User's Real-time Live Location
  const handleGoToLiveLocation = () => {
    if (!navigator.geolocation) {
      showToast("আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট করে না।", "warning");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLiveCoords({ lat: latitude, lng: longitude });

        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
        }

        showToast("📍 আপনার বর্তমান লাইভ অবস্থান পাওয়া গেছে! ম্যাপে ক্লিক করে এখানেও মণ্ডপ যুক্ত করতে পারেন।", "success");
      },
      (err) => {
        setIsLocating(false);
        console.error("Geolocation error", err);
        showToast("লোকেশন অ্যাক্সেস পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে লোকেশন অনুমতি দিন।", "warning");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Real vs Fake Voting
  const handleVoteVenue = (venueId: string, voteType: "real" | "fake") => {
    const previousVote = userVotes[venueId];

    if (previousVote === voteType) {
      showToast("আপনি ইতিমধ্যে এই মণ্ডপে ভোট দিয়েছেন!", "info");
      return;
    }

    const updatedVenues = venues.map((v) => {
      if (v.id === venueId) {
        let realCount = v.realVotes || 0;
        let fakeCount = v.fakeVotes || 0;

        if (previousVote === "real") realCount = Math.max(0, realCount - 1);
        if (previousVote === "fake") fakeCount = Math.max(0, fakeCount - 1);

        if (voteType === "real") realCount += 1;
        if (voteType === "fake") fakeCount += 1;

        return {
          ...v,
          realVotes: realCount,
          fakeVotes: fakeCount,
        };
      }
      return v;
    });

    setVenues(updatedVenues);
    if (activeVenue && activeVenue.id === venueId) {
      const v = updatedVenues.find((item) => item.id === venueId);
      if (v) setActiveVenue(v);
    }

    const newVotes = { ...userVotes, [venueId]: voteType };
    setUserVotes(newVotes);

    if (typeof window !== "undefined") {
      localStorage.setItem("sharodiya_venues_bd_v2", JSON.stringify(updatedVenues));
      localStorage.setItem("sharodiya_user_votes", JSON.stringify(newVotes));
    }

    showToast(
      voteType === "real" 
        ? "✓ ধন্যবাদ! আপনার ভোটে মণ্ডপটির সত্যতা বৃদ্ধি পেল।" 
        : "⚠️ ধন্যবাদ! আপনার রিপোর্ট মণ্ডপের সত্যতা যাচাইয়ে ভূমিকা রাখবে।",
      voteType === "real" ? "success" : "warning"
    );
  };

  // Crowd status update
  const handleReportCrowd = (newStatus: "low" | "moderate" | "heavy") => {
    if (!activeVenue) return;
    const updated = venues.map((v) => {
      if (v.id === activeVenue.id) {
        return {
          ...v,
          crowdStatus: newStatus,
          crowdUpdatedAt: "এইমাত্র",
          crowdReportsCount: (v.crowdReportsCount || 0) + 1,
        };
      }
      return v;
    });
    setVenues(updated);
    setActiveVenue((prev) =>
      prev
        ? {
            ...prev,
            crowdStatus: newStatus,
            crowdUpdatedAt: "এইমাত্র",
            crowdReportsCount: (prev.crowdReportsCount || 0) + 1,
          }
        : null
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("sharodiya_venues_bd_v2", JSON.stringify(updated));
    }
    showToast("আপনার ভিড়ের লাইভ রিপোর্ট গ্রহণ করা হয়েছে! ধন্যবাদ।", "success");
  };

  // Add new venue form submission
  const handleAddNewVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim()) return;

    // Use clicked location or user live location or fallback to Dhaka center
    const targetLat = clickedLocation?.lat || userLiveCoords?.lat || (23.7380 + (Math.random() - 0.5) * 0.03);
    const targetLng = clickedLocation?.lng || userLiveCoords?.lng || (90.3950 + (Math.random() - 0.5) * 0.03);

    const newVenue: PujaVenue = {
      id: "venue-bd-" + Date.now(),
      name: newVenueName.trim(),
      zone: newVenueZone.trim() || "ঢাকা",
      district: "ঢাকা",
      address: newVenueAddress.trim() || `${newVenueZone}, ঢাকা`,
      lat: Number(targetLat.toFixed(5)),
      lng: Number(targetLng.toFixed(5)),
      theme: newVenueTheme.trim() || "কমিউনিটি সার্বজনীন শারদীয় দুর্গোৎসব",
      highlights: ["কমিউনিটি পূজা", "পারিবারিক সৌহার্দ্য", "সাবেকি রূপ"],
      anjaliTime: "অষ্টমী সকাল ৯:০০ - ১১:০০",
      aartiTime: "সন্ধ্যা ৬:৪৫ - ৮:০০",
      sandhiPujaTime: "অষ্টমী রাত ৮:২৪",
      crowdStatus: "moderate",
      crowdUpdatedAt: "এইমাত্র যোগ করা হয়েছে",
      crowdReportsCount: 1,
      isIconic: false,
      verified: true,
      mapLink: `https://maps.google.com/?q=${targetLat},${targetLng}`,
      tags: ["নতুন মণ্ডপ", newVenueZone],
      addedBy: submitterName.trim() || "ভক্ত / কমিউনিটি সদস্য",
      addedAt: "এইমাত্র যুক্ত করা হয়েছে",
      realVotes: 1,
      fakeVotes: 0,
    };

    const updated = [newVenue, ...venues];
    setVenues(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("sharodiya_venues_bd_v2", JSON.stringify(updated));
    }

    setShowAddModal(false);
    setClickedLocation(null);
    setActiveVenue(newVenue);
    setSubmitterName("");
    setNewVenueName("");
    setNewVenueAddress("");
    setNewVenueTheme("");

    // Pan map to newly created venue
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([targetLat, targetLng], 14, { duration: 1.2 });
    }

    showToast(`"${newVenue.name}" সফলভাবে ম্যাপে যুক্ত করা হয়েছে!`, "success");
  };

  return (
    <section className="puja-map-section" id="puja-finder">
      <div className="section-header-box">
        <div className="section-title-wrap">
          <p className="eyebrow">
            <span className="live-pulse" /> বাংলাদেশ পূজা পরিক্রমা ও লাইভ ভিড়
          </p>
          <h2>
            ঢাকা ও দেশের <em>পূজা মণ্ডপ</em> খুঁজুন
          </h2>
          <p className="section-subtext">
            ঢাকেশ্বরী জাতীয় মন্দির, রমনা কালী মন্দির, শাঁখারীবাজার, বনানীসহ সারা দেশের বিখ্যাত মণ্ডপগুলোর লাইভ ভিড়, অঞ্জলি ও কমিউনিটি ভেরিফিকেশন।
          </p>
        </div>

        <div className="city-toggle-wrap">
          <button 
            className="live-loc-action-btn"
            onClick={handleGoToLiveLocation}
            disabled={isLocating}
            title="আপনার বর্তমান লাইভ লোকেশনে ম্যাপ নিয়ে যান"
          >
            <LocateFixed size={16} className={isLocating ? "spin-icon" : ""} />
            <span>{isLocating ? "শনাক্ত হচ্ছে..." : "আমার লাইভ লোকেশন"}</span>
          </button>

          <button className="add-venue-btn" onClick={() => setShowAddModal(true)}>
            <PlusCircle size={16} />
            <span>নতুন মণ্ডপ যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Demo Data Warning Announcement Strip */}
      <div className="demo-data-warning-bar">
        <div className="warning-content">
          <AlertTriangle size={16} className="warning-icon" />
          <span>
            <strong>সতর্কতা ও ঘোষণা:</strong> এই ম্যাপে প্রদর্শিত তথ্যসমূহ পরীক্ষামূলক <strong>(ডেমো ডেটা)</strong>। পুরো বাংলাদেশের লাইভ ডেটাবেজ যুক্ত করার কাজ চলছে।
          </span>
        </div>
        <button className="notice-details-btn" onClick={() => setShowDemoNoticeModal(true)}>
          নোটিশ পড়ুন ↗
        </button>
      </div>

      {/* Interactive Map Click Instruction Banner */}
      <div className="map-click-hint-strip">
        <Info size={15} />
        <span>
          💡 <strong>টিপস:</strong> আপনার বর্তমান লাইভ লোকেশনে গিয়ে <strong>ম্যাপের যেকোনো জায়গায় ক্লিক করলেই</strong> সেই নির্দিষ্ট অবস্থানে নতুন মণ্ডপ যুক্ত করতে পারবেন!
        </span>
      </div>

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className={`alert-toast toast-${toastType}`}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="map-filter-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="মণ্ডপের নাম, এলাকা বা কে যুক্ত করেছেন দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="select-pill">
            <SlidersHorizontal size={14} />
            <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
              <option value="all">সব এলাকা</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div className="select-pill">
            <Users size={14} />
            <select value={selectedCrowd} onChange={(e) => setSelectedCrowd(e.target.value)}>
              <option value="all">ভিড়ের সব স্তর</option>
              <option value="low">কম ভিড় (🟢 স্বস্তিদায়ক)</option>
              <option value="moderate">মাঝারি ভিড় (🟡 স্বাভাবিক)</option>
              <option value="heavy">বেশি ভিড় (🔴 উপচে পড়া)</option>
            </select>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
              title="ম্যাপ ভিউ"
            >
              <Layers size={15} />
              <span>ম্যাপ</span>
            </button>
            <button
              className={`mode-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="তালিকা ভিউ"
            >
              <MapPin size={15} />
              <span>তালিকা</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar Container */}
      <div className="map-layout-grid">
        {/* Left Side: Venue List / Cards */}
        <div className="venue-list-scroll">
          <div className="list-meta">
            <span>{filteredVenues.length} টি মণ্ডপ পাওয়া গেছে</span>
            <small>ক্লিক করে বিশদ, লাইভ ভিড় ও ভোট দেখুন</small>
          </div>

          <div className="venue-cards-stack">
            {filteredVenues.length === 0 ? (
              <div className="empty-results">
                <AlertTriangle size={32} />
                <p>কোনো মণ্ডপ খুঁজে পাওয়া যায়নি।</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedZone("all");
                    setSelectedCrowd("all");
                  }}
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              filteredVenues.map((v) => {
                const isSelected = activeVenue?.id === v.id;
                const statusColor =
                  v.crowdStatus === "low" ? "badge-low" : v.crowdStatus === "moderate" ? "badge-moderate" : "badge-heavy";
                const statusLabel =
                  v.crowdStatus === "low" ? "কম ভিড়" : v.crowdStatus === "moderate" ? "মাঝারি" : "উপচে পড়া ভিড়";

                const totalVotes = (v.realVotes || 0) + (v.fakeVotes || 0);
                const realPct = totalVotes > 0 ? Math.round(((v.realVotes || 0) / totalVotes) * 100) : 100;

                return (
                  <article
                    key={v.id}
                    className={`venue-card-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectVenue(v)}
                  >
                    <div className="card-top">
                      <div className="card-badges">
                        <span className={`crowd-badge ${statusColor}`}>
                          <span className="dot" /> {statusLabel}
                        </span>
                        {v.isIconic && <span className="iconic-badge">★ জাতীয় ঐতিহ্য</span>}
                      </div>
                      <span className="zone-tag">{v.zone}</span>
                    </div>

                    <h3 className="venue-title">{v.name}</h3>
                    <p className="venue-theme-snippet">{v.theme}</p>

                    <div className="venue-submitter-bar">
                      <span className="submitter-tag">
                        <User size={11} /> যোগ করেছেন: <strong>{v.addedBy || "কমিউনিটি"}</strong>
                      </span>
                      <span className="verification-pill">
                        🛡️ {realPct}% আসল
                      </span>
                    </div>

                    <div className="card-footer-info">
                      <span className="timing-chip">
                        <Clock size={12} /> {v.anjaliTime.split("-")[0]}
                      </span>
                      <span className="reports-chip">
                        <Users size={12} /> {v.crowdReportsCount || 1} জনের রিপোর্ট
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Center / Right: Interactive Map or Full List */}
        <div className="map-view-column">
          {viewMode === "map" ? (
            <div className="leaflet-outer-wrap">
              <div ref={mapContainerRef} className="leaflet-map-canvas" />
              {!mapLoaded && (
                <div className="map-loading-overlay">
                  <div className="loader-spinner" />
                  <p>ঢাকার ম্যাপ প্রস্তুত হচ্ছে...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid-list-view">
              {filteredVenues.map((v) => (
                <div key={v.id} className="detailed-grid-card" onClick={() => handleSelectVenue(v)}>
                  <h4>{v.name}</h4>
                  <p className="grid-theme">{v.theme}</p>
                  <p className="grid-address"><MapPin size={13}/> {v.address}</p>
                  <p className="grid-submitter">👤 যুক্ত করেছেন: {v.addedBy || "কমিউনিটি"}</p>
                  <div className="grid-tags">
                    {v.highlights.map((h, i) => (
                      <span key={i} className="highlight-tag">{h}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Venue Details Drawer / Bottom Card */}
          {activeVenue && (
            <div className="active-venue-drawer">
              <div className="drawer-header">
                <div>
                  <div className="drawer-sub-meta">
                    <span className="active-city-badge">
                      {activeVenue.district} · {activeVenue.zone}
                    </span>
                    <span className="update-time">লাইভ রিপোর্ট: {activeVenue.crowdUpdatedAt}</span>
                  </div>
                  <h3>{activeVenue.name}</h3>
                  <div className="venue-creator-info">
                    <User size={12} />
                    <span>যুক্ত করেছেন: <strong>{activeVenue.addedBy || "বাংলাদেশ পূজা পরিষদ"}</strong></span>
                    {activeVenue.addedAt && <span>({activeVenue.addedAt})</span>}
                  </div>
                </div>

                <div className="drawer-actions-right">
                  <a
                    href={activeVenue.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dir-link-btn"
                  >
                    <Navigation size={14} />
                    <span>দিকনির্দেশ</span>
                  </a>
                  {onSelectForCard && (
                    <button
                      className="card-tag-btn"
                      onClick={() => onSelectForCard(activeVenue.name)}
                      title="এই মণ্ডপের নাম শুভেচ্ছা কার্ডে যুক্ত করুন"
                    >
                      <Sparkles size={14} />
                      <span>কার্ডে যুক্ত করুন</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="drawer-address">
                <MapPin size={14} /> {activeVenue.address}
              </p>

              <div className="drawer-theme-box">
                <strong>ঐতিহ্য ও আকর্ষণ:</strong> {activeVenue.theme}
              </div>

              <div className="timings-row">
                <div className="time-col">
                  <small>অঞ্জলির সময়</small>
                  <span>{activeVenue.anjaliTime}</span>
                </div>
                <div className="time-col">
                  <small>সন্ধিপূজা</small>
                  <span>{activeVenue.sandhiPujaTime}</span>
                </div>
                <div className="time-col">
                  <small>আরতি</small>
                  <span>{activeVenue.aartiTime}</span>
                </div>
              </div>

              {/* REAL vs FAKE VOTING SYSTEM */}
              <div className="verification-vote-section">
                <div className="vote-header-row">
                  <div className="vote-title-wrap">
                    <ShieldCheck size={16} className="shield-icon" />
                    <strong>কমিউনিটি ভেরিফিকেশন (আসল নাকি ভুয়া?):</strong>
                  </div>
                  {(() => {
                    const total = (activeVenue.realVotes || 0) + (activeVenue.fakeVotes || 0);
                    const pct = total > 0 ? Math.round(((activeVenue.realVotes || 0) / total) * 100) : 100;
                    if (total >= 2 && (activeVenue.fakeVotes || 0) > (activeVenue.realVotes || 0)) {
                      return <span className="trust-badge warning">⚠️ ভুয়া হিসেবে রিপোর্ট বেশি</span>;
                    }
                    return <span className="trust-badge verified">🛡️ {pct}% ভক্ত বলেছেন এটি আসল</span>;
                  })()}
                </div>

                <div className="vote-buttons-row">
                  <button
                    className={`vote-btn vote-real ${userVotes[activeVenue.id] === "real" ? "voted" : ""}`}
                    onClick={() => handleVoteVenue(activeVenue.id, "real")}
                  >
                    <ThumbsUp size={15} />
                    <span>এটি আসল মণ্ডপ (Real)</span>
                    <strong className="vote-count">{activeVenue.realVotes || 0}</strong>
                  </button>

                  <button
                    className={`vote-btn vote-fake ${userVotes[activeVenue.id] === "fake" ? "voted" : ""}`}
                    onClick={() => handleVoteVenue(activeVenue.id, "fake")}
                  >
                    <ThumbsDown size={15} />
                    <span>ভুল বা ভুয়া তথ্য (Fake)</span>
                    <strong className="vote-count">{activeVenue.fakeVotes || 0}</strong>
                  </button>
                </div>
              </div>

              {/* Crowd Reporting Buttons */}
              <div className="crowd-reporting-box">
                <div className="crowd-report-label">
                  <Flame size={15} />
                  <span>আপনি কি এই মণ্ডপে আছেন? ভিড়ের অবস্থা জানান:</span>
                </div>
                <div className="crowd-actions">
                  <button
                    className={`crowd-vote-btn vote-low ${activeVenue.crowdStatus === "low" ? "active" : ""}`}
                    onClick={() => handleReportCrowd("low")}
                  >
                    🟢 কম ভিড়
                  </button>
                  <button
                    className={`crowd-vote-btn vote-mod ${activeVenue.crowdStatus === "moderate" ? "active" : ""}`}
                    onClick={() => handleReportCrowd("moderate")}
                  >
                    🟡 মাঝারি ভিড়
                  </button>
                  <button
                    className={`crowd-vote-btn vote-heavy ${activeVenue.crowdStatus === "heavy" ? "active" : ""}`}
                    onClick={() => handleReportCrowd("heavy")}
                  >
                    🔴 উপচে পড়া ভিড়
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Mandap Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => { setShowAddModal(false); setClickedLocation(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>নতুন পুজো মণ্ডপ যোগ করুন</h3>
                {clickedLocation ? (
                  <span className="modal-coord-pill">
                    📍 ম্যাপে নির্বাচিত অবস্থান: [{clickedLocation.lat}, {clickedLocation.lng}]
                  </span>
                ) : userLiveCoords ? (
                  <span className="modal-coord-pill">
                    📍 আপনার বর্তমান লাইভ অবস্থান ব্যবহার করা হচ্ছে
                  </span>
                ) : null}
              </div>
              <button className="close-btn" onClick={() => { setShowAddModal(false); setClickedLocation(null); }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewVenue} className="add-venue-form">
              <p className="form-subtext">
                আপনার এলাকার দুর্গাপূজার তথ্য যুক্ত করুন। অন্য ভক্তরা এটি যাচাই (Real/Fake ভোট) করতে পারবেন।
              </p>

              <div className="form-field">
                <label>আপনার নাম (কে যুক্ত করছেন) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: অনির্বাণ চক্রবর্তী / প্রিয়ন্তী দাস"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>মণ্ডপের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: শান্তিনগর সার্বজনীন পূজা মণ্ডপ / ওয়ারী পুজো"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>এলাকা / জোন *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: পুরান ঢাকা / ধানমন্ডি / মিরপুর / গুলশান"
                  value={newVenueZone}
                  onChange={(e) => setNewVenueZone(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>বিস্তারিত ঠিকানা</label>
                <input
                  type="text"
                  placeholder="রাস্তা, মোড় বা নিকটবর্তী ল্যান্ডমার্ক"
                  value={newVenueAddress}
                  onChange={(e) => setNewVenueAddress(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>মণ্ডপের আকর্ষণ বা বিশেষত্ব</label>
                <textarea
                  rows={2}
                  placeholder="এবারের প্রতিমার রূপ, আলোকসজ্জা বা প্রসাদ বিতরণ সম্পর্কিত তথ্য..."
                  value={newVenueTheme}
                  onChange={(e) => setNewVenueTheme(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => { setShowAddModal(false); setClickedLocation(null); }}
                >
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  মণ্ডপ যুক্ত করুন 📍
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Demo Data Notice Modal Popup */}
      {showDemoNoticeModal && (
        <div className="modal-backdrop" onClick={() => setShowDemoNoticeModal(false)}>
          <div className="modal-content demo-notice-popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="warning-modal-badge">⚠️ ঘোষণা</span>
                <h3 style={{ margin: 0, color: "#854d0e" }}>শারদীয় ম্যাপ সংক্রান্ত বিজ্ঞপ্তি</h3>
              </div>
              <button className="close-btn" onClick={() => setShowDemoNoticeModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="demo-notice-body">
              <div className="demo-status-pill">
                <AlertTriangle size={18} className="warn-icon" />
                <div>
                  <strong>বর্তমানে প্রদর্শিত মণ্ডপগুলো পরীক্ষামূলক (ডেমো ডেটা)</strong>
                  <p>ওয়েবসাইটের ফিচার ও নেভিগেশন দেখানোর সুবিধার্থে কিছু প্রতীকী তথ্য প্রদর্শিত হচ্ছে।</p>
                </div>
              </div>

              <div className="demo-points-list">
                <div className="point-item">
                  <span className="point-dot">১</span>
                  <p>
                    <strong>লাইভ ডেটাবেজ যুক্ত করার কাজ চলছে:</strong> ঢাকা ও সমগ্র বাংলাদেশের প্রতিটি পূজা মণ্ডপ, সঠিক অঞ্জলি সময়সূচী ও লাইভ ভিড় প্রতিনিয়ত হালনাগাদ করা হচ্ছে।
                  </p>
                </div>
                <div className="point-item">
                  <span className="point-dot">২</span>
                  <p>
                    <strong>সরাসরি মণ্ডপ যুক্ত করার সুযোগ:</strong> আপনি চাইলে এখনই <strong>"আমার লাইভ লোকেশন"</strong>-এ গিয়ে অথবা <strong>ম্যাপের যেকোনো স্থানে ক্লিক করে</strong> আপনার এলাকার আসল মণ্ডপ ম্যাপে যোগ করতে পারেন!
                  </p>
                </div>
                <div className="point-item">
                  <span className="point-dot">৩</span>
                  <p>
                    <strong>কমিউনিটি ভেরিফিকেশন:</strong> প্রতিটি মণ্ডপে গিয়ে <strong>'✓ আসল (Real)'</strong> বা <strong>'✕ ভুয়া (Fake)'</strong> ভোট দিয়ে সঠিক তথ্য নিশ্চিত করতে অন্য ভক্তদের সাহায্য করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: "16px" }}>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ width: "100%", padding: "13px", fontSize: "14px", fontWeight: "600" }}
                onClick={() => setShowDemoNoticeModal(false)}
              >
                আমি বুঝতে পেরেছি (ম্যাপ শুরু করুন)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
