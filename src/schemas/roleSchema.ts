import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getRoleFormSchema = (dictionary: Dictionary) => {
  return z.object({
    name: z
      .string()
      .min(1, {
        message: dictionary.forms.name + " " + dictionary.errors.required,
      })
      .regex(/^[A-Za-z0-9_-]+$/, {
        message: dictionary.errors.name,
      }),
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    level: z.number({
      message: dictionary.forms.level + " " + dictionary.errors.required,
    }),
    systemic: z.enum(["yes", "no"], {
      message: dictionary.forms.systemic + " " + dictionary.errors.required,
    }),
    description: z.string().optional(),
  });
};

export type RoleFormData = z.infer<ReturnType<typeof getRoleFormSchema>>;
