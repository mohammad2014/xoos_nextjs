"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/authContext";
import AuthCard from "./shared/AuthCard";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import PasswordInput from "@/components/account/input/PasswordInput";
import { useLoginStep } from "@/hooks/use-login-step";
import { PasswordLoginStepProps } from "@/types/auth";
import {
  getPasswordLoginSchema,
  PasswordLoginData,
} from "@/schemas/authSchema";
import { loginWithPassword } from "@/lib/api/authApi";
import CustomButton from "@/components/shared/CustomButton";

export default function PasswordLoginStep({
  handleResend,
  mobile,
  session_token,
}: PasswordLoginStepProps) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { setStep } = useLoginStep();

  const { dictionary } = useDictionary();
  const passwordSchema = getPasswordLoginSchema(dictionary);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordLoginData>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordLogin = async (data: PasswordLoginData) => {
    console.log("Login with password user data:", data);
    try {
      const result = await loginWithPassword({
        mobile,
        password: data.password,
        session_token,
      });

      console.log("Login with password backend data:", result);

      if (result?.status === "success") {
        setAuth(result.data);
        toast.success(result.message);
        router.push("/dashboard");
        sessionStorage.removeItem("login_step");
        sessionStorage.removeItem("mobile");
        sessionStorage.removeItem("session_token");
        reset();
      } else if (result.status === "validation_error" && result.data) {
        setError("password", { type: "server", message: result.message });
      } else {
        setError("password", { type: "server", message: result.message });
      }
    } catch (error) {
      console.log(error);

      toast.error("خطا هنگام لاگین");
    }
  };

  const handleOtpLogin = async () => {
    try {
      await handleResend();
      setStep(3);
    } catch (error) {
      console.error("Failed to resend OTP code:", error);
    }
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit(handlePasswordLogin)} className="w-full">
        <div className="flex flex-col w-full mb-8 h-24">
          <PasswordInput
            placeholder={dictionary.forms.password}
            errors={errors}
            name="password"
            register={register}
            disabled={isSubmitting}
            label=""
            variant="secondary"
          />
        </div>

        <CustomButton
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full mb-2 md:mb-3"
        >
          {dictionary.forms.login}
        </CustomButton>

        <button
          type="button"
          onClick={handleOtpLogin}
          className="cursor-pointer"
        >
          {dictionary.forms.otpLogin}
        </button>
      </form>
    </AuthCard>
  );
}
