"use client";
import { useQueryState } from "nuqs";
import { Heading } from "../ui/Heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Options } from "@/types/options";

interface AddItemPageProps {
  label: string;
  placeholder: string;
  options: Options;
}

export default function AddItemSelect({
  label,
  options,
  placeholder,
}: AddItemPageProps) {
  const [template, setTemplate] = useQueryState("template");

  return (
    <>
      <div className="bg-primary-0 border-primary-300 mt-3 flex items-center justify-between rounded-md border p-4">
        <Heading level={3}>{label}</Heading>
        <Select
          value={template ?? ""}
          onValueChange={(value) => setTemplate(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
