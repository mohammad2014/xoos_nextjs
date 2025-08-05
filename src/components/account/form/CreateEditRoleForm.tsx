"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import TextInput from "@/components/account/input/TextInput";

import { getRoleFormSchema, RoleFormData } from "@/schemas/roleSchema";
import { createRole, updateRole } from "@/lib/api";
import { toast } from "sonner";
import { Role } from "@/models/role-model";
import { useDictionary } from "@/hooks/use-dictionary";
import SelectField from "../input/SelectField";

interface CreateEditRoleFormProps {
  onSuccess: () => void;
  roleToEdit?: Partial<Role>;
}

export default function CreateEditRoleForm({
  onSuccess,
  roleToEdit = {},
}: CreateEditRoleFormProps) {
  const { id } = roleToEdit;
  const { dictionary } = useDictionary();
  const roleFormSchema = getRoleFormSchema(dictionary);

  const SYSTEMIC_OPTIONS = [
    { value: "yes", label: dictionary.common.yes },
    { value: "no", label: dictionary.common.yes },
  ];

  const isEditSession = Boolean(id);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RoleFormData>({
    defaultValues: {
      title: roleToEdit.title ?? "",
      name: roleToEdit.name ?? "",
      level: roleToEdit.level ?? 1,
      description: roleToEdit.description ?? "",
      systemic:
        roleToEdit.systemic === "yes" || roleToEdit.systemic === "no"
          ? (roleToEdit.systemic as "yes" | "no")
          : "no",
    },
    resolver: zodResolver(roleFormSchema),
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      const result = isEditSession
        ? await updateRole({
            ...data,
            level: String(data.level),
            id: id as number,
          })
        : await createRole({ ...data, level: String(data.level) });
      console.log(result);

      if (result?.status === "success") {
        toast.success(result.message);
        onSuccess();
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof RoleFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(
          isEditSession
            ? dictionary.errors.updateError
            : dictionary.errors.createError
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        isEditSession
          ? dictionary.errors.updateError
          : dictionary.errors.createError
      );
    }
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
        label={dictionary.forms.level}
        name="level"
        register={register}
        errors={errors}
        type="number"
        placeholder={dictionary.forms.level}
        disabled={isSubmitting}
      />
      <TextInput
        label={dictionary.forms.description + dictionary.common.optional}
        name="description"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.description}
        disabled={isSubmitting}
      />

      <Controller
        control={control}
        name="systemic"
        render={({ field }) => (
          <SelectField
            label={dictionary.forms.systemic}
            value={field.value || ""}
            onValueChange={field.onChange}
            options={SYSTEMIC_OPTIONS}
            placeholder={dictionary.forms.systemic}
            disabled={isSubmitting}
            error={errors.systemic?.message}
          />
        )}
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
