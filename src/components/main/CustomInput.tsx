import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

type CustomInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: ReactNode;
  id?: string;
  iconRight?: ReactNode; // Icon or button on the right side of input
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, className, label, id, iconRight, ...props }, ref) => (
    <div>
      {label && (
        <label htmlFor={id} className="mb-3 text-primary-600 text-xs block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={`border-b border-primary-800 focus:outline-none w-full ${className}`}
          {...props}
        />
        {iconRight && (
          <div className="absolute top-1/2 rtl:left-2 -translate-y-1/2 ltr:right-2">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  )
);
CustomInput.displayName = "CustomInput";

export default CustomInput;
