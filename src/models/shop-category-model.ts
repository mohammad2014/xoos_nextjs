import { RowData } from "./row-data";

interface image {
  id: number;
  url: string;
  name: string;
  description: string;
}

export interface ShopCategory extends RowData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  parent_id: number | null;
  level: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_link_canonical?: string;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
  meta_link_canonical_en?: string;
  meta_link_canonical_ar?: string;
  created_at?: string;
  children?: ShopCategory[];
  images: image[];
}
