"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { useDictionary } from "@/hooks/use-dictionary";

type CaptchaFieldProps = {
  error?: string;
  onChange: (token: string | null) => void;
};

export default function CaptchaField({ error, onChange }: CaptchaFieldProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { lang } = useDictionary();

  return (
    <div className="flex flex-col items-center min-h-28">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY!}
        onChange={onChange}
        hl={lang}
      />
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
