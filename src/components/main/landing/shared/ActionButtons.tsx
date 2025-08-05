"use client";

import TextInput from "@/components/account/input/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ✅ Schema for validation
const signInFormSchema = z.object({
  search: z.string().optional(),
});

// ✅ Infer TypeScript type from schema
type FormValues = z.infer<typeof signInFormSchema>;

export default function ActionButtons() {
  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <div className="flex gap-x-3 items-center w-4/10 flex-row-reverse">
      <User className="w-5 h-5 cursor-pointer" />
      <BriefcaseBusiness className="w-5 h-5 cursor-pointer" />
      <TextInput
        label=""
        name="search"
        register={register}
        variant="secondary"
        placeholder="جستجو کنید"
        errors={errors}
      />
    </div>
  );
}
