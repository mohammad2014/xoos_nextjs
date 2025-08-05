"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useDictionary } from "@/hooks/use-dictionary";
import AuthCard from "./shared/AuthCard";
import CaptchaField from "./CaptchaField";
import TextInput from "@/components/account/input/TextInput";
import { useLoginStep } from "@/hooks/use-login-step";
import { LoginFormProps } from "@/types/auth";
import { getLoginFormSchema, LoginFormData } from "@/schemas/authSchema";
import { registerStepOne } from "@/lib/api/authApi";
import { useAuth } from "@/contexts/authContext";
import CustomButton from "@/components/shared/CustomButton";

export default function LoginForm({
  setMobile,
  setSessionToken,
  setRememberMe,
  mobile,
  rememberMe,
}: LoginFormProps) {
  const { dictionary } = useDictionary();
  const { setAuth } = useAuth();
  const { setStep } = useLoginStep();

  const loginSchema = getLoginFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      mobile,
      remember_me: rememberMe,
      recaptcha_token: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setMobile(data.mobile);
    setRememberMe(data.remember_me);
    console.log("Login form user data:", data);

    try {
      const result = await registerStepOne(
        data.mobile,
        data.recaptcha_token,
        data.remember_me
      );
      console.log("Login form backend data:", result);

      setStep(result.data.step);
      setSessionToken(result.data.session_token);

      if (result?.status === "success") {
        setAuth(result.data);
      } else if (result.status === "validation_error" && result.data) {
        setError("mobile", { type: "server", message: result.message });
      } else {
        setError("mobile", { type: "server", message: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setValue("recaptcha_token", token || "");
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col mb-8">
          <div className="h-28 mb-4">
            <TextInput
              label={dictionary.forms.mobile}
              placeholder=""
              register={register}
              inputClassName="w-full"
              name="mobile"
              errors={errors}
              variant="secondary"
            />
          </div>
          <Controller
            name="remember_me"
            control={control}
            render={({ field }) => (
              <div className="flex gap-x-2 items-center text-sm mb-8">
                <Checkbox
                  className="cursor-pointer m-0"
                  id="remember_me"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="remember_me" className="select-none">
                  {dictionary.forms.rememberme}
                </label>
              </div>
            )}
          />
          <CaptchaField
            error={errors.recaptcha_token?.message}
            onChange={onCaptchaChange}
          />
        </div>
        <CustomButton loading={isSubmitting}>
          {dictionary.forms.next}
        </CustomButton>
      </form>
    </AuthCard>
  );
}
