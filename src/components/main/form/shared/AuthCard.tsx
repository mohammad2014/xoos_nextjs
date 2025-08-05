import { ReactNode } from "react";
import LoginHeader from "./LoginHeader";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`flex flex-col bg-primary-100 border border-primary-200 rounded-sm p-5 md:p-6 lg:p-10 mx-auto w-11/12 lg:w-2/5 ${className}`}
    >
      <LoginHeader />
      {children}
    </div>
  );
}
