import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getMenuFormSchema = (dictionary: Dictionary) => {
  return z.object({
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    link: z.string().min(1),
    level: z.number(),
    image: z.number().optional(),
  });
};

export type MenuFormData = z.infer<ReturnType<typeof getMenuFormSchema>>;
