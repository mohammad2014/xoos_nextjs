import { forwardRef, ReactNode } from "react";
import { cn } from "../../lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;
type HeadingVariant = "default" | "secondary";
type TextColor = "primary-900" | "primary-600";

type HeadingProps = {
  level?: HeadingLevel;
  children: ReactNode;
  variant?: HeadingVariant;
  textColor?: TextColor;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 1,
      children,
      variant = "default",
      textColor = "primary-900",
      className,
      ...props
    },
    ref
  ) => {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";

    // Prevent rendering h4 with secondary variant
    if (variant === "secondary" && level === 4) return null;

    const sizeClasses: Record<HeadingLevel, string> = {
      1: variant === "default" ? "text-xl" : "text-base",
      2: variant === "default" ? "text-base" : "text-sm",
      3: variant === "default" ? "text-sm" : "text-xs",
      4: "text-xs", // Only used for default variant
    };

    const fontClass = variant === "default" ? "font-primary-bold" : "";
    const colorClass = `text-${textColor}`;

    return (
      <Tag
        ref={ref}
        className={cn(sizeClasses[level], fontClass, colorClass, className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
