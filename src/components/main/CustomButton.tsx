import Link from "next/link";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";

type CustomButtonProps = {
  buttonLabel: string;
  icon?: LucideIcon;
  link?: boolean;
  href?: string;
};

export default function CustomButton({
  buttonLabel,
  icon: Icon,
  link = false,
  href = "#",
}: CustomButtonProps) {
  const content = (
    <>
      {buttonLabel}
      {Icon && <Icon className="ltr:rotate-180 text-chart-4" />}
    </>
  );
  const buttonStyle = `rounded-sm text-primary-600 bg-primary-200 hover:bg-amber-200 cursor-pointer md:h-10`;

  return link ? (
    <Button asChild className={buttonStyle}>
      <Link href={href}>{content}</Link>
    </Button>
  ) : (
    <Button className={buttonStyle}>{content}</Button>
  );
}
