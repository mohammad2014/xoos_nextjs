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
import { useState } from "react";
import { deleteRole } from "@/lib/api";
import { Role } from "@/models/role-model";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import CreateEditRoleItemForm from "../form/CreateEditRoleForm";
import CreateEditRolePermissionForm from "../form/CreateEditRolePermissionForm";
import { Dictionary } from "@/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";

interface ActionsCellProps {
  row: Row<Role>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  if (
    !hasPermission(
      ["UpdateRoles", "DeleteRoles", "AccessRolePermissions"],
      "all"
    )
  ) {
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
          {hasPermission("UpdateRoles") && (
            <>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                {dictionary.common.edit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("DeleteRoles") && (
            <>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                {dictionary.common.delete}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("AccessRolePermissions") && (
            <>
              <DropdownMenuItem onClick={() => setPermissionOpen(true)}>
                {dictionary.nav.permissions}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.role}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditRoleItemForm
            onSuccess={() => {
              setEditOpen(false);
              onSuccess?.();
            }}
            roleToEdit={row.original}
          />
        </DialogContent>
      </Dialog>

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
            action={deleteRole}
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
      {/* RolePermission Dialog */}
      <Dialog open={permissionOpen} onOpenChange={setPermissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.nav.permissions}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditRolePermissionForm
            id={row.original.id}
            onSuccess={() => setPermissionOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function roleColumns(dictionary: Dictionary): ColumnDef<Role>[] {
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
      accessorKey: "title",
      header: dictionary.forms.title,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.title,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.title + "...",
      },
    },
    {
      accessorKey: "name",
      header: dictionary.forms.name,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.name,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.name + "...",
      },
    },

    {
      accessorKey: "systemic",
      header: dictionary.forms.systemic,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.systemic,
        variant: "select",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.systemic + "...",
        options: [
          { label: dictionary.common.yes, value: "yes" },
          { label: dictionary.common.no, value: "no" },
        ],
      },
      cell: ({ row }) => {
        const systemic = row.original.systemic;

        return (
          <div>
            {systemic === "yes" ? (
              <Badge variant="verified">{dictionary.common.yes}</Badge>
            ) : (
              <Badge variant="destructive">{dictionary.common.no}</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: dictionary.forms.description,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue("description") as string;

        return (
          <div className="max-w-50 lg:max-w-max truncate" title={value}>
            {value}
          </div>
        );
      },
      meta: {
        label: dictionary.forms.description,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.description + "...",
      },
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
