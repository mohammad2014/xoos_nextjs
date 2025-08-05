"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDictionary } from "@/hooks/use-dictionary";
import {
  getRolePermissionById,
  getRolesPermissions,
  updateRolePermissions,
} from "@/lib/api";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

type Permission = {
  id: string | number;
  name: string;
  title: string;
};

interface Props {
  id: number;
  onSuccess: () => void;
}

interface FormValues {
  permissionIds: number[];
}

export default function CreateEditRolePermissionForm({ id, onSuccess }: Props) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dictionary } = useDictionary();

  const { control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      permissionIds: [],
    },
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const [allPermissions, checkedPermissions] = await Promise.all([
          getRolesPermissions(),
          getRolePermissionById(id),
        ]);
        setPermissions(allPermissions.data.data || []);
        const checkedIds = checkedPermissions.data.map((perm: Permission) =>
          Number(perm.id)
        );
        setValue("permissionIds", checkedIds);
      } catch (err) {
        setError(dictionary.common.error);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [id, setValue, dictionary]);

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await updateRolePermissions(id, data.permissionIds);
      if (result?.status === "success") {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(error);
    }
  };

  if (loading) return <p>{dictionary.common.loading}</p>;
  if (error) return <p>{error}</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full min-w-10 gap-5"
    >
      {permissions.map((permission) => (
        <div className="flex w-full items-center" key={permission.id}>
          <Controller
            name="permissionIds"
            control={control}
            render={({ field }) => (
              <Checkbox
                className="me-2 ms-0"
                id={permission.name}
                checked={field.value.includes(Number(permission.id))}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.onChange([...field.value, Number(permission.id)]);
                  } else {
                    field.onChange(
                      field.value.filter((id) => id !== Number(permission.id))
                    );
                  }
                }}
              />
            )}
          />
          <Label className="text-sm" htmlFor={permission.name}>
            {permission.title}
          </Label>
        </div>
      ))}
      <Button className="w-full mt-3 h-11 text-base" type="submit">
        {dictionary.common.submit}
      </Button>
    </form>
  );
}
