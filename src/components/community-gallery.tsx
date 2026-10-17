"use client";

import { useState } from "react";
import { Share2, Heart, Award, Sparkles, MessageCircle } from "lucide-react";

interface CommunityCard {
  id: string;
  sender: string;
  location: string;
  greeting: string;
  sub: string;
  likes: number;
  templateStyle: string;
  bgGradient: string;
  tag: string;
}

const initialCards: CommunityCard[] = [
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

export default function CommunityGallery() {
  const [cards, setCards] = useState<CommunityCard[]>(initialCards);
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});

  const handleLike = (id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = likedCards[id];
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1,
          };
        }
        return c;
      })
    );
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShareChallenge = () => {
    const text = "🪔 আমি শারদীয়া অ্যাপে নিজের দুর্গোৎসবের শুভেচ্ছা কার্ড বানিয়েছি! আপনিও বানিয়ে ফেলুন আর আমাদের সাথে শেয়ার করুন।\n\nকার কার্ড সবচেয়ে সুন্দর হয় দেখা যাক! 🌸✨";
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="community-section" id="community">
      <div className="community-container">
        {/* Viral Challenge Banner */}
        <div className="viral-challenge-card">
          <div className="challenge-content">
            <span className="challenge-badge">
              <Award size={15} /> ফ্রেন্ডস অ্যান্ড ফ্যামিলি পুজো চ্যালেঞ্জ ১৪৩৩
            </span>
            <h3>
              কার পুজোর কার্ড <em>সবচেয়ে সুন্দর?</em>
            </h3>
            <p>
              নিজের ছবি আর প্রিয় মণ্ডপের নাম দিয়ে কার্ড বানান, বন্ধুদের WhatsApp-এ চ্যালেঞ্জ পাঠান আর দেখুন কার শুভেচ্ছায় সবচেয়ে বেশি ভালোবাসা মেলে!
            </p>
            <div className="challenge-buttons">
              <a href="#editor" className="create-card-action">
                <Sparkles size={16} /> নিজের কার্ড তৈরি করুন
              </a>
              <button className="share-challenge-btn" onClick={handleShareChallenge}>
                <MessageCircle size={16} /> বন্ধুদের চ্যালেঞ্জ পাঠান
              </button>
            </div>
          </div>
          <div className="challenge-ornament">
            <div className="art-circle-ring" />
            <span className="festive-icon-big">🌸</span>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="gallery-header">
          <div>
            <p className="eyebrow">কমিউনিটি গ্যালারি</p>
            <h2>
              সবার সৃষ্টি, <em>একত্রিত উৎসব</em>
            </h2>
          </div>
          <p className="gallery-desc">
            বাংলাদেশের বিভিন্ন প্রান্তের বন্ধুদের তৈরি দারুণ সব শারদীয় কার্ড দেখুন ও ভালোবাসা দিন।
          </p>
        </div>

        <div className="community-cards-grid">
          {cards.map((card) => {
            const isLiked = likedCards[card.id];
            const isDark = card.id === "card-3";
            return (
              <div
                key={card.id}
                className={`community-card-item ${isDark ? "dark-theme" : ""}`}
                style={{ background: card.bgGradient }}
              >
                <div className="card-top-tag">
                  <span className="item-tag">{card.tag}</span>
                  <span className="style-name">{card.templateStyle}</span>
                </div>

                <div className="card-greeting-box">
                  <h4>{card.greeting}</h4>
                  <p className="sub-quote">“{card.sub}”</p>
                </div>

                <div className="card-sender-meta">
                  <div className="sender-avatar">
                    {card.sender.charAt(0)}
                  </div>
                  <div className="sender-text">
                    <strong>শুভেচ্ছান্তে: {card.sender}</strong>
                    <small>📍 {card.location}</small>
                  </div>
                </div>

                <div className="card-bottom-actions">
                  <button
                    className={`like-btn ${isLiked ? "liked" : ""}`}
                    onClick={() => handleLike(card.id)}
                  >
                    <Heart size={16} fill={isLiked ? "#e91e63" : "none"} color={isLiked ? "#e91e63" : "currentColor"} />
                    <span>{card.likes}</span>
                  </button>

                  <button
                    className="quick-share-btn"
                    onClick={() => {
                      const text = `🌸 ${card.greeting} — ${card.sender} (${card.location}) এর পুজো শুভেচ্ছা কার্ড!`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                    }}
                    title="হোয়াটসঅ্যাপে শেয়ার করুন"
                  >
                    <Share2 size={15} />
                    <span>শেয়ার</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
