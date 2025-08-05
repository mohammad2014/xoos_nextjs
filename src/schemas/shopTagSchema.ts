import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getShopTagFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    description: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
    meta_link_canonical: z.string().optional(),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
  });

export type ShopTagFormData = z.infer<ReturnType<typeof getShopTagFormSchema>>;
