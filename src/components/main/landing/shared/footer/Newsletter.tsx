"use client";

import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/Heading";
import { newsletterSubscribe } from "@/lib/menuApi";
import { toast } from "sonner";
import TextInput from "@/components/account/input/TextInput";

// Schema
const formSchema = z.object({
  email: z.string().email("ایمیل معتبر وارد کنید"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Newsletter() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const result = await newsletterSubscribe({ email: data.email });

      if (result?.status === "success") {
        toast.success(result.message);
        reset(); // clear input
      } else if (result.status === "validation_error" && result.data) {
        toast.error(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-4">
      <Heading level={3}>خبرنامه ما را دریافت کنید</Heading>
      <p className="text-primary-600">
        برای دریافت جدیدترین محصولات و ترندهای ما، ایمیل خود را وارد کنید.
      </p>
      <div className="h-20 relative">
        <TextInput
          label=""
          placeholder="ایمیل شما ..."
          errors={errors}
          register={register}
          name={"email"}
          variant="secondary"
          inputClassName="w-full"
        />
        <button
          type="submit"
          className="absolute top-1/7 left-2 ltr:right-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 animate-spin " />
          ) : (
            <Send className="w-5 text-primary-600 rotate-270" />
          )}
        </button>
      </div>
    </form>
  );
}
