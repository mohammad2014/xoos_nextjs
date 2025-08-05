import { RowData } from "./row-data";

export interface ShopGroupMeta {
  name: string;
  title: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  en_description?: string;
  ar_description?: string;
  priority: number;
}

export interface ShopGroup extends RowData {
  id: number;
  title: string;
  slug: string;
  description?: string;
  meta: ShopGroupMeta[];
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
}
