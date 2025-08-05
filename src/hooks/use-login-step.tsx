"use client";

import { createContext, useContext } from "react";
import useSessionStorageState from "./use-session-storage-state";

type Step = 1 | 2 | 3;

type LoginStepContextType = {
  step: Step;
  setStep: (step: Step) => void;
  goBack: () => void;
};

const LoginStepContext = createContext<LoginStepContextType | undefined>(
  undefined
);

export const LoginStepProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useSessionStorageState<Step>("login_step", 1);

  const goBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : 1));
  };

  return (
    <LoginStepContext.Provider value={{ step, setStep, goBack }}>
      {children}
    </LoginStepContext.Provider>
  );
};

export const useLoginStep = () => {
  const context = useContext(LoginStepContext);
  if (!context) {
    throw new Error("useLoginStep must be used within a LoginStepProvider");
  }
  return context;
};
