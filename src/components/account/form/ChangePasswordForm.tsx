"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import {
  getPasswordFormSchema,
  PasswordFormData,
} from "@/schemas/passwordSchema";
import PasswordInput from "../input/PasswordInput";
import { changePassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateEditRoleFormProps {
  onSuccess: () => void;
  passwordToEditId?: number;
}

export default function ChangePasswordForm({
  onSuccess,
  passwordToEditId,
}: CreateEditRoleFormProps) {
  const { dictionary } = useDictionary();
  const passwordFormSchema = getPasswordFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const result = await changePassword(
        data as PasswordFormData,
        passwordToEditId as number
      );
      console.log(result);

      if (result.status === "success") {
        toast.success(result.message);
        reset();
        onSuccess();
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof PasswordFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(dictionary.common.error);
    }
  };

  return (
    <form
      className="flex w-full min-w-10 flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PasswordInput
        label={dictionary.forms.password}
        name="password"
        register={register}
        errors={errors}
        placeholder=""
        disabled={isSubmitting}
      />
      <PasswordInput
        label={dictionary.forms.confirmPassword}
        name="password_confirmation"
        register={register}
        errors={errors}
        placeholder=""
        disabled={isSubmitting}
      />
      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 text-base"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
  );
}
