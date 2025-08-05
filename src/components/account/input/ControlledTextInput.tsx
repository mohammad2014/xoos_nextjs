"use client";

import { cn } from "@/lib/utils";

interface Props {
  label: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  inputClassName?: string;
}

export default function ControlledTextInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  inputClassName = "",
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary-600" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "border-primary-300 text-sm h-10 focus:border-primary-700 placeholder-primary-500 rounded-md border py-2 px-3 focus:outline-0 disabled:cursor-not-allowed disabled:opacity-50",
          inputClassName
        )}
      />
    </div>
  );
}
