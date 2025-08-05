import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const userFormSchema = z.object({
  first_name: z.string().min(1),
});

export const getUserFormSchema = (dictionary: Dictionary, isEdit: boolean) => {
  return z.object({
    first_name: z.string().min(1, {
      message: dictionary.forms.firstname + " " + dictionary.errors.required,
    }),
    last_name: z.string().min(1, {
      message: dictionary.forms.lastname + " " + dictionary.errors.required,
    }),
    nickname: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 3, {
        message: dictionary.forms.nickname + " " + dictionary.errors.required,
      }),
    mobile: z
      .string()
      .min(1, {
        message: dictionary.forms.mobile + " " + dictionary.errors.required,
      })
      .regex(/^\d+$/, {
        message: dictionary.forms.mobile + " " + dictionary.errors.number,
      }),
    email: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: dictionary.forms.email + " " + dictionary.errors.invalidEmail,
      }),
    password: isEdit
      ? z.string().optional()
      : z.string().min(8, { message: dictionary.errors.password }),

    role_id: z.string({
      required_error: dictionary.forms.role + " " + dictionary.errors.required,
    }),
    status: z.enum(["active", "deactive"], {
      required_error:
        dictionary.forms.status + " " + dictionary.errors.required,
    }),
    avatar_id: z.number().optional(),
    phone: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: dictionary.forms.phone + " " + dictionary.errors.number,
      })
      .refine((val) => !val || val.length >= 8, {
        message: dictionary.forms.phone + " " + dictionary.errors.minLength,
      }),
    phone_code: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: dictionary.forms.phoneCode + " " + dictionary.errors.number,
      })
      .refine((val) => !val || val.length >= 1, {
        message: dictionary.forms.phoneCode + " " + dictionary.errors.required,
      }),
    gender: z.enum(["male", "female"]).nullable().optional(),
    city_id: z.number().optional(),
    birthdate_jalali: z.string().optional(),
    date_marriage: z.string().optional(),
    job: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message: dictionary.forms.job + " " + dictionary.errors.required,
      }),
    education: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 2, {
        message: dictionary.forms.education + " " + dictionary.errors.required,
      }),
    address: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 3, {
        message: dictionary.forms.address + " " + dictionary.errors.required,
      }),
    address_plaque: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message:
          dictionary.forms.address +
          " " +
          dictionary.forms.plaque +
          " " +
          dictionary.errors.required,
      }),
    address_floor: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message:
          dictionary.forms.address +
          " " +
          dictionary.forms.floor +
          " " +
          dictionary.errors.required,
      })
      .refine((val) => !val || /^\d+$/.test(val), {
        message:
          dictionary.forms.address +
          " " +
          dictionary.forms.floor +
          " " +
          dictionary.errors.number,
      }),
    address_unit: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 1, {
        message:
          dictionary.forms.address +
          " " +
          dictionary.forms.unit +
          " " +
          dictionary.errors.required,
      })
      .refine((val) => !val || /^\d+$/.test(val), {
        message:
          dictionary.forms.address +
          " " +
          dictionary.forms.unit +
          " " +
          dictionary.errors.number,
      }),
    postal_code: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 3, {
        message: dictionary.forms.postalCode + " " + dictionary.errors.required,
      })
      .refine((val) => !val || /^\d+$/.test(val), {
        message: dictionary.forms.postalCode + " " + dictionary.errors.number,
      }),

    national_code: z
      .string()
      .transform((val) => (val === "" ? undefined : val))
      .optional()
      .refine((val) => !val || val.length <= 10, {
        message:
          dictionary.forms.nationalCode + " " + dictionary.errors.invalid,
      })
      .refine((val) => !val || /^\d+$/.test(val), {
        message: dictionary.forms.nationalCode + " " + dictionary.errors.number,
      }),
    level: z.enum(["gold", "silver", "bronze"]).optional(),
    location_lat: z.string().optional(),
    location_lon: z.string().optional(),
  });
};

export type UserFormData = z.infer<ReturnType<typeof getUserFormSchema>>;

export type UpdateUserFormData = UserFormData & { id: number };
