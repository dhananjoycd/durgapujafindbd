export type BannerTheme = {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  bgImage: string;
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

export type PujaVenue = {
  id: string;
  name: string;
  zone: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  theme: string;
  highlights: string[];
  anjaliTime: string;
  aartiTime: string;
  sandhiPujaTime: string;
  crowdStatus: "low" | "moderate" | "heavy";
  crowdUpdatedAt: string;
  crowdReportsCount: number;
  isIconic?: boolean;
  verified: boolean;
  mapLink: string;
  tags: string[];
  addedBy?: string;
  addedAt?: string;
  realVotes?: number;
  fakeVotes?: number;
};

export type DurgaIdolOption = {
  id: string;
  name: string;
  bengaliName: string;
  svg: string;
};

export type StickerItem = {
  id: string;
  name: string;
  category: "motifs" | "rituals" | "flowers" | "alpana";
  svg: string;
};

export type AIFilterPreset = {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  brightness: number;
  contrast: number;
  saturate: number;
  sepia: number;
  hueRotate: number;
  warmth: string;
};
