"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TextInput from "@/components/account/input/TextInput";
import { toast } from "sonner";
import {
  PermissionFormData,
  getPermissionFormSchema,
} from "@/schemas/permissionSchema";
import { createPermissions, updatePermission } from "@/lib/api";
import { Permission } from "@/models/permission-model";
import { useDictionary } from "@/hooks/use-dictionary";

interface CreateEditRoleFormProps {
  onSuccess: () => void;
  permissionToEdit?: Partial<Permission>;
}

export default function CreateEditPermissionForm({
  onSuccess,
  permissionToEdit = {},
}: CreateEditRoleFormProps) {
  const { id } = permissionToEdit;
  const { dictionary } = useDictionary();
  const permissionFormSchema = getPermissionFormSchema(dictionary);
  const isEditSession = Boolean(id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PermissionFormData>({
    defaultValues: {
      ...permissionToEdit,
      description:
        permissionToEdit.description === null
          ? undefined
          : permissionToEdit.description,
    },
    resolver: zodResolver(permissionFormSchema),
  });

  const onSubmit = async (data: PermissionFormData) => {
    try {
      const result = isEditSession
        ? await updatePermission({
            ...data,
            id: id as number,
          })
        : await createPermissions({
            ...data,
          });
      if (result.status === "success") {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "خطای ناشناخته");
    }
    console.log(data);
  };

  return (
    <form
      className="flex w-full min-w-10 flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        label={dictionary.forms.title}
        name="title"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.title}
        disabled={isSubmitting}
      />
      <TextInput
        label={dictionary.forms.name}
        name="name"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.name}
        disabled={isSubmitting}
      />
      <TextInput
        label={dictionary.forms.description}
        name="description"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.description}
        disabled={isSubmitting}
      />
      <Button
        disabled={isSubmitting}
        type="submit"
        className="w-full h-11 text-base"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
  );
}
