import { Dictionary } from "@/lib/dict";
import { z } from "zod";

export const getPasswordLoginSchema = (dictionary: Dictionary) => {
  return z.object({
    password: z.string().min(8, {
      message: dictionary.errors.password + " " + dictionary.errors.required,
    }),
  });
};

export const getLoginFormSchema = (dictionary: Dictionary) => {
  return z.object({
    mobile: z.string().min(11, {
      message: dictionary.forms.mobileMin,
    }),
    remember_me: z.boolean(),
    recaptcha_token: z.string().min(1, {
      message: dictionary.forms.captcha,
    }),
  });
};

export const getOtpVerificationStepSchema = (dictionary: Dictionary) =>
  z.object({
    verificationCode: z.string().min(6, {
      message: dictionary.forms.otpMin,
    }),
  });

export type PasswordLoginData = z.infer<
  ReturnType<typeof getPasswordLoginSchema>
>;
export type LoginFormData = z.infer<ReturnType<typeof getLoginFormSchema>>;

export type OtpVerificationStepSchemaData = z.infer<
  ReturnType<typeof getOtpVerificationStepSchema>
>;
