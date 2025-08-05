"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import { useLoginStep } from "@/hooks/use-login-step";
import { Heading } from "@/components/ui/Heading";

export default function LoginHeader() {
  const { dictionary } = useDictionary();
  const { step, goBack } = useLoginStep();

  return (
    <header className="flex justify-between mb-14">
      <Heading level={2} className="select-none">
        {dictionary.forms.login} | {dictionary.forms.signin}
      </Heading>
      {step !== 1 && (
        <Button onClick={goBack} variant="ghost">
          <ChevronRight className="w-5 h-5 ltr:rotate-180 stroke-[1]" />
          {dictionary.common.back}
        </Button>
      )}
    </header>
  );
}
