import { cn } from "@/lib/utils";

export default function TextInput({
  label,
  name,
  register,
  errors,
  placeholder,
  disabled = false,
  type = "text",
  inputClassName = "",

  variant = "default",
}) {
  // استخراج آخرین قسمت نام فیلد
  const fieldName = name.split(".").pop();

  return (
    <div className="flex flex-col gap-2 justify-end">
      {label && (
        <label className="text-primary-600" htmlFor={name}>
          {label}
        </label>
      )}

      <input
        {...register(name)}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "text-sm h-10 border-primary-300 placeholder-primary-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 focus:border-primary-700",
          errors && errors[fieldName] ? "border-red-600" : "",
          inputClassName,
          variant === "default" ? "border rounded-md py-2 px-3" : "border-b"
        )}
      />
      {errors && errors[fieldName] && (
        <p className="text-red-600">{errors[fieldName]?.message}</p>
      )}
    </div>
  );
}
