import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div className={`max-w-[1560px] mx-auto w-9/10 ${className}`}>
      {children}
    </div>
  );
}
