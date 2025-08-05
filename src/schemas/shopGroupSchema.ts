import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getShopGroupFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    description: z.string().optional(),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    meta: z.array(
      z.object({
        name: z.string().min(1, {
          message: dictionary.forms.name + " " + dictionary.errors.required,
        }),
        title: z.string().min(1, {
          message: dictionary.forms.title + " " + dictionary.errors.required,
        }),
        title_en: z.string().optional(),
        title_ar: z.string().optional(),
        description: z.string().optional(),
        en_description: z.string().optional(),
        ar_description: z.string().optional(),
        priority: z.number().min(1, {
          message: dictionary.forms.priority + " " + dictionary.errors.required,
        }),
      })
    ),
  });

export type ShopGroupFormData = z.infer<
  ReturnType<typeof getShopGroupFormSchema>
>;
