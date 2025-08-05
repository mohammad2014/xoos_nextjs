"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, EllipsisVertical } from "lucide-react";
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
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { Dictionary } from "@/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/hooks/use-dictionary";
import CreateEditSocialForm from "../form/CreateEditSocialMediaForm";
import { Social } from "@/models/social-model";
import { changePrioritySocialMedia, deleteSocialMedia } from "@/lib/api";
import { toast } from "sonner";

interface ActionsCellProps {
  row: Row<Social>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();

  const { dictionary } = useDictionary();
  return (
    <div className="flex flex-nowrap justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-1">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!hasPermission("UpdateWidgetSocialMedia") && (
            <>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                {dictionary.common.edit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {!hasPermission("DeleteWidgetSocialMedia") && (
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              {dictionary.common.delete}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm font-primary-bold text-primary-900">
              {dictionary.common.edit + " " + dictionary.nav.socialMedia}
            </DialogTitle>
            <DialogDescription>
              {dictionary.common.editItemDescription}
            </DialogDescription>
          </DialogHeader>
          <CreateEditSocialForm
            onSuccess={() => {
              setEditOpen(false);
              onSuccess?.();
            }}
            socialToEdit={row.original}
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
            action={deleteSocialMedia}
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
    </div>
  );
};

export const PriorityCell = ({ row, onSuccess }: ActionsCellProps) => {
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();
  const [isPending, startTransition] = useTransition();

  const handleChange = async (action: "up" | "down") => {
    startTransition(async () => {
      try {
        const result = await changePrioritySocialMedia(row.original.id, action);
        console.log("result", result);
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
    <div className="flex gap-2">

      {hasPermission("UpdateWidgetSocialMedia") && (
        <>
          <Button
            disabled={isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange("up")}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            disabled={isPending}
            type="button"
            size="icon"
            variant="outline"
            onClick={() => handleChange("down")}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export function socialColumns(dictionary: Dictionary): ColumnDef<Social>[] {
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
      enableSorting: false,
    },
    {
      accessorKey: "type",
      header: dictionary.forms.type,
      enableSorting: false,
    },
    {
      accessorKey: "link",
      header: dictionary.forms.link,
      enableSorting: false,
      cell: ({ row }) => {
        const value = row.getValue("link") as string;
        return (
          <div className="max-w-25 lg:max-w-max truncate" title={value}>
            {value}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: dictionary.forms.status,
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "active" ? "verified" : "destructive"}>
            {status === "active"
              ? dictionary.common.active
              : dictionary.common.deactive}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: dictionary.forms.priority,
      enableSorting: false,
      cell: (props) => (
        <PriorityCell
          {...props}
          onSuccess={
            (props.table.options.meta as { onSuccess?: () => void })?.onSuccess
          }
        />
      ),
    },
    {
      id: "actions",
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
