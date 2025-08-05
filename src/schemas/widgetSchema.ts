import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getWidgetFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    title_en: z.string().optional(),
    subtitle_en: z.string().optional(),
    description_en: z.string().optional(),
    title_ar: z.string().optional(),
    subtitle_ar: z.string().optional(),
    description_ar: z.string().optional(),
    image: z.number().nullable().optional(),
    link: z.string().optional(),
    template_coding: z.string(),
    status: z.enum(["active", "deactive"], {
      required_error:
        dictionary.forms.status + " " + dictionary.errors.required,
    }),
    items: z.array(
      z.object({
        title: z.string().optional(),
        title_en: z.string().optional(),
        title_ar: z.string().optional(),
        subtitle: z.string().optional(),
        subtitle_en: z.string().optional(),
        subtitle_ar: z.string().optional(),
        description: z.string().optional(),
        description_en: z.string().optional(),
        description_ar: z.string().optional(),
        image: z.number().nullable().optional(),
        link: z.string().optional(),
        priority: z.number().optional(),
      })
    ),
  });

export type WidgetFormData = z.infer<ReturnType<typeof getWidgetFormSchema>>;
