import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getPasswordFormSchema = (dictionary: Dictionary) => {
  console.log(dictionary.errors.required);

  return z
    .object({
      password: z
        .string()
        .min(8, { message: dictionary.errors.minLength }),
      password_confirmation: z
        .string()
        .min(8, { message: dictionary.errors.minLength }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: dictionary.errors.passwordsDoNotMatch,
      path: ["password_confirmation"], 
    });
};

export type PasswordFormData = z.infer<
  ReturnType<typeof getPasswordFormSchema>
>;
