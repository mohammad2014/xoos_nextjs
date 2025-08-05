import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

type CustomButtonProps = {
  loading?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function CustomButton({
  loading,
  children,
  className,
  ...rest
}: CustomButtonProps) {
  return (
    <Button
      type={rest.type ?? "submit"}
      disabled={loading || rest.disabled}
      className={cn(
        "w-full cursor-pointer text-primary-50 rounded-sm h-11 text-base bg-primary-900 hover:bg-primary-0 hover:border hover:border-primary-900 hover:text-primary-900",
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
