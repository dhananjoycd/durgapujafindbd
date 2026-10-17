import { DurgaIdolOption } from "@/types/puja";

export const durgaIdolOptions: DurgaIdolOption[] = [
  {
    id: "durga-face-divine",
    name: "মায়ের স্নেহময়ী ত্রিনয়ন ও রূপ",
    bengaliName: "মায়ের মুখশ্রী",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="160" height="128" fill="none">
      <!-- Crown / Mukut -->
      <path d="M100 12 L118 45 L135 30 L130 65 L70 65 L65 30 L82 45 Z" fill="#ffd700" stroke="#d4af37" stroke-width="2"/>
      <circle cx="100" cy="28" r="6" fill="#b22222"/>
      <circle cx="82" cy="48" r="3" fill="#b22222"/>
      <circle cx="118" cy="48" r="3" fill="#b22222"/>
      <!-- Face Contour -->
      <path d="M70 65 Q100 70 130 65 Q135 110 100 135 Q65 110 70 65 Z" fill="#fff5ea" stroke="#d4af37" stroke-width="2"/>
      <!-- Third Eye (Trinayan) -->
      <path d="M100 72 Q107 82 100 92 Q93 82 100 72 Z" fill="#b22222"/>
      <circle cx="100" cy="82" r="2.5" fill="#ffd700"/>
      <!-- Eyebrows -->
      <path d="M72 88 Q85 76 96 87" stroke="#b22222" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M128 88 Q115 76 104 87" stroke="#b22222" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Left Eye -->
      <path d="M73 95 Q86 86 96 97 Q85 106 73 95 Z" fill="#111" stroke="#b22222" stroke-width="1.5"/>
      <circle cx="85" cy="95" r="3" fill="#fff"/>
      <circle cx="84" cy="95" r="1.5" fill="#111"/>
      <!-- Right Eye -->
      <path d="M127 95 Q114 86 104 97 Q115 106 127 95 Z" fill="#111" stroke="#b22222" stroke-width="1.5"/>
      <circle cx="115" cy="95" r="3" fill="#fff"/>
      <circle cx="116" cy="95" r="1.5" fill="#111"/>
      <!-- Nose & Nath (Nose Ring) -->
      <path d="M100 92 L100 110 L96 112" stroke="#b22222" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="94" cy="112" r="7" stroke="#d4af37" stroke-width="1.8" fill="none"/>
      <circle cx="88" cy="110" r="1.8" fill="#b22222"/>
      <!-- Lips -->
      <path d="M92 122 Q100 120 108 122 Q100 128 92 122 Z" fill="#c2185b"/>
    </svg>`,
  },
  {
    id: "durga-trishul-simhabahini",
    name: "সোনার ত্রিশূল ও সিংহবাহিনী",
    bengaliName: "সিংহবাহিনী",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="130" height="130" fill="none">
      <!-- Glow Aura -->
      <circle cx="80" cy="80" r="65" stroke="#ffd700" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6"/>
      <!-- Central Trishul -->
      <path d="M80 15 L80 145" stroke="#d4af37" stroke-width="5" stroke-linecap="round"/>
      <path d="M80 12 L85 30 L75 30 Z" fill="#b22222"/>
      <path d="M50 38 C50 68 76 75 80 75 C84 75 110 68 110 38 C100 56 86 58 80 58 C74 58 60 56 50 38 Z" fill="#ffd700" stroke="#b22222" stroke-width="2"/>
      <circle cx="80" cy="95" r="6" fill="#b22222"/>
      <circle cx="80" cy="115" r="5" fill="#d4af37"/>
      <!-- Lotus Base -->
      <path d="M60 140 C65 130 95 130 100 140 C95 148 65 148 60 140 Z" fill="#e91e63"/>
    </svg>`,
  },
  {
    id: "durga-ekchala-heritage",
    name: "ঐতিহ্যবাহী সাবেকি একচালা কাঠামো",
    bengaliName: "সাবেকি চালচিত্র",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="160" height="128" fill="none">
      <!-- Chalchitra Arc -->
      <path d="M20 145 C20 40 180 40 180 145" stroke="#b22222" stroke-width="8" stroke-linecap="round"/>
      <path d="M28 145 C28 50 172 50 172 145" stroke="#ffd700" stroke-width="3"/>
      <!-- Mini motifs on chalchitra -->
      <circle cx="100" cy="46" r="8" fill="#ffd700" stroke="#b22222" stroke-width="2"/>
      <circle cx="65" cy="62" r="6" fill="#b22222"/>
      <circle cx="135" cy="62" r="6" fill="#b22222"/>
      <circle cx="42" cy="95" r="5" fill="#ffd700"/>
      <circle cx="158" cy="95" r="5" fill="#ffd700"/>
      <!-- Idol Silhouette -->
      <path d="M85 75 Q100 70 115 75 Q125 115 100 135 Q75 115 85 75 Z" fill="#fffaf0" stroke="#d4af37" stroke-width="2"/>
      <circle cx="100" cy="92" r="5" fill="#b22222"/>
      <path d="M75 140 L125 140" stroke="#b22222" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "none",
    name: "কোনো প্রতিমা যুক্ত করব না",
    bengaliName: "বাদ দিন",
    svg: "",
  },
];
