import { Dispatch, SetStateAction } from "react";

type LoginSessionInfo = {
  handleResend: () => Promise<void>;
  mobile: string;
  session_token: string;
};

export type LoginFormProps = {
  setMobile: Dispatch<SetStateAction<string>>;
  setSessionToken: Dispatch<SetStateAction<string>>;
  setRememberMe: Dispatch<SetStateAction<boolean>>;
  mobile: string;
  rememberMe: boolean;
};

export type PasswordLoginStepProps = LoginSessionInfo;

export type OtpVerificationStepProps = LoginSessionInfo & {
  timeLeft: number;
  setTimeLeft: Dispatch<SetStateAction<number>>;
};
