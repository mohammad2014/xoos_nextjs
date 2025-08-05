import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string | React.ReactNode }[];
  placeholder: string;
  disabled?: boolean;
  error?: string;
  defaultValue?: string;
}

export default function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  error,
  defaultValue,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary-600">{label}</label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        defaultValue={defaultValue}
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
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
