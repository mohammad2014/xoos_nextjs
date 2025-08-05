import { Dictionary } from "@/lib/dict";
import { SOCIAL_TYPES } from "@/models/social-model";
import { z } from "zod";

export const getSocialFormSchema = (dictionary: Dictionary) =>
  z.object({
    title: z.string().optional(),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    link: z
      .string()
      .url({ message: dictionary.errors.invalidUrl })
      .nonempty({ message: dictionary.errors.required }),
    type: z.enum(SOCIAL_TYPES, {
      errorMap: () => ({
        message: dictionary.errors.required,
      }),
    }),
    status: z.enum(["active", "deactive"], {
      errorMap: () => ({
        message: dictionary.errors.required,
      }),
    }),
  });

export type SocialFormData = z.infer<ReturnType<typeof getSocialFormSchema>>;
