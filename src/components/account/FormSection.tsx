import { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import {
  UseFieldArrayMove,
  UseFormSetValue,
  FieldPath,
  FieldValues,
} from "react-hook-form";

interface FormSectionProps<T extends FieldValues> {
  title: string;
  children: ReactNode;
  index?: number;
  fieldsLength?: number;
  move?: UseFieldArrayMove;
  setItemImageIds?: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  setValue?: UseFormSetValue<T>;
  onRemove?: () => void;
}

export default function FormSection<T extends FieldValues>({
  title,
  children,
  index,
  fieldsLength,
  move,
  setItemImageIds,
  setValue,
  onRemove,
}: FormSectionProps<T>) {
  const moveItem = (direction: "up" | "down") => {
    if (
      index === undefined ||
      fieldsLength === undefined ||
      move === undefined ||
      setItemImageIds === undefined ||
      setValue === undefined
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fieldsLength) return;

    move(index, newIndex);

    setItemImageIds((prev) => {
      const newIds = [...prev];
      [newIds[index], newIds[newIndex]] = [newIds[newIndex], newIds[index]];
      return newIds;
    });

    // به‌روزرسانی priority برای همه آیتم‌ها
    for (let i = 0; i < fieldsLength; i++) {
      const fieldPath: FieldPath<T> = `items.${i}.priority` as FieldPath<T>;
      // @ts-expect-error - TS can’t verify dynamic field path at runtime
      setValue(fieldPath, i + 1);
    }
  };

  return (
    <div className="bg-primary-100 p-4 rounded-sm border">
      <div className="flex justify-between items-center mb-2">
        <Heading level={3}>{title}</Heading>
        <div className="flex gap-2">
          {index !== undefined && index > 0 && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => moveItem("up")}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {index !== undefined &&
            fieldsLength !== undefined &&
            index < fieldsLength - 1 && (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => moveItem("down")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            )}
          {onRemove && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
