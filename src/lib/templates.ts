export type BannerTheme = {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  bgImage: string;
  cleanBgImage?: string;
  isMasterpiece?: boolean;
  darkTheme?: boolean;
  headingColor: string;
  quoteColor: string;
  textColor: string;
  senderColor: string;
  ornamentColor: string;
  quote: string;
  headingPrefix: string;
  headingMain: string;
  headingSuffix: string;
  message: string;
  closingTag: string;
  defaultSender: string;
  defaultLocation: string;
};

export const bannerThemes: BannerTheme[] = [
  {
    id: "golden-morning",
    name: "১০০% আসল মাস্টারপিস ব্যানার (সোনালী মন্দির ও মা দুর্গা)",
    subtitle: "হুবহু রেফারেন্স পোস্টার: মা দুর্গা, স্বর্ণালী মন্দির, ঢাক, প্রদীপ ও রক্তিম জবা",
    badge: "১০০% অরিজিনাল",
    isMasterpiece: true,
    bgImage: "/themes/durga-master-template.jpg",
    cleanBgImage: "/themes/durga-master-clean-bg.jpg",
    headingColor: "#b81414",
    quoteColor: "#3d2b1b",
    textColor: "#261a10",
    senderColor: "#221612",
    ornamentColor: "#d4af37",
    quote: "“দুর্গা মানে শক্তি, দুর্গা মানে সাহস, দুর্গা মানে নতুন করে শুরু করার অনুপ্রেরণা।”",
    headingPrefix: "শারদীয়",
    headingMain: "দুর্গাপূজার",
    headingSuffix: "শুভেচ্ছা",
    message: "মা দুর্গার আগমনে জীবনের প্রতিটি পদক্ষেপে আসুক শান্তি, সমৃদ্ধি ও নতুন আশার আলো। সকলের জীবনে বিরাজ করুক সুখ, ভালোবাসা ও অমঙ্গল নাশের শক্তি।",
    closingTag: "শুভ শারদীয় দুর্গোৎসব!",
    defaultSender: "— ধনঞ্জয় চন্দ্র দাস",
    defaultLocation: "শ্রী শ্রী ঢাকেশ্বরী জাতীয় মন্দির, ঢাকা",
  },
  {
    id: "royal-crimson",
    name: "রাজকীয় রক্তিম সিঁদুর বরণ",
    subtitle: "রাজপ্রাসাদ তোরণ, ঝুলন্ত গাঁদা ফুলের মালা, ১০৮ পদ্ম ও প্রদীপ",
    badge: "রাজকীয় সোনালী",
    darkTheme: true,
    bgImage: "/themes/royal-crimson-bg.jpg",
    headingColor: "#ffd700",
    quoteColor: "#fff8e7",
    textColor: "#fff4dd",
    senderColor: "#ffd700",
    ornamentColor: "#ffcc00",
    quote: "“অশুভ শক্তির বিনাশ ঘটিয়ে ধরাধামে আসুক সত্য, ন্যায় ও পরম শান্তির পুণ্য বারতা।”",
    headingPrefix: "মহাঅষ্টমীর",
    headingMain: "সন্ধিপূজার",
    headingSuffix: "আন্তরিক প্রীতি ও শুভেচ্ছা",
    message: "১০৮ পদ্মের পুণ্য অর্ঘ্যে মা দূর করুন আমাদের অন্তরের সকল অন্ধকার। আপনার ও আপনার পরিবারের সকলের জীবন ভরে উঠুক অপার সৌভাগ্য ও নিরাপত্তায়।",
    closingTag: "আসছে বছর আবার হবে!",
    defaultSender: "— সৌম্য ও প্রিয়ন্তী",
    defaultLocation: "রমনা কালী মন্দির প্রাঙ্গণ, ঢাকা",
  },
  {
    id: "kashful-blue",
    name: "শরতের নীল আকাশ ও কাশবন",
    subtitle: "শান্ত শুভ্র কাশবন, নীল আকাশ, মঙ্গল শঙ্খ ও শিশিরভেজা সকাল",
    badge: "শারদ প্রকৃতি",
    bgImage: "/themes/kashful-blue-bg.jpg",
    headingColor: "#c62828",
    quoteColor: "#0f2e4d",
    textColor: "#1a2530",
    senderColor: "#b71c1c",
    ornamentColor: "#d4af37",
    quote: "“শিশিরভেজা শিউলির সুবাস আর কাশবনের শুভ্র দোলায় মা আসছেন আমাদের ঘরে।”",
    headingPrefix: "শারদ প্রভাতে",
    headingMain: "মা আসছেন",
    headingSuffix: "হৃদয়গ্রাহী অভিনন্দন",
    message: "ঢাকের মিষ্টি বোলে আকাশ-বাতাস মুখরিত। মায়ের অপার স্নেহ ও আশীর্বাদে কেটে যাক সকল হতাশা, নতুন ভোরে শুরু হোক আনন্দময় পথচলা।",
    closingTag: "শুভ দুর্গোৎসব ১৪৩৩!",
    defaultSender: "— অনির্বাণ ও পরিবার",
    defaultLocation: "গুলশান-বনানী পূজা মণ্ডপ, ঢাকা",
  },
  {
    id: "vintage-terracotta",
    name: "সাবেকি ঠাকুরদালান ও ধুনুচি আরতি",
    subtitle: "টেরাকোটা মন্দির, ধুনুচির সুবাসিত ধোঁয়া, রঙ্গোলি ও সাবেকি রূপ",
    badge: "ঐতিহ্যবাহী",
    bgImage: "/themes/vintage-terracotta-bg.jpg",
    headingColor: "#9e2a14",
    quoteColor: "#3e2723",
    textColor: "#2b1b17",
    senderColor: "#801e0a",
    ornamentColor: "#cba258",
    quote: "“শঙ্খের ধ্বনি আর ঢাকের বাদ্যে দূর হোক অমঙ্গল, মানুষের হৃদয়ে জাগুক চিরন্তন সম্প্রীতি।”",
    headingPrefix: "ঐতিহ্যবাহী",
    headingMain: "শারদ উৎসবের",
    headingSuffix: "স্নেহ ও ভালোবাসা",
    message: "ধুনুচির সুবাসে আর মায়ের বরাভয় হাসিতে ভরে উঠুক প্রতিটি গৃহকোণ। বড়দের ভক্তিপূর্ণ প্রণাম আর ছোটদের অফুরন্ত ভালোবাসা রইলো।",
    closingTag: "শুভ শারদীয়া ও শুভ বিজয়া!",
    defaultSender: "— অর্ক ও অনিন্দিতা",
    defaultLocation: "শাঁখারীবাজার ঐতিহ্যবাহী পুজো, পুরান ঢাকা",
  },
];
