// "use client";
import Form from "@/components/main/form";
import { LoginStepProvider } from "@/hooks/use-login-step";

export default function Home() {
  return (
    <>
      <LoginStepProvider>
        <Form />
      </LoginStepProvider>
    </>
  );
}
