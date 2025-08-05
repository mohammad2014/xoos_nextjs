"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDictionary } from "@/hooks/use-dictionary";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import AuthCard from "./shared/AuthCard";
import { InputOTPPattern } from "./InputOTPPattern";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoginStep } from "@/hooks/use-login-step";
import { OtpVerificationStepProps } from "@/types/auth";
import {
  getOtpVerificationStepSchema,
  OtpVerificationStepSchemaData,
} from "@/schemas/authSchema";
import { verifyCode } from "@/lib/api/authApi";
import CustomButton from "@/components/shared/CustomButton";

export default function OtpVerificationStep({
  mobile,
  session_token,
  timeLeft,
  setTimeLeft,
  handleResend,
}: OtpVerificationStepProps) {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { setStep } = useLoginStep();

  const { dictionary } = useDictionary();
  const OtpVerificationStepSchema = getOtpVerificationStepSchema(dictionary);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<OtpVerificationStepSchemaData>({
    resolver: zodResolver(OtpVerificationStepSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: OtpVerificationStepSchemaData) => {
    try {
      const result = await verifyCode({
        mobile,
        session_token,
        verifyCode: data.verificationCode,
      });

      if (result?.status === "success") {
        setAuth(result.data);
        toast.success(result.message);
        router.push("/dashboard");
        sessionStorage.removeItem("login_step");
        sessionStorage.removeItem("mobile");
        sessionStorage.removeItem("session_token");
        reset();
      } else if (result.status === "validation_error" && result.data) {
        setError("verificationCode", {
          type: "server",
          message: result.message,
        });
      } else {
        setError("verificationCode", {
          type: "server",
          message: result.message,
        });
      }
    } catch (error) {
      console.log(error);

      toast.error("خطا هنگام ورود");
    }
  };

  const handleBackClick = () => setStep(2);

  return (
    <AuthCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8 h-28">
          <InputOTPPattern control={control} errors={errors} />
        </div>

        <CustomButton
          type="submit"
          disabled={isSubmitting}
          className="w-full mb-8"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <p>{dictionary.forms.login}</p>
          )}
        </CustomButton>

        <div className="grid grid-cols-2 justify-between">
          <div>
            {timeLeft > 0 ? (
              <div className="flex gap-x-2">
                <p className="select-none text-primary-600 w-fit ltr:order-2">
                  {formatTime()}
                </p>
                <p className="select-none text-primary-600 w-fit">
                  {dictionary.forms.resendCode}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="cursor-pointer text-primary-600"
              >
                {dictionary.forms.resendOtp}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleBackClick}
            className="text-primary-600 w-fit cursor-pointer justify-self-end"
          >
            {dictionary.forms.loginWithPassword}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
