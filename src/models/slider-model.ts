import { RowData } from "./row-data";

export interface SliderItem {
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
  coding: string;
  image: number | undefined;
  image_info?: {
    id: number;
    url: string;
    description: string;
    name: string;
  };
}

export interface Slider extends RowData {
  id: number;
  user_id: number;
  name: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  subtitle?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  systemic: string;

  updated_at?: string;
  items: SliderItem[];
}

export type ImageInfo = {
  id: number;
  url: string;
  description: string;
};

export type SliderItemFrom = {
  title: string;
  description?: string;
  coding: string;
  image: number;
  priority: number;
  image_info: ImageInfo;
  buttonContent?: string;
};
