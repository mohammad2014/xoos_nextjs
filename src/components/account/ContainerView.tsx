import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface ContainerViewProps {
  children: ReactNode;
  className?: string;
}

export default function ContainerView({
  className,
  children,
}: ContainerViewProps) {
  return (
    <div
      className={cn(
        "bg-primary-0 border-primary-300 flex items-center justify-between rounded-md border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
