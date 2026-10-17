import { StickerItem } from "@/types/puja";

export const festiveStickers: StickerItem[] = [
  {
    id: "durga-eyes",
    name: "মায়ের ত্রিনয়ন ও ত্রিশূল",
    category: "motifs",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100" height="100" fill="none">
      <path d="M60 15 L60 105" stroke="#b22222" stroke-width="4" stroke-linecap="round"/>
      <path d="M42 32 Q60 55 78 32" stroke="#b22222" stroke-width="3" fill="none"/>
      <path d="M38 25 Q45 10 60 22 Q75 10 82 25" stroke="#b22222" stroke-width="3" fill="none"/>
      <!-- Third Eye -->
      <path d="M60 40 Q67 52 60 64 Q53 52 60 40 Z" fill="#b22222"/>
      <circle cx="60" cy="52" r="3" fill="#ffd700"/>
      <!-- Left Eye -->
      <path d="M22 65 Q42 50 56 68 Q38 82 22 65 Z" fill="#111" stroke="#b22222" stroke-width="1.5"/>
      <circle cx="40" cy="65" r="4" fill="#fff"/>
      <circle cx="39" cy="65" r="2" fill="#111"/>
      <path d="M20 62 Q38 46 56 62" stroke="#b22222" stroke-width="2.5" fill="none"/>
      <!-- Right Eye -->
      <path d="M98 65 Q78 50 64 68 Q82 82 98 65 Z" fill="#111" stroke="#b22222" stroke-width="1.5"/>
      <circle cx="80" cy="65" r="4" fill="#fff"/>
      <circle cx="81" cy="65" r="2" fill="#111"/>
      <path d="M100 62 Q82 46 64 62" stroke="#b22222" stroke-width="2.5" fill="none"/>
      <!-- Nose Ring -->
      <circle cx="56" cy="88" r="8" stroke="#d4af37" stroke-width="2" fill="none"/>
      <circle cx="50" cy="85" r="2" fill="#b22222"/>
    </svg>`
  },
  {
    id: "trishul",
    name: "সোনার ত্রিশূল",
    category: "motifs",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="90" height="110" fill="none">
      <path d="M50 10 L50 110" stroke="#d4af37" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M50 8 L54 22 L46 22 Z" fill="#b22222"/>
      <path d="M28 28 C28 50 48 56 50 56 C52 56 72 50 72 28 C64 42 54 44 50 44 C46 44 36 42 28 28 Z" fill="#d4af37" stroke="#b22222" stroke-width="1.5"/>
      <circle cx="50" cy="70" r="5" fill="#b22222"/>
      <circle cx="50" cy="85" r="4" fill="#d4af37"/>
    </svg>`
  },
  {
    id: "dhunuchi",
    name: "ধুনুচি ও ধোঁয়া",
    category: "rituals",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="90" height="110" fill="none">
      <!-- Smoke -->
      <path d="M42 30 Q35 18 48 10 Q60 5 50 2" stroke="#dcd6cd" stroke-width="2" stroke-linecap="round" stroke-dasharray="3,3" opacity="0.8"/>
      <path d="M58 32 Q68 20 58 12 Q50 6 62 2" stroke="#dcd6cd" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3,3" opacity="0.8"/>
      <!-- Fire spark -->
      <path d="M46 36 Q50 24 54 36 Z" fill="#ff7043"/>
      <path d="M48 37 Q50 28 52 37 Z" fill="#ffd54f"/>
      <!-- Dhunuchi Bowl -->
      <path d="M26 38 C28 64 42 68 46 72 L46 95 L36 104 L64 104 L54 95 L54 72 C58 68 72 64 74 38 Z" fill="#c46238" stroke="#8d381b" stroke-width="2"/>
      <!-- Rim -->
      <ellipse cx="50" cy="38" rx="24" ry="7" fill="#df784b" stroke="#8d381b" stroke-width="2"/>
      <!-- Texture -->
      <line x1="38" y1="52" x2="62" y2="52" stroke="#ffd54f" stroke-width="2"/>
      <line x1="42" y1="60" x2="58" y2="60" stroke="#ffd54f" stroke-width="1.5"/>
    </svg>`
  },
  {
    id: "dhak",
    name: "ঢাক ও কাঠি",
    category: "rituals",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" width="95" height="95" fill="none">
      <!-- Dhak Body -->
      <ellipse cx="55" cy="30" rx="36" ry="11" fill="#f5ecd8" stroke="#8c3e1e" stroke-width="2.5"/>
      <path d="M19 30 C22 68 34 82 55 82 C76 82 88 68 91 30" fill="#a0441d" stroke="#68240a" stroke-width="2.5"/>
      <ellipse cx="55" cy="80" rx="28" ry="8" fill="#5c2008"/>
      <!-- Straps / Feathers -->
      <path d="M19 30 L55 82 L91 30" stroke="#ffd54f" stroke-width="1.8"/>
      <path d="M35 34 L72 80 M75 34 L38 80" stroke="#fdfbf7" stroke-width="1.5"/>
      <!-- White feathers decoration -->
      <path d="M82 25 Q96 15 104 28 Q94 38 86 35" fill="#fdfbf7" opacity="0.9"/>
      <path d="M86 32 Q102 28 106 42 Q94 48 88 40" fill="#fdfbf7" opacity="0.9"/>
      <!-- Drum Sticks -->
      <line x1="14" y1="72" x2="38" y2="28" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/>
      <line x1="22" y1="80" x2="48" y2="34" stroke="#5d4037" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "shankha",
    name: "মঙ্গল শঙ্খ",
    category: "rituals",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="85" height="85" fill="none">
      <path d="M25 65 C16 48 24 25 45 18 C68 10 85 24 82 46 C80 62 64 78 48 84 C38 88 28 80 25 65 Z" fill="#fffdfa" stroke="#d4af37" stroke-width="2.5"/>
      <path d="M42 22 C56 22 72 32 70 50 C68 64 54 74 44 76" stroke="#b22222" stroke-width="2" fill="none"/>
      <path d="M48 30 C58 32 64 42 62 52 C60 60 52 66 45 67" stroke="#d4af37" stroke-width="1.5" fill="none"/>
      <!-- Red Kumkum dot -->
      <circle cx="52" cy="46" r="3.5" fill="#b22222"/>
    </svg>`
  },
  {
    id: "diya",
    name: "মঙ্গল প্রদীপ",
    category: "rituals",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="85" height="75" fill="none">
      <!-- Flame -->
      <path d="M50 12 C44 26 42 36 50 44 C58 36 56 26 50 12 Z" fill="#ff9100"/>
      <path d="M50 20 C46 29 46 36 50 40 C54 36 54 29 50 20 Z" fill="#fff176"/>
      <!-- Lamp base -->
      <ellipse cx="50" cy="54" rx="35" ry="12" fill="#d87a42" stroke="#8d3d19" stroke-width="2"/>
      <path d="M15 54 C18 74 40 78 50 78 C60 78 82 74 85 54 Z" fill="#b85924" stroke="#8d3d19" stroke-width="2"/>
      <!-- Stand -->
      <path d="M38 76 L32 84 L68 84 L62 76 Z" fill="#8d3d19"/>
    </svg>`
  },
  {
    id: "lotus",
    name: "১০৮ নীলপদ্ম / লালপদ্ম",
    category: "flowers",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90" width="85" height="75" fill="none">
      <!-- Back Petals -->
      <path d="M50 18 C40 32 40 54 50 62 C60 54 60 32 50 18 Z" fill="#e91e63"/>
      <path d="M34 26 C24 40 28 58 42 64 C42 48 38 34 34 26 Z" fill="#d81b60"/>
      <path d="M66 26 C76 40 72 58 58 64 C58 48 62 34 66 26 Z" fill="#d81b60"/>
      <!-- Side Outstretched -->
      <path d="M18 42 C12 56 22 70 38 68 C32 56 24 48 18 42 Z" fill="#c2185b"/>
      <path d="M82 42 C88 56 78 70 62 68 C68 56 76 48 82 42 Z" fill="#c2185b"/>
      <!-- Center foreground -->
      <path d="M42 42 C46 54 50 66 50 66 C50 66 54 54 58 42 C54 38 46 38 42 42 Z" fill="#f48fb1"/>
      <ellipse cx="50" cy="68" rx="8" ry="3" fill="#ffd54f"/>
    </svg>`
  },
  {
    id: "alpana-corner",
    name: "আলপনা কর্নার",
    category: "alpana",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="90" height="90" fill="none">
      <path d="M10 10 L85 10 C70 25 70 45 85 60 C55 60 40 45 40 10" stroke="#d4af37" stroke-width="2.5" fill="none"/>
      <path d="M10 10 L10 85 C25 70 45 70 60 85 C60 55 45 40 10 40" stroke="#d4af37" stroke-width="2.5" fill="none"/>
      <circle cx="22" cy="22" r="6" fill="#b22222"/>
      <circle cx="34" cy="34" r="4" fill="#d4af37"/>
      <path d="M12 12 Q50 50 88 88" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="2,3"/>
    </svg>`
  },
  {
    id: "shiuli-flower",
    name: "শিউলি ফুল",
    category: "flowers",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="75" height="75" fill="none">
      <!-- Petals -->
      <ellipse cx="45" cy="22" rx="9" ry="16" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <ellipse cx="45" cy="68" rx="9" ry="16" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <ellipse cx="22" cy="45" rx="16" ry="9" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <ellipse cx="68" cy="45" rx="16" ry="9" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <ellipse cx="29" cy="29" rx="14" ry="8" transform="rotate(-45 29 29)" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <ellipse cx="61" cy="29" rx="14" ry="8" transform="rotate(45 61 29)" fill="#fffef8" stroke="#e8e2d5" stroke-width="1"/>
      <!-- Orange center / stem tube -->
      <circle cx="45" cy="45" r="7" fill="#ff6f00"/>
      <circle cx="45" cy="45" r="3" fill="#e65100"/>
    </svg>`
  },
  {
    id: "kashful",
    name: "শুভ্র কাশফুল",
    category: "flowers",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120" width="75" height="100" fill="none">
      <path d="M35 115 Q45 65 52 10" stroke="#78909c" stroke-width="2" stroke-linecap="round"/>
      <!-- Feathers -->
      <path d="M52 15 Q68 18 64 28 Q52 24 50 20" fill="#f8fafc" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M50 24 Q32 26 36 38 Q48 32 49 28" fill="#f8fafc" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M49 32 Q66 36 62 48 Q49 42 47 38" fill="#f8fafc" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M47 42 Q30 46 34 58 Q46 52 46 48" fill="#f8fafc" stroke="#cfd8dc" stroke-width="1"/>
      <path d="M45 52 Q62 58 58 70 Q45 64 44 60" fill="#f8fafc" stroke="#cfd8dc" stroke-width="1"/>
    </svg>`
  }
];
