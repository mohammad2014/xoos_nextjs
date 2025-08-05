import { RowData } from "./row-data";

export interface Social extends RowData {
  id: number;
  type: (typeof SOCIAL_TYPES)[number];
  link: string;
  title: string;
  title_en: string;
  title_ar: string;
  priority: string;
  status: "active" | "deactive";

  updated_at?: string;
}

export const SOCIAL_TYPES = [
  "instagram",
  "youtube",
  "x",
  "linkedin",
  "facebook",
  "telegram",
  "pinterest",
  "tiktok",
  "whatsapp",
  "aparat",
  "bale",
  "eitaa",
  "rubika",
  "soroush_plus",
] as const;
