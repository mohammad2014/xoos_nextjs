"use client";

import * as React from "react";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { toJalaali, toGregorian } from "jalaali-js";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { UserFormData } from "@/schemas/userSchema";

interface DatePickerProps {
  label?: string;
  value?: string; // Changed to string to handle Jalali format
  onChange?: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  errors?: FieldErrors<UserFormData>;
  name: keyof UserFormData;
  className?: string;
}

const toJalaliString = (date: Date): string => {
  const { jy, jm, jd } = toJalaali(date);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${jy}/${pad(jm)}/${pad(jd)}`;
};

const parseJalaliString = (jalaliStr: string): Date | null => {
  try {
    const parts = jalaliStr.split("/");
    if (parts.length !== 3) return null;

    const jy = Number.parseInt(parts[0]);
    const jm = Number.parseInt(parts[1]);
    const jd = Number.parseInt(parts[2]);

    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd); // gm is 1-based, Date constructor expects 0-based month
  } catch {
    return null;
  }
};

export function DatePicker({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  errors,
  name,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = value
    ? parseJalaliString(value) || undefined
    : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label>{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between h-10 py-2 px-3 font-normal bg-transparent text-right",
              !value && "text-muted-foreground",
              errors?.[name] && "border-red-500 focus:border-red-500"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {value || placeholder}
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                const jalaliStr = toJalaliString(date);
                onChange?.(jalaliStr);
              } else {
                onChange?.(undefined);
              }
              setOpen(false);
            }}
            dir="rtl"
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
      {errors?.[name] && (
        <p className="text-sm text-red-500 px-1 text-right">
          {errors?.[name]?.message as string}
        </p>
      )}
    </div>
  );
}
