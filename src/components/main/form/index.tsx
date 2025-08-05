"use client";

import LoginForm from "./LoginForm";
import OtpVerificationStep from "./OtpVerificationStep";
import PasswordLoginStep from "./PasswordLoginStep";
import { useState } from "react";
import { useLoginStep } from "@/hooks/use-login-step";
import { requestOtp } from "@/lib/api/authApi";
import useSessionStorageState from "@/hooks/use-session-storage-state";

export default function Form() {
  const { step } = useLoginStep();
  const [mobile, setMobile] = useSessionStorageState("mobile", "");
  const [sessionToken, setSessionToken] = useSessionStorageState(
    "session_token",
    ""
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [rememberMe, setRememberMe] = useState(false);

  const handleResend = async () => {
    try {
      await requestOtp(mobile, sessionToken);
      setTimeLeft(60);
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full h-screen">
      {step === 1 && (
        <LoginForm
          setMobile={setMobile}
          setSessionToken={setSessionToken}
          setRememberMe={setRememberMe}
          mobile={mobile}
          rememberMe={rememberMe}
        />
      )}
      {step === 2 && (
        <PasswordLoginStep
          handleResend={handleResend}
          mobile={mobile}
          session_token={sessionToken}
        />
      )}
      {step === 3 && (
        <OtpVerificationStep
          mobile={mobile}
          session_token={sessionToken}
          handleResend={handleResend}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
        />
      )}
    </div>
  );
}
