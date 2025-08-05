import { RowData } from "./row-data";

export interface WidgetItem {
  title?: string;
  title_en?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  link?: string;
  image?: number;
  image_info?: {
    id: number;
    url: string;
    description: string;
    name: string;
  };
  priority?: number;
}

export interface WidgetMainItem extends WidgetItem {
  template_coding?: string;
}

export interface Widget extends RowData {
  id: number;
  title?: string;
  title_en?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  link?: string;
  priority?: number;
  image?: number;
  template_coding?: string;
  image_info?: {
    id: number;
    url: string;
    description: string;
    name: string;
  };
  items: WidgetItem[];
  created_at: string;
  status: "active" | "deactive";
}

export interface WidgetTemplate {
  coding: string;
  title: string;
  title_en?: string;
  title_ar?: string;
  template: string;
  method: string;
  fields: {
    main: string[];
    items: string[];
  };
  main: WidgetMainItem[];
  items: WidgetItem[];
}
