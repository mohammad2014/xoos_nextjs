import { Control, Controller, FieldErrors } from "react-hook-form";
import { OtpVerificationStepSchemaData } from "@/schemas/authSchema";
import { useDictionary } from "@/hooks/use-dictionary";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type InputOTPPatternProps = {
  control: Control<OtpVerificationStepSchemaData>;
  errors: FieldErrors<OtpVerificationStepSchemaData>;
};

export function InputOTPPattern({ control, errors }: InputOTPPatternProps) {
  const { dictionary } = useDictionary();

  return (
    <Controller
      name="verificationCode"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <label htmlFor="otp-code" className="text-sm font-medium">
            {dictionary.forms.OtpCode}
          </label>
          <InputOTP
            maxLength={6}
            {...field}
            value={field.value ?? ""}
            onChange={field.onChange}
            id="otp-code"
            autoFocus
            inputMode="numeric"
            pattern="\d*"
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
              ];
              if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
          >
            <InputOTPGroup className="w-full focus:border-none" dir="ltr">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot key={i} index={i} className="w-full h-11" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {errors.verificationCode && (
            <p className="text-red-600">{errors.verificationCode.message}</p>
          )}
        </div>
      )}
    />
  );
}
