import { z } from "zod";

export const contactUsSchema = z.object({
  lastName: z.string().min(2, "نام خانوادگی معتبر نیست"),
  email: z.string().email("ایمیل معتبر نیست"),
  phoneNumber: z.string().min(6, "شماره تماس معتبر نیست"),
  subject: z.string().min(2, "موضوع پیام باید حداقل ۲ کاراکتر داشته باشد"),
  message: z.string().min(5, "پیام باید حداقل ۵ کاراکتر داشته باشد").optional(),
});

export type ContactUsData = z.infer<typeof contactUsSchema>;
