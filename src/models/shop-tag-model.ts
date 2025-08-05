import { RowData } from "./row-data";

export interface ShopTag extends RowData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_link_canonical?: string;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
}
