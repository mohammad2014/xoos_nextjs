"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useState, useTransition } from "react";
import {
  changeStatusUser,
  deleteUser,
  verifyEmail,
  verifyMobile,
} from "@/lib/api";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { User } from "@/models/user-model";
import { Dictionary } from "@/lib/dict";
import Link from "next/link";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/authContext";
import { useDictionary } from "@/hooks/use-dictionary";
import ChangePasswordForm from "../form/ChangePasswordForm";

interface ActionsCellProps {
  row: Row<User>;
  onSuccess?: () => void;
  isEmail?: boolean;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  if (!hasPermission(["UpdateUsers", "DeleteUsers"], "all")) {
    return null;
  }

  return (
    <div className="flex flex-nowrap justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-1">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hasPermission("UpdateUsers") && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/edit/${row.original.id}`}>
                  {dictionary.common.edit}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("DeleteUsers") && (
            <>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                {dictionary.common.delete}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("UpdateUsers") && (
            <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
              {dictionary.forms.changePassword}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.delete}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ConfirmDelete
            action={deleteUser}
            onCancel={() => setDeleteOpen(false)}
            onSuccess={() => {
              setDeleteOpen(false);
              onSuccess?.();
            }}
            ids={[row.original.id]}
            dictionary={dictionary}
          />
        </DialogContent>
      </Dialog>
      {/* Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.delete}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.deleteItemDescription}
            </DialogDescription>
          </DialogHeader>
          <ChangePasswordForm
            onSuccess={() => {
              setPasswordOpen(false);
              onSuccess?.();
            }}
            passwordToEditId={row.original.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const VerifyCell = ({ row, onSuccess, isEmail }: ActionsCellProps) => {
  const [isPending, startTransition] = useTransition();

  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  const status = isEmail
    ? !!row.original.email_verified_at
    : !!row.original.mobile_verified_at;

  let statusForVerification;

  if (isEmail) {
    statusForVerification = !row.original.email_verified_at ? 1 : 0;
  } else {
    statusForVerification = !row.original.mobile_verified_at ? 1 : 0;
  }
  const userId = row.original.id;

  const handleVerify = async () => {
    startTransition(async () => {
      try {
        const result = isEmail
          ? await verifyEmail(statusForVerification, userId)
          : await verifyMobile(statusForVerification, userId);
        console.log(result);

        if (result?.status === "success") {
          toast.success(result?.message);
          onSuccess?.();
        } else {
          toast.error(result?.message);
        }
      } catch {
        toast.error(dictionary.common.error);
      }
    });
  };

  return (
    <>
      <Switch
        checked={status}
        disabled={!hasPermission("UpdateUsers") || isPending}
        onCheckedChange={handleVerify}
      />
    </>
  );
};

export const ChangeStatusCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [isPending, startTransition] = useTransition();

  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  const userId = row.original.id;
  const status = row.original.status;

  const statusForAction = status === "active" ? "deactive" : "active";

  const handleACtiveUser = async () => {
    startTransition(async () => {
      try {
        const result = await changeStatusUser(statusForAction, userId);
        console.log(result);

        if (result?.status === "success") {
          toast.success(result?.message);
          onSuccess?.();
        } else {
          toast.error(result?.message);
        }
      } catch {
        toast.error(dictionary.common.error);
      }
    });
  };

  return (
    <>
      <Switch
        checked={status === "active"}
        disabled={!hasPermission("UpdateUsers") || isPending}
        onCheckedChange={handleACtiveUser}
      />
    </>
  );
};

export function userColumns(dictionary: Dictionary): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: dictionary.forms.fullname,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.fullname,
        variant: "text",
        placeholder: dictionary.forms.fullname,
      },
    },
    {
      accessorKey: "mobile",
      header: dictionary.forms.mobile,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.mobile,
        variant: "text",
        placeholder: dictionary.forms.mobile,
      },
    },
    {
      accessorKey: "role",
      header: dictionary.forms.role,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.role,
        variant: "text",
        placeholder: dictionary.forms.role,
      },
      cell: ({ row }) => {
        const role = row.original.role as { title?: string } | undefined;

        return <div>{role?.title}</div>;
      },
    },
    {
      accessorKey: "email",
      header: dictionary.forms.email,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.email,
        variant: "text",
        placeholder: dictionary.forms.email,
      },
    },
    {
      accessorKey: "email_verified_at",
      header: dictionary.forms.verify + " " + dictionary.forms.email,
      enableColumnFilter: true,
      cell: (props) => (
        <VerifyCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
          isEmail={true}
        />
      ),
      meta: {
        label: dictionary.forms.verify + " " + dictionary.forms.email,
        variant: "select",
        placeholder:
          dictionary.common.search +
          " " +
          dictionary.forms.verify +
          " " +
          dictionary.forms.email +
          "...",
        options: [
          { label: dictionary.forms.verified, value: "active" },
          { label: dictionary.forms.notVerified, value: "0" },
        ],
      },
    },
    {
      accessorKey: "mobile_verified_at",
      header: dictionary.forms.verify + " " + dictionary.forms.mobile,
      enableColumnFilter: true,
      cell: (props) => (
        <VerifyCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
      meta: {
        label: dictionary.forms.verify + " " + dictionary.forms.mobile,
        variant: "select",
        placeholder:
          dictionary.common.search +
          " " +
          dictionary.forms.verify +
          " " +
          dictionary.forms.mobile +
          "...",
        options: [
          { label: dictionary.forms.verified, value: "active" },
          { label: dictionary.forms.notVerified, value: "deactive" },
        ],
      },
    },
    {
      accessorKey: "status",
      header: dictionary.forms.status,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.status,
        variant: "select",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.status + "...",
        options: [
          { label: dictionary.common.active, value: "active" },
          { label: dictionary.common.deactive, value: "deactive" },
        ],
      },
      cell: (props) => (
        <ChangeStatusCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
    {
      id: "actions",
      enableColumnFilter: false,
      meta: {
        label: "Actions",
        variant: "text",
      },
      cell: (props) => (
        <ActionsCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
  ];
}
