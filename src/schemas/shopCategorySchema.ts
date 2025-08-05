import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getShopCategoryFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description: z.string().optional(),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    parent_id: z.coerce.number().nullable().optional(),
    level: z.coerce.number().nullable().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    meta_keywords: z.string().optional(),
    meta_link_canonical: z.string().optional(),
    meta_title_en: z.string().optional(),
    meta_title_ar: z.string().optional(),
    meta_description_en: z.string().optional(),
    meta_description_ar: z.string().optional(),
    meta_keywords_en: z.string().optional(),
    meta_keywords_ar: z.string().optional(),
    meta_link_canonical_en: z.string().optional(),
    meta_link_canonical_ar: z.string().optional(),
    created_at: z.string().optional(),
  });

export type ShopCategoryFormData = z.infer<
  ReturnType<typeof getShopCategoryFormSchema>
>;
