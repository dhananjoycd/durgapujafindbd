"use client";

import { useState } from "react";
import CardEditor from "@/components/card-editor";
import PujaMap from "@/components/puja-map";
import CommunityGallery from "@/components/community-gallery";
import { Sparkles, MapPin, Compass } from "lucide-react";

export default function Home() {
  const [selectedVenueForCard, setSelectedVenueForCard] = useState<string>("");

  const handleSelectVenueForCard = (venueName: string) => {
    setSelectedVenueForCard(venueName);
    const editorElem = document.getElementById("editor");
    if (editorElem) {
      editorElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="main-wrapper">
      {/* Top Festive Announcement Bar */}
      <div className="announcement">
        <span className="announcement-mark">✳</span>
        <span>পুজো মানেই ফিরে আসা, একান্নবর্তী স্মৃতি আর একরাশ আনন্দ</span>
        <span className="announcement-divider">/</span>
        <span>শারদীয়া ১৪৩৩ · মা আসছেন · ঢাকা ও বাংলাদেশ</span>
      </div>

      {/* Main Navigation Header */}
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="শারদীয়া, হোম">
          <span className="brand-icon">শ</span>
          <span>
            শারদীয়া<span className="brand-dot">.</span>
          </span>
        </a>

        <nav>
          <a className="nav-link" href="#editor">
            কার্ড স্টুডিও
          </a>
          <a className="nav-link nav-map-link" href="#puja-finder">
            <MapPin size={14} /> ঢাকা পুজো ম্যাপ
          </a>
          <a className="nav-link" href="#community">
            কমিউনিটি
          </a>
          <a className="nav-link" href="#how-it-works">
            ব্যবহার বিধি
          </a>
        </nav>

        <a href="#editor" className="header-cta-btn">
          কার্ড বানান <span>↗</span>
        </a>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="pulse-dot" /> শারদোৎসব ১৪৩৩ · শুভ আগমনী · বাংলাদেশ
          </p>
          <h1>
            এই পুজোয়,<br />
            মনটা <em>বাড়ি ফেরে।</em>
          </h1>
          <p className="hero-description">
            কোলাহলের শহরে কিংবা প্রবাসের দূর দিগন্তে যেখানেই থাকি না কেন, ঢাকের কাঠির মিষ্টি আওয়াজে মন ছুটে যায় চেনা আঙিনায়। কাশবনের শুভ্র দোলা, শিউলি ঝরা সকাল আর শাঁখারীবাজার থেকে ঢাকেশ্বরী জাতীয় মন্দিরের ধুনুচি আরতির সুবাসে জেগে উঠুক প্রাণের বাংলাদেশ। প্রিয়জনদের সঙ্গে ভাগ করে নিন নিজের ফটো কার্ড।
          </p>

          <div className="hero-cta-group">
            <a className="hero-button primary-hero-btn" href="#editor">
              <Sparkles size={18} />
              <span>কার্ড বানানো শুরু করুন</span>
            </a>
            <a className="hero-button secondary-hero-btn" href="#puja-finder">
              <Compass size={18} />
              <span>মণ্ডপ খুঁজুন ম্যাপে</span>
            </a>
          </div>

          <div className="hero-social-proof">
            <div className="avatar-stack">
              <span>অ</span>
              <span>ত</span>
              <span>প</span>
              <b>+</b>
            </div>
            <span>১০,০০০+ ভক্ত ও শুভানুধ্যায়ী ইতিমধ্যে শুভেচ্ছা কার্ড তৈরি করেছেন</span>
          </div>
        </div>

        {/* Real Photo Card Showcase (Clean Masterpiece Template Ready for User Photo) */}
        <div className="hero-real-card-wrap">
          <div className="hero-reference-poster-card">
            <img
              src="/themes/durga-master-template.jpg"
              alt="শারদীয় দুর্গাপূজার খাঁটি পোস্টার ফ্রেম"
              className="reference-poster-img"
            />
            <div className="poster-overlay-badge">
              <span className="badge-spark">✨</span>
              <span>আসল পোস্টার ফ্রেম: নিজের ছবি ও নাম দিয়ে ব্যানার তৈরি করুন</span>
            </div>
          </div>

          <a href="#editor" className="card-create-floating-hint">
            <Sparkles size={14} /> এখনই নিজের ছবি দিয়ে ব্যানার বানান ↗
          </a>
        </div>
      </section>

      {/* Section 1: Dynamic Photo Card Generator */}
      <section className="editor-section" id="editor">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — আপনার শুভেচ্ছা কার্ড</p>
            <h2>
              স্মৃতিটা থাকুক <em>উৎসবের ফ্রেমে।</em>
            </h2>
          </div>
          <p>
            নিজের ছবি, নাম ও মণ্ডপের ঠিকানা দিন। মা দুর্গার প্রতিমা ও বাংলা শুভেচ্ছা সাজিয়ে ডাউনলোড করুন ২× HD প্রিন্ট কোয়ালিটিতে অথবা সরাসরি WhatsApp-এ বন্ধুদের পাঠান।
          </p>
        </div>

        <CardEditor initialVenueName={selectedVenueForCard} />
      </section>

      {/* Section 2: Interactive Puja Finder Map */}
      <PujaMap onSelectForCard={handleSelectVenueForCard} />

      {/* Section 3: Community & Viral Challenge */}
      <CommunityGallery />

      {/* Section 4: How it Works */}
      <section className="how-section" id="how-it-works">
        <div className="how-container">
          <p className="eyebrow">সহজ ৩ ধাপ</p>
          <h2>
            তিন পদক্ষেপে <em>আপনার পুজোর কার্ড</em>
          </h2>

          <div className="steps">
            <article>
              <span>01</span>
              <h3>নিজের ছবিটি দিন</h3>
              <p>সবচেয়ে নিখুঁত ফিনিশের জন্য ব্যাকগ্রাউন্ড রিমুভ করা (PNG) ছবি ব্যবহার করুন, যাতে কার্ডের থিমে চমৎকারভাবে মানিয়ে যায়।</p>
            </article>
            <article>
              <span>02</span>
              <h3>মা দুর্গার রূপ ও থিম বাছুন</h3>
              <p>১২টি ঐতিহ্যবাহী ও আধুনিক থিম, মায়ের প্রতিমা, আলপনা, ঢাক ও নিজের আন্তরিক বাংলা শুভেচ্ছা যুক্ত করুন।</p>
            </article>
            <article>
              <span>03</span>
              <h3>সবার সাথে ভাগ করে নিন</h3>
              <p>২× HD PNG ডাউনলোড করুন এবং এক ক্লিকে প্রিয়জনদের WhatsApp ও সামাজিক মাধ্যমে শারদীয়ার প্রীতি ছড়িয়ে দিন।</p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <a className="wordmark" href="#home">
            <span className="brand-icon">শ</span>
            <span>
              শারদীয়া<span className="brand-dot">.</span>
            </span>
          </a>
          <p>এই শরৎ হোক আপনজনের নামে। শারদীয়ার আন্তরিক প্রীতি ও শুভেচ্ছা ১৪৩৩ · বাংলাদেশ।</p>
          <a href="#editor" className="footer-top-btn">
            একটি কার্ড বানান ↑
          </a>
        </div>
        <div className="footer-bottom">
          <small>© ২০২৬ শারদীয়া — সর্বস্বত্ব সংরক্ষিত · উৎসবের আনন্দে সবার পাশে</small>
        </div>
      </footer>
    </main>
  );
}
