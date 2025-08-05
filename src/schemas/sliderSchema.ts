import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getSliderFormSchema = (dictionary: Dictionary) => {
  return z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    title_en: z.string().optional(),
    description_en: z.string().optional(),
    title_ar: z.string().optional(),
    description_ar: z.string().optional(),
    name: z.string().min(1, {
      message: dictionary.forms.name + " " + dictionary.errors.required,
    }),
    items: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        title_en: z.string().optional(),
        description_en: z.string().optional(),
        title_ar: z.string().optional(),
        description_ar: z.string().optional(),
        link: z.string().optional(),
        image: z.number().min(1, {
          message: dictionary.forms.image + " " + dictionary.errors.required,
        }),
        priority: z.number(),
      })
    ),
  });
};

export type SliderFormData = z.infer<ReturnType<typeof getSliderFormSchema>>;
