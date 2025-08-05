"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface PasswordInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  disabled?: boolean;
  inputClassName?: string;
  variant?: "default" | "secondary";
}

export default function PasswordInput<T extends FieldValues>({
  label,
  name,
  register,
  errors,
  placeholder,
  disabled = false,
  inputClassName = "",
  variant = "default",
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary-600" htmlFor={name}>
        {label}
      </label>
      <div className="relative w-full">
        <input
          {...register(name)}
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full text-sm h-10 border-primary-300 placeholder-primary-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 focus:border-primary-700",
            variant === "default" ? "border rounded-md py-2 px-3" : "border-b",
            errors?.[name] && "border-red-600",
            inputClassName
          )}
        />
        <button
          type="button"
          className="absolute end-4 top-1/2 p-1 text-primary-400 -translate-y-1/2 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>
      {errors && name in errors && (
        <p className="text-red-600">
          {String(errors[name as keyof typeof errors]?.message ?? "")}
        </p>
      )}
    </div>
  );
}
