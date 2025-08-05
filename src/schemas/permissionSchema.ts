import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getPermissionFormSchema = (dictionary: Dictionary) => {
  console.log(dictionary.errors.required);

  return z.object({
    name: z.string().min(1, {
      message: dictionary.forms.name + " " + dictionary.errors.required,
    }),
    title: z.string().min(1, {
      message: dictionary.forms.title + " " + dictionary.errors.required,
    }),
    description: z.string().optional(),
  });
};

export type PermissionFormData = z.infer<
  ReturnType<typeof getPermissionFormSchema>
>;
