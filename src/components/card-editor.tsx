"use client";

import { useRef, useState, useEffect } from "react";
import { 
  Download, 
  ImagePlus, 
  Share2, 
  Sparkles, 
  Palette, 
  Type, 
  Check, 
  Trash2, 
  Info, 
  Sliders, 
  HeartHandshake,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Edit3,
  BookmarkCheck
} from "lucide-react";
import { bannerThemes, BannerTheme } from "@/lib/templates";

interface CardEditorProps {
  initialVenueName?: string;
}

const festivalTaglines = [
  "শুভ মহালয়া",
  "শুভ মহাসপ্তমী",
  "শুভ মহাষ্টমী",
  "শুভ মহাষষ্ঠী",
  "শুভ মহানবমী",
  "শুভ বিজয়া দশমী",
] as const;

export default function CardEditor({ initialVenueName }: CardEditorProps) {
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);

  // Selected Theme (Default to 100% Masterpiece)
  const [activeTheme, setActiveTheme] = useState<BannerTheme>(bannerThemes[0]);

  // Master Theme Text Customization Mode
  // If true, user's edited texts are rendered dynamically over the clean background
  const [isCustomTextMode, setIsCustomTextMode] = useState(false);

  // User inputs
  const [userName, setUserName] = useState("ধনঞ্জয় চন্দ্র দাস");
  const [userLocation, setUserLocation] = useState(initialVenueName || "শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা");
  const [taglineText, setTaglineText] = useState<string>(festivalTaglines[0]);

  const cycleFestivalTagline = () => {
    const currentIndex = festivalTaglines.indexOf(taglineText as (typeof festivalTaglines)[number]);
    setTaglineText(festivalTaglines[(currentIndex + 1) % festivalTaglines.length]);
  };

  // Editable Texts (used in custom text mode and for all themes)
  const [quoteText, setQuoteText] = useState(bannerThemes[0].quote);
  const [headingPrefix, setHeadingPrefix] = useState(bannerThemes[0].headingPrefix);
  const [headingMain, setHeadingMain] = useState(bannerThemes[0].headingMain);
  const [headingSuffix, setHeadingSuffix] = useState(bannerThemes[0].headingSuffix);
  const [blessingMessage, setBlessingMessage] = useState(bannerThemes[0].message);
  const [closingTag, setClosingTag] = useState(bannerThemes[0].closingTag);

  // Editable Colors
  const [headingColor, setHeadingColor] = useState(bannerThemes[0].headingColor);
  const [quoteColor, setQuoteColor] = useState(bannerThemes[0].quoteColor);
  const [textColor, setTextColor] = useState(bannerThemes[0].textColor);
  const [senderColor, setSenderColor] = useState(bannerThemes[0].senderColor);

  // User Photo & Adjustment Controls
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [photoFlipped, setPhotoFlipped] = useState(false);
  const [photoFrameStyle, setPhotoFrameStyle] = useState<"cutout" | "circle" | "rounded">("cutout");

  // Active Tab
  const [editorTab, setEditorTab] = useState<"quick" | "themes" | "text" | "colors">("quick");
  const [isExporting, setIsExporting] = useState(false);

  // Update location if passed from Map
  useEffect(() => {
    if (initialVenueName) {
      setUserLocation(initialVenueName);
    }
  }, [initialVenueName]);

  // Determine active background image
  const currentBgImage = 
    activeTheme.isMasterpiece && isCustomTextMode
      ? (activeTheme.cleanBgImage || activeTheme.bgImage)
      : activeTheme.bgImage;

  // Handle Theme Selection
  const handleSelectTheme = (theme: BannerTheme) => {
    setActiveTheme(theme);
    setQuoteText(theme.quote);
    setHeadingPrefix(theme.headingPrefix);
    setHeadingMain(theme.headingMain);
    setHeadingSuffix(theme.headingSuffix);
    setBlessingMessage(theme.message);
    setClosingTag(theme.closingTag);
    setHeadingColor(theme.headingColor);
    setQuoteColor(theme.quoteColor);
    setTextColor(theme.textColor);
    setSenderColor(theme.senderColor);
  };

  // Upload Photo
  const handleUploadUserPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setUserPhotoUrl(ev.target.result);
        setPhotoScale(1);
        setPhotoOffsetX(0);
        setPhotoOffsetY(0);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Reset photo adjustments
  const handleResetPhoto = () => {
    setPhotoScale(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setPhotoFlipped(false);
  };

  // Helper when user edits any text: automatically enable custom text mode
  const handleTextChange = (updater: () => void) => {
    updater();
    if (activeTheme.isMasterpiece) {
      setIsCustomTextMode(true);
    }
  };

  // 2x Ultra-HD Clean Canvas Export Function
  const handleDownloadHd = async () => {
    setIsExporting(true);

    try {
      const W = 2048;
      const H = 1374;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ensure fonts are loaded
      await document.fonts.ready;

      const drawLocationBadge = (label: string, centerX: number, baselineY: number, fontSize: number, darkTheme = false) => {
        ctx.save();
        ctx.font = `600 ${fontSize}px "Noto Sans Bengali", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Keep the location badge inside the same right-side text column as the preview.
        const maxTextWidth = W * 0.4 - 36;
        const textWidth = Math.min(ctx.measureText(label).width, maxTextWidth);
        const badgeWidth = textWidth + 36;
        const badgeHeight = fontSize * 1.75;
        ctx.fillStyle = darkTheme ? "rgba(75, 26, 14, 0.94)" : "rgba(255, 248, 225, 0.96)";
        ctx.strokeStyle = darkTheme ? "rgba(255, 216, 128, 0.75)" : "rgba(151, 100, 30, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(centerX - badgeWidth / 2, baselineY - badgeHeight / 2, badgeWidth, badgeHeight, badgeHeight / 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = darkTheme ? "#fff0bd" : "#5c3e27";
        ctx.fillText(label, centerX, baselineY, maxTextWidth);
        ctx.restore();
      };

      // 1. Draw High-Res Background Image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = reject;
        bgImg.src = currentBgImage;
      });
      ctx.drawImage(bgImg, 0, 0, W, H);

      // 2. Draw User Photo (if present) on the Left
      if (userPhotoUrl) {
        try {
          const userImg = new Image();
          userImg.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            userImg.onload = () => resolve();
            userImg.onerror = reject;
            userImg.src = userPhotoUrl;
          });

          const slotCenterX = W * 0.2;
          const offsetX = photoOffsetX * 2;
          const offsetY = photoOffsetY * 2;
          const drawCover = (x: number, y: number, width: number, height: number) => {
            const coverScale = Math.max(width / userImg.width, height / userImg.height);
            const sourceWidth = width / coverScale;
            const sourceHeight = height / coverScale;
            const sourceX = (userImg.width - sourceWidth) / 2;
            const sourceY = (userImg.height - sourceHeight) / 2;

            if (photoFlipped) {
              ctx.translate(x + width, y);
              ctx.scale(-1, 1);
              ctx.drawImage(userImg, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
            } else {
              ctx.drawImage(userImg, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
            }
          };

          if (photoFrameStyle === "circle") {
            // Match the preview's 210 px circular frame at its 820 px poster width.
            const diameter = W * (210 / 820) * photoScale;
            const drawX = slotCenterX - diameter / 2 + offsetX;
            const drawY = H - diameter - H * (25 / 550) + offsetY;
            const centerX = drawX + diameter / 2;
            const centerY = drawY + diameter / 2;
            const radius = diameter / 2;

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 30;
            drawCover(drawX, drawY, diameter, diameter);
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = 4 * (W / 820);
            ctx.strokeStyle = "#d4af37";
            ctx.stroke();
            ctx.restore();
          } else if (photoFrameStyle === "rounded") {
            // Match the preview's 220 x 270 px portrait frame.
            const frameWidth = W * (220 / 820) * photoScale;
            const frameHeight = H * (270 / 550) * photoScale;
            const drawX = slotCenterX - frameWidth / 2 + offsetX;
            const drawY = H - frameHeight - H * (20 / 550) + offsetY;
            const radius = 16 * (W / 820) * photoScale;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(drawX, drawY, frameWidth, frameHeight, radius);
            ctx.clip();
            ctx.shadowColor = "rgba(0,0,0,0.45)";
            ctx.shadowBlur = 30;
            drawCover(drawX, drawY, frameWidth, frameHeight);
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(drawX, drawY, frameWidth, frameHeight, radius);
            ctx.lineWidth = 3.5 * (W / 820);
            ctx.strokeStyle = "#d4af37";
            ctx.stroke();
            ctx.restore();
          } else {
            // Keep the cutout inside the preview's left photo column.
            const targetW = W * 0.34;
            const targetH = H * 0.84;
            const scale = Math.min(targetW / userImg.width, targetH / userImg.height) * photoScale;
            const drawW = userImg.width * scale;
            const drawH = userImg.height * scale;
            const drawX = slotCenterX - drawW / 2 + offsetX;
            const drawY = H - drawH + offsetY;

            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.45)";
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            if (photoFlipped) {
              ctx.translate(drawX + drawW, drawY);
              ctx.scale(-1, 1);
              ctx.drawImage(userImg, 0, 0, drawW, drawH);
            } else {
              ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
            }
            ctx.restore();
          }
        } catch (e) {
          console.error("Could not render user photo to canvas", e);
        }
      }

      if (taglineText.trim()) {
        const boxX = W * 0.035;
        const boxY = H * 0.045;
        const boxW = W * 0.32;
        const boxH = 86;
        ctx.save();
        ctx.shadowColor = "rgba(70, 37, 12, 0.22)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "rgba(255, 248, 220, 0.88)";
        ctx.strokeStyle = "rgba(168, 107, 27, 0.68)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 24);
        ctx.fill();
        ctx.stroke();
        ctx.shadowColor = "transparent";
        ctx.font = 'bold 40px "Noto Serif Bengali", Georgia, serif';
        ctx.fillStyle = "#7b251b";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(taglineText, boxX + boxW / 2, boxY + boxH / 2, boxW - 36);
        ctx.restore();
      }

      // 3. Render Center Typography
      if (activeTheme.isMasterpiece && !isCustomTextMode) {
        // Original Masterpiece Mode: original 3D calligraphy is already in background!
        const centerX = W * 0.561; // 1148px
        const nameY = H * 0.825;    // 1133px
        const locY = H * 0.875;     // 1202px

        // Render Name: "— ধনঞ্জয় চন্দ্র দাস"
        ctx.save();
        ctx.font = 'bold 50px "Noto Serif Bengali", Georgia, serif';
        ctx.fillStyle = senderColor;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 10;
        ctx.fillText(`— ${userName}`, centerX, nameY);
        ctx.restore();

        // Render Location
        if (userLocation) {
          drawLocationBadge(`📍 ${userLocation} · শারদীয়া ১৪৩৩`, centerX, locY, 30);
        }

        // Flourish line
        ctx.save();
        ctx.font = '24px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = "#b8860b";
        ctx.textAlign = "center";
        ctx.fillText("❖ ────── 🪷 ────── ❖", centerX, nameY + 36);
        ctx.restore();
      } else {
        // Custom Mode or Other Themes: Render full text with background-matching vignette
        const centerX = activeTheme.isMasterpiece ? W * 0.561 : 1150;

        // Draw soft background-matching radial vignette under text for 100% readability
        ctx.save();
        const vCenterY = 660;
        const vRadius = 650;
        const vignette = ctx.createRadialGradient(centerX, vCenterY, 50, centerX, vCenterY, vRadius);
        if (activeTheme.darkTheme) {
          vignette.addColorStop(0, "rgba(25, 4, 4, 0.75)");
          vignette.addColorStop(0.7, "rgba(25, 4, 4, 0.45)");
          vignette.addColorStop(1, "rgba(25, 4, 4, 0)");
        } else {
          vignette.addColorStop(0, "rgba(255, 255, 255, 0.82)");
          vignette.addColorStop(0.7, "rgba(255, 255, 255, 0.45)");
          vignette.addColorStop(1, "rgba(255, 255, 255, 0)");
        }
        ctx.fillStyle = vignette;
        ctx.fillRect(centerX - 600, 60, 1200, 1250);
        ctx.restore();

        // Top Quote
        ctx.save();
        ctx.font = '600 28px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = quoteColor;
        ctx.textAlign = "center";
        ctx.shadowColor = activeTheme.darkTheme ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 8;
        ctx.fillText(quoteText, centerX, 150);
        ctx.restore();

        // Heading Prefix: "শারদীয়"
        ctx.save();
        ctx.font = '600 48px "Noto Serif Bengali", Georgia, serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.shadowColor = activeTheme.darkTheme ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 8;
        ctx.fillText(headingPrefix, centerX, 255);
        ctx.restore();

        // Main Heading: "দুর্গাপূজার" (Huge Calligraphic with rich glow)
        ctx.save();
        ctx.font = '900 115px "Noto Serif Bengali", Georgia, serif';
        ctx.fillStyle = headingColor;
        ctx.textAlign = "center";
        if (activeTheme.darkTheme) {
          ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
          ctx.shadowBlur = 24;
          ctx.shadowOffsetY = 2;
        } else {
          ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
          ctx.shadowBlur = 15;
          ctx.shadowOffsetY = 4;
        }
        ctx.fillText(headingMain, centerX, 365);
        ctx.restore();

        // Heading Suffix: "শুভেচ্ছা"
        ctx.save();
        ctx.font = '700 76px "Noto Serif Bengali", Georgia, serif';
        ctx.fillStyle = headingColor;
        ctx.textAlign = "center";
        if (activeTheme.darkTheme) {
          ctx.shadowColor = "rgba(255, 215, 0, 0.7)";
          ctx.shadowBlur = 18;
        } else {
          ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
          ctx.shadowBlur = 12;
        }
        ctx.fillText(headingSuffix, centerX, 465);
        ctx.restore();

        // Divider: "🪷 ❖ 🪷"
        ctx.save();
        ctx.font = '34px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = activeTheme.ornamentColor;
        ctx.textAlign = "center";
        ctx.fillText("🪷   ❖   🪷", centerX, 540);
        ctx.restore();

        // Blessing Paragraph
        ctx.save();
        ctx.font = '500 29px "Noto Sans Bengali", sans-serif';
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.shadowColor = activeTheme.darkTheme ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 6;
        const maxTextWidth = 740;
        const lineHeight = 44;
        const words = blessingMessage.split(" ");
        let line = "";
        let currentY = 610;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && n > 0) {
            ctx.fillText(line, centerX, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, centerX, currentY);
        ctx.restore();

        // Closing Tagline: "শুভ শারদীয় দুর্গোৎসব!"
        ctx.save();
        ctx.font = 'bold 38px "Noto Serif Bengali", serif';
        ctx.fillStyle = headingColor;
        ctx.textAlign = "center";
        ctx.shadowColor = activeTheme.darkTheme ? "rgba(255, 215, 0, 0.6)" : "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 10;
        ctx.fillText(closingTag, centerX, currentY + 70);
        ctx.restore();

        // Sender Name: "— ধনঞ্জয় চন্দ্র দাস"
        ctx.save();
        ctx.font = 'bold 48px "Noto Serif Bengali", serif';
        ctx.fillStyle = senderColor;
        ctx.textAlign = "center";
        ctx.shadowColor = activeTheme.darkTheme ? "rgba(0, 0, 0, 0.9)" : "rgba(255,255,255,0.9)";
        ctx.shadowBlur = 8;
        ctx.fillText(`— ${userName}`, centerX, currentY + 145);
        ctx.restore();

        // Location: "📍 শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা"
        if (userLocation) {
          drawLocationBadge(`📍 ${userLocation} · শারদীয়া ১৪৩৩`, centerX, currentY + 205, 28, activeTheme.darkTheme);
        }
      }

      // 4. Download high-res PNG image
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }
        const link = document.createElement("a");
        link.download = `durga-puja-poster-${userName.replace(/\s+/g, "-")}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        setIsExporting(false);

        fetch("/api/card-downloads", { method: "POST" })
          .then((response) => response.json())
          .then((result) => {
            if (result.success && typeof result.count === "number") {
              window.dispatchEvent(new CustomEvent("card-download-count-updated", { detail: result.count }));
            }
          })
          .catch((error) => console.warn("Could not update card download count:", error));
      }, "image/png");
    } catch (err) {
      console.error("Export error", err);
      setIsExporting(false);
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `🌸 ${headingPrefix} ${headingMain} ${headingSuffix} 🌸\n\n"${blessingMessage}"\n\n${closingTag}\n— ${userName}\n📍 ${userLocation}\n\nআপনার ছবি ও নাম দিয়ে এই নিখুঁত পুজো পোস্টার ব্যানার তৈরি করতে ভিজিট করুন শারদীয়া অ্যাপে! 🪔✨`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="card-editor-container banner-mode-container">
      {/* Top Banner Bar */}
      <div className="editor-format-bar">
        <div className="format-pills">
          <span className="banner-format-indicator">
            <Sparkles size={16} />
            <strong>১০০% আসল পোস্টার জেনারেটর (৩:২ ল্যান্ডস্কেপ · ২× আল্ট্রা HD)</strong>
          </span>

          {/* Mode Switcher for Masterpiece Theme */}
          {activeTheme.isMasterpiece && (
            <div className="calligraphy-mode-switch-group">
              <button
                type="button"
                className={`cal-mode-btn ${!isCustomTextMode ? "active" : ""}`}
                onClick={() => setIsCustomTextMode(false)}
                title="আসল ৩ডি ক্যালিগ্রাফি আর্টওয়ার্ক চালু রাখুন"
              >
                <BookmarkCheck size={14} />
                <span>মূল ক্যালিগ্রাফি (আসল ডিজাইন)</span>
              </button>
              <button
                type="button"
                className={`cal-mode-btn ${isCustomTextMode ? "active" : ""}`}
                onClick={() => setIsCustomTextMode(true)}
                title="নিজের লেখা কাস্টমাইজ করুন"
              >
                <Edit3 size={14} />
                <span>নিজস্ব লেখা এডিট (কাস্টম মোড)</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Main Studio Grid */}
      <div className="editor-studio-grid">
        {/* Left Side: Step-by-Step Control Panel */}
        <div className="studio-control-panel">
          <div className="studio-tab-bar">
            <button
              className={`studio-tab ${editorTab === "quick" ? "active" : ""}`}
              onClick={() => setEditorTab("quick")}
            >
              <Sparkles size={16} />
              <span>সহজ ৩ পদক্ষেপ</span>
            </button>
            <button
              className={`studio-tab ${editorTab === "themes" ? "active" : ""}`}
              onClick={() => setEditorTab("themes")}
            >
              <Palette size={16} />
              <span>৪টি থিম</span>
            </button>
            <button
              className={`studio-tab ${editorTab === "text" ? "active" : ""}`}
              onClick={() => setEditorTab("text")}
            >
              <Type size={16} />
              <span>লেখা এডিট</span>
            </button>
            <button
              className={`studio-tab ${editorTab === "colors" ? "active" : ""}`}
              onClick={() => setEditorTab("colors")}
            >
              <Sliders size={16} />
              <span>রঙ বদল</span>
            </button>
          </div>

          <div className="panel-inner-content">
            {/* TAB 1: QUICK 3-STEP GENERATOR */}
            {editorTab === "quick" && (
              <div className="quick-guided-flow">
                {/* Background-Free Guidance Banner */}
                <div className="bg-advice-box">
                  <div className="advice-header">
                    <Info size={16} className="advice-icon" />
                    <strong>রেফারেন্স কার্ডের মতো ১০০% পারফেক্ট লুক</strong>
                  </div>
                  <p>
                    ছবিটি পোস্টারের বামে নিখুঁতভাবে বসবে। <strong>ব্যাকগ্রাউন্ড ছাড়া ছবি (PNG)</strong> হলে সবচেয়ে আসল পোস্টারের মতো দেখাবে! সাধারণ ছবি হলে নিচে গোল বা পোর্ট্রেট ফ্রেম বেছে নিন।
                  </p>
                </div>

                {/* STEP 1: Name & Location */}
                <div className="guided-step-block">
                  <span className="step-tag">পদক্ষেপ ১</span>
                  <label className="step-title">আপনার নাম ও মণ্ডপের ঠিকানা</label>

                  <div className="input-group">
                    <label className="field-label" htmlFor="quick-sender-name">
                      পোস্টারে যে নাম দেখাবে:
                    </label>
                    <input
                      id="quick-sender-name"
                      type="text"
                      autoComplete="name"
                      placeholder="আপনার নাম লিখুন (যেমন: ধনঞ্জয় চন্দ্র দাস)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="field-label" htmlFor="quick-venue-location">
                      পূজা মণ্ডপ বা জেলার নাম:
                    </label>
                    <input
                      id="quick-venue-location"
                      type="text"
                      placeholder="স্থান বা মণ্ডপ (যেমন: শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা)"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                    />
                  </div>

                  <div className="quick-venue-pills">
                    {[
                      "শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা",
                      "রমনা কালী মন্দির, ঢাকা",
                      "গুলশান-বনানী পূজা মণ্ডপ, ঢাকা",
                      "শাঁখারীবাজার, পুরান ঢাকা",
                      "জগন্নাথ হল, ঢাকা বিশ্ববিদ্যালয়",
                    ].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className="quick-loc-btn"
                        onClick={() => setUserLocation(loc)}
                      >
                        {loc.split(",")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="input-group tagline-select-group">
                    <label className="field-label" htmlFor="festival-tagline">
                      পোস্টারের পাতার পাশে উৎসবের ট্যাগলাইন:
                    </label>
                    <select
                      id="festival-tagline"
                      value={taglineText}
                      onChange={(e) => setTaglineText(e.target.value)}
                    >
                      <option value="">ট্যাগলাইন দেখাবেন না</option>
                      {festivalTaglines.map((tagline) => (
                        <option key={tagline} value={tagline}>{tagline}</option>
                      ))}
                    </select>
                    <small>কার্ডের ওপরের বাম পাশে ট্যাগলাইনে ক্লিক করেও বদলাতে পারবেন।</small>
                  </div>
                </div>

                {/* STEP 2: Photo Upload & Adjustment */}
                <div className="guided-step-block">
                  <span className="step-tag">পদক্ষেপ ২</span>
                  <label className="step-title">নিজের ছবি দিন (বামে সুন্দরভাবে বসবে)</label>

                  <input
                    ref={userPhotoInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUploadUserPhoto}
                  />

                  <div className="upload-buttons-row">
                    <button
                      className="upload-main-btn"
                      onClick={() => userPhotoInputRef.current?.click()}
                    >
                      <ImagePlus size={18} />
                      <span>{userPhotoUrl ? "ছবি পরিবর্তন করুন" : "নিজের ছবি আপলোড করুন"}</span>
                    </button>
                    {userPhotoUrl && (
                      <button className="remove-photo-btn" onClick={() => setUserPhotoUrl(null)}>
                        ছবি মুছুন
                      </button>
                    )}
                  </div>

                  {/* Frame Style Selector */}
                  <div className="photo-frame-selection-wrap">
                    <span style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "5px" }}>
                      ছবির ফ্রেম স্টাইল:
                    </span>
                    <div className="photo-frame-pills">
                      <button
                        type="button"
                        className={`frame-pill-btn ${photoFrameStyle === "cutout" ? "active" : ""}`}
                        onClick={() => setPhotoFrameStyle("cutout")}
                      >
                        কাটআউট (বর্ডারলেস)
                      </button>
                      <button
                        type="button"
                        className={`frame-pill-btn ${photoFrameStyle === "circle" ? "active" : ""}`}
                        onClick={() => setPhotoFrameStyle("circle")}
                      >
                        গোল্ডেন ওভাল
                      </button>
                      <button
                        type="button"
                        className={`frame-pill-btn ${photoFrameStyle === "rounded" ? "active" : ""}`}
                        onClick={() => setPhotoFrameStyle("rounded")}
                      >
                        পোর্ট্রেট বক্স
                      </button>
                    </div>
                  </div>

                  {userPhotoUrl && (
                    <div className="photo-fine-tune-box">
                      <div className="tune-label">
                        <span>ছবির সাইজ ও পজিশন অ্যাডজাস্ট করুন:</span>
                      </div>
                      <div className="tune-controls-grid">
                        <div className="tune-group">
                          <small>জুম:</small>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoScale((s) => Math.max(0.4, Number((s - 0.08).toFixed(2))))}
                            title="ছোট করুন"
                          >
                            <ZoomOut size={13} />
                          </button>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoScale((s) => Math.min(2.5, Number((s + 0.08).toFixed(2))))}
                            title="বড় করুন"
                          >
                            <ZoomIn size={13} />
                          </button>
                        </div>

                        <div className="tune-group">
                          <small>সরান:</small>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoOffsetX((x) => x - 8)}
                            title="বামে"
                          >
                            <ArrowLeft size={13} />
                          </button>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoOffsetX((x) => x + 8)}
                            title="ডানে"
                          >
                            <ArrowRight size={13} />
                          </button>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoOffsetY((y) => y - 8)}
                            title="উপরে"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            className="tune-btn"
                            onClick={() => setPhotoOffsetY((y) => y + 8)}
                            title="নিচে"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className={`tune-flip-btn ${photoFlipped ? "active" : ""}`}
                          onClick={() => setPhotoFlipped((f) => !f)}
                          title="ছবি উল্টান (Mirror)"
                        >
                          <RotateCw size={13} />
                          <span>ফ্লিপ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP 3: Pick 1 of 4 Themes */}
                <div className="guided-step-block">
                  <span className="step-tag">পদক্ষেপ ৩</span>
                  <label className="step-title">পছন্দের ব্যানার থিম (৪টি থিম)</label>

                  <div className="themes-mini-picker">
                    {bannerThemes.map((thm) => {
                      const isSel = activeTheme.id === thm.id;
                      return (
                        <button
                          key={thm.id}
                          className={`theme-mini-chip ${isSel ? "active" : ""}`}
                          onClick={() => handleSelectTheme(thm)}
                        >
                          <span
                            className="theme-mini-indicator"
                            style={{ background: thm.headingColor }}
                          />
                          <span>{thm.name.split("(")[0]}</span>
                          {isSel && <Check size={14} className="mini-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 4 THEMES SHOWCASE */}
            {editorTab === "themes" && (
              <div className="tab-pane-themes">
                <div className="panel-title-row">
                  <h4>৪টি প্রিমিয়াম বাস্তবসম্মত পোস্টার থিম</h4>
                  <small>ক্লিক করে সম্পূর্ণ ব্যাকগ্রাউন্ড, ফন্ট ও কালার প্যালেট পরিবর্তন করুন</small>
                </div>

                <div className="theme-select-list">
                  {bannerThemes.map((thm) => {
                    const isSelected = activeTheme.id === thm.id;
                    return (
                      <div
                        key={thm.id}
                        className={`theme-wide-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectTheme(thm)}
                      >
                        <div
                          className="theme-card-strip"
                          style={{ background: thm.headingColor }}
                        />
                        <div className="theme-card-details">
                          <div className="theme-card-top">
                            <strong>{thm.name}</strong>
                            <span className="thm-badge">{thm.badge}</span>
                          </div>
                          <p className="theme-card-sub">{thm.subtitle}</p>
                          <div className="theme-color-dots">
                            <span style={{ background: thm.headingColor }} />
                            <span style={{ background: thm.ornamentColor }} />
                          </div>
                        </div>
                        {isSelected && <div className="selected-check"><Check size={14} /></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: EDIT TEXTS (NOW FULLY OPEN FOR MASTER THEME TOO!) */}
            {editorTab === "text" && (
              <div className="tab-pane-text">
                <div className="panel-title-row">
                  <h4>ব্যানারের সকল টেক্সট এডিট করুন</h4>
                  <small>
                    {activeTheme.isMasterpiece
                      ? "মাস্টার থিমের যেকোনো লেখা পরিবর্তন করলে তা স্বয়ংক্রিয়ভাবে ব্যানারে বসে যাবে।"
                      : "আপনার পছন্দমতো শিরোনাম, উক্তি ও আশীর্বাদ বার্তা পরিবর্তন করুন।"}
                  </small>
                </div>

                {activeTheme.isMasterpiece && (
                  <div className="text-mode-indicator-box">
                    <span>বর্তমানে চালু: <strong>{isCustomTextMode ? "✏️ নিজস্ব লেখা মোড" : "✓ মূল ক্যালিগ্রাফি মোড"}</strong></span>
                    <button 
                      type="button" 
                      className="reset-to-cal-btn"
                      onClick={() => setIsCustomTextMode(!isCustomTextMode)}
                    >
                      {isCustomTextMode ? "মূল ক্যালিগ্রাফি দেখুন" : "কাস্টম মোড চালু করুন"}
                    </button>
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="custom-sender-name">আপনার নাম (প্রেরক)</label>
                  <input
                    id="custom-sender-name"
                    type="text"
                    autoComplete="name"
                    placeholder="যেমন: ধনঞ্জয় চন্দ্র দাস"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-venue-location">স্থান বা মণ্ডপের নাম</label>
                  <input
                    id="custom-venue-location"
                    type="text"
                    placeholder="যেমন: শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-quote">উপরের অনুপ্রেরণামূলক উক্তি</label>
                  <textarea
                    id="custom-quote"
                    rows={2}
                    placeholder="যেমন: শরতের আলোয় ভরে উঠুক সবার জীবন"
                    value={quoteText}
                    onChange={(e) => handleTextChange(() => setQuoteText(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-heading-prefix">শিরোনামের শুরুর অংশ</label>
                  <input
                    id="custom-heading-prefix"
                    type="text"
                    placeholder="যেমন: এই পুজোয়,"
                    value={headingPrefix}
                    onChange={(e) => handleTextChange(() => setHeadingPrefix(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-heading-main">প্রধান উৎসবের শিরোনাম</label>
                  <input
                    id="custom-heading-main"
                    type="text"
                    placeholder="যেমন: দুর্গোৎসব"
                    value={headingMain}
                    onChange={(e) => handleTextChange(() => setHeadingMain(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-heading-suffix">শিরোনামের শেষের অংশ</label>
                  <input
                    id="custom-heading-suffix"
                    type="text"
                    placeholder="যেমন: মনটা বাড়ি ফেরে।"
                    value={headingSuffix}
                    onChange={(e) => handleTextChange(() => setHeadingSuffix(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-blessing-message">আশীর্বাদ ও শুভেচ্ছা বার্তা</label>
                  <textarea
                    id="custom-blessing-message"
                    rows={3}
                    placeholder="আপনার নিজের শুভেচ্ছা বার্তা লিখুন"
                    value={blessingMessage}
                    onChange={(e) => handleTextChange(() => setBlessingMessage(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="custom-closing-tag">সমাপনী বার্তা</label>
                  <input
                    id="custom-closing-tag"
                    type="text"
                    placeholder="যেমন: শুভ শারদীয়া"
                    value={closingTag}
                    onChange={(e) => handleTextChange(() => setClosingTag(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: EDIT TEXT COLORS */}
            {editorTab === "colors" && (
              <div className="tab-pane-colors">
                <div className="panel-title-row">
                  <h4>নাম ও টেক্সটের রঙ পরিবর্তন</h4>
                  <small>ব্যানারের ব্যাকগ্রাউন্ডের সাথে মিলিয়ে রঙ বেছে নিন</small>
                </div>

                <div className="color-control-block">
                  <label>প্রেরকের নামের রঙ (Sender Name Color)</label>
                  <div className="color-palette-presets">
                    {["#ffd700", "#b81414", "#8b0000", "#8c5b16", "#221612", "#ffffff"].map(
                      (c) => (
                        <button
                          key={c}
                          className={`color-dot-btn ${senderColor === c ? "active" : ""}`}
                          style={{ background: c }}
                          onClick={() => setSenderColor(c)}
                        />
                      )
                    )}
                    <input
                      type="color"
                      value={senderColor}
                      onChange={(e) => setSenderColor(e.target.value)}
                      className="custom-color-wheel"
                    />
                  </div>
                </div>

                <div className="color-control-block">
                  <label>প্রধান শিরোনামের রঙ (Heading Color)</label>
                  <div className="color-palette-presets">
                    {["#ffd700", "#b81414", "#c62828", "#9e2a14", "#ffffff", "#ffcc00"].map(
                      (c) => (
                        <button
                          key={c}
                          className={`color-dot-btn ${headingColor === c ? "active" : ""}`}
                          style={{ background: c }}
                          onClick={() => {
                            setHeadingColor(c);
                            if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                          }}
                        />
                      )
                    )}
                    <input
                      type="color"
                      value={headingColor}
                      onChange={(e) => {
                        setHeadingColor(e.target.value);
                        if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                      }}
                      className="custom-color-wheel"
                    />
                  </div>
                </div>

                <div className="color-control-block">
                  <label>বার্তা ও লেখার রঙ (Body Text Color)</label>
                  <div className="color-palette-presets">
                    {["#fff4dd", "#ffffff", "#261a10", "#1a2530", "#380d0d"].map((c) => (
                      <button
                        key={c}
                        className={`color-dot-btn ${textColor === c ? "active" : ""}`}
                        style={{ background: c }}
                        onClick={() => {
                          setTextColor(c);
                          if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => {
                        setTextColor(e.target.value);
                        if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                      }}
                      className="custom-color-wheel"
                    />
                  </div>
                </div>

                <div className="color-control-block">
                  <label>উক্তির রঙ (Quote Color)</label>
                  <div className="color-palette-presets">
                    {["#fff8e7", "#ffffff", "#3d2b1b", "#0f2e4d", "#ffd700"].map((c) => (
                      <button
                        key={c}
                        className={`color-dot-btn ${quoteColor === c ? "active" : ""}`}
                        style={{ background: c }}
                        onClick={() => {
                          setQuoteColor(c);
                          if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={quoteColor}
                      onChange={(e) => {
                        setQuoteColor(e.target.value);
                        if (activeTheme.isMasterpiece) setIsCustomTextMode(true);
                      }}
                      className="custom-color-wheel"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: 100% WYSIWYG Poster Stage */}
        <div className="studio-canvas-stage">
          <div className="canvas-header-tools">
            <div className="active-template-badge">
              <span>সক্রিয় ব্যানার:</span>
              <strong>{activeTheme.name.split("(")[0]}</strong>
              {activeTheme.isMasterpiece && (
                <span className="cal-status-badge">
                  {isCustomTextMode ? "✏️ কাস্টম লেখা" : "✓ আসল ক্যালিগ্রাফি"}
                </span>
              )}
            </div>

            <div className="selection-tool-group">
              <button
                className="tool-action-btn"
                onClick={handleResetPhoto}
                title="ছবির পজিশন ও সাইজ রিসেট করুন"
              >
                <RotateCcw size={14} />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          <div className="canvas-viewport poster-viewport-area">
            {/* Realtime 100% WYSIWYG Poster Frame */}
            <div ref={previewCardRef} className="live-photorealistic-poster">
              {/* 1. Background Image (Always fills 100% in 3:2 ratio) */}
              <img
                src={currentBgImage}
                alt="দুর্গাপূজার পোস্টার ব্যাকগ্রাউন্ড"
                className="poster-bg-img"
              />

              <button
                type="button"
                className={`poster-tagline-overlay ${taglineText ? "" : "is-empty"}`}
                onClick={cycleFestivalTagline}
                aria-label="উৎসবের ট্যাগলাইন বদলান"
                title="পরের উৎসবের ট্যাগলাইন দেখতে ক্লিক করুন"
              >
                {taglineText || "+ উৎসবের শুভেচ্ছা যোগ করুন"}
              </button>

              {/* 2. User's Cutout Photo on the Left */}
              <div className="poster-user-photo-slot">
                {userPhotoUrl ? (
                  <div 
                    className={`poster-photo-wrapper frame-style-${photoFrameStyle}`}
                    style={{
                      transform: `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoScale}) ${
                        photoFlipped ? "scaleX(-1)" : ""
                      }`,
                    }}
                  >
                    <img
                      src={userPhotoUrl}
                      alt="আপনার ছবি"
                      className="poster-user-photo-img"
                    />
                  </div>
                ) : (
                  <div
                    className="poster-empty-photo-placeholder"
                    onClick={() => userPhotoInputRef.current?.click()}
                  >
                    <div className="placeholder-inner">
                      <ImagePlus size={32} />
                      <strong>আপনার ছবি এখানে বসবে</strong>
                      <small>ক্লিক করে নিজের ছবি আপলোড করুন</small>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Central Typography */}
              {activeTheme.isMasterpiece && !isCustomTextMode ? (
                /* In Original Calligraphy Mode: The 3D calligraphy and blessings are in the image. Overlay Name & Location */
                <div className="poster-name-overlay">
                  <p className="poster-name-text" style={{ color: senderColor }}>
                    — {userName}
                  </p>
                  <div className="poster-flourish-line">
                    ❖ ────── 🪷 ────── ❖
                  </div>
                  {userLocation && (
                    <span className="poster-location-text">
                      📍 {userLocation} · শারদীয়া ১৪৩৩
                    </span>
                  )}
                </div>
              ) : (
                /* In Custom Mode (and for themes 2, 3, 4): Render full responsive typography with background-matched vignette aura */
                <div className={`poster-center-content ${activeTheme.darkTheme ? "theme-dark" : "theme-light"}`}>
                  <p className="poster-top-quote" style={{ color: quoteColor }}>
                    {quoteText}
                  </p>

                  <div className="poster-heading-group">
                    <span className="poster-heading-prefix" style={{ color: textColor }}>
                      {headingPrefix}
                    </span>
                    <h2 
                      className="poster-heading-main" 
                      style={{ 
                        color: headingColor,
                        textShadow: activeTheme.darkTheme 
                          ? "0 0 16px rgba(255, 215, 0, 0.75), 0 2px 4px rgba(0,0,0,0.8)" 
                          : "0 1px 3px rgba(255, 255, 255, 0.95)"
                      }}
                    >
                      {headingMain}
                      <span className="poster-hibiscus-accent">🌺</span>
                    </h2>
                    <span className="poster-heading-suffix" style={{ color: headingColor }}>
                      {headingSuffix}
                    </span>
                  </div>

                  <div className="poster-lotus-divider" style={{ color: activeTheme.ornamentColor }}>
                    🪷  ❖  🪷
                  </div>

                  <p className="poster-blessing-message" style={{ color: textColor }}>
                    {blessingMessage}
                  </p>

                  <h4 className="poster-closing-tag" style={{ color: headingColor }}>
                    {closingTag}
                  </h4>

                  <p className="poster-sender-name" style={{ color: senderColor }}>
                    — {userName}
                  </p>

                  {userLocation && (
                    <span className="poster-location-tag" style={{ color: activeTheme.darkTheme ? "#ffd700" : "#5c4738" }}>
                      📍 {userLocation} · শারদীয়া ১৪৩৩
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="canvas-bottom-bar">
            <p className="privacy-badge">
              <HeartHandshake size={14} /> আপনার ছবি সম্পূর্ণ নিরাপদ—ডিভাইসের বাইরে কোথাও যায় না।
            </p>
            <div className="canvas-interaction-hint" style={{ fontSize: "11.5px", color: "#666" }}>
              💡 ৩টি সহজ ধাপ: ১. নাম ও স্থান লিখুন → ২. নিজের ছবি দিন → ৩. ২× HD ব্যানার ডাউনলোড করুন!
            </div>
          </div>
        </div>
      </div>
      <div className="export-actions-wrap editor-bottom-actions">
        <button className="whatsapp-share-btn" onClick={handleWhatsAppShare} title="WhatsApp এ পাঠান">
          <Share2 size={16} />
          <span>WhatsApp-এ পাঠান</span>
        </button>
        <button className="export-hd-btn" onClick={handleDownloadHd} disabled={isExporting}>
          <Download size={16} />
          <span>{isExporting ? "পোস্টার তৈরি হচ্ছে..." : "২× HD ব্যানার ডাউনলোড করুন"}</span>
        </button>
      </div>
    </div>
  );
}
