"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Heading } from "../ui/Heading";
import { useDictionary } from "@/hooks/use-dictionary";
interface AddItemModalProps<T> {
  FormComponent: React.ComponentType<{ onSuccess: () => void; data: T }>;
  data?: T;
  onSuccess?: () => void;
  label?: string;
}

export default function AddItemModal<T>({
  FormComponent,
  data,
  label,
  onSuccess,
}: AddItemModalProps<T>) {
  const [open, setOpen] = useState(false);
  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };
  const { dictionary } = useDictionary();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="bg-primary-0 border-primary-300 mt-3 flex items-center justify-between rounded-md border p-4">
          <Heading level={3}>{label}</Heading>
          <DialogTrigger asChild>
            <Button>{dictionary.common.add}</Button>
          </DialogTrigger>
        </div>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {label}
            </DialogTitle>
            <DialogDescription className="text-primary-600">
              {dictionary.common.addItemDescription}
            </DialogDescription>
          </DialogHeader>
          <FormComponent onSuccess={handleSuccess} data={data as T} />
        </DialogContent>
      </Dialog>
    </>
  );
}
