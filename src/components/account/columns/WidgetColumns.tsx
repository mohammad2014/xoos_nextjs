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
import { changePriorityWidget, deleteWidget } from "@/lib/api";
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { Dictionary } from "@/lib/dict";
import Link from "next/link";
import { useDictionary } from "@/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { Widget } from "@/models/widget-model";
import { toast } from "sonner";

interface ActionsCellProps {
  row: Row<Widget>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  if (!hasPermission(["UpdateWidgets", "DeleteWidgets"], "all")) {
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
          {hasPermission("UpdateWidgets") && (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/widgets/edit/${row.original.id}?template=${row.original.template_coding}`}
                >
                  {dictionary.common.edit}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("DeleteWidgets") && (
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              {dictionary.common.delete}
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
            action={deleteWidget}
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
        const result = await changePriorityWidget(row.original.id, action);
        console.log("resultt", result);
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

export function WidgetColumns(dictionary: Dictionary): ColumnDef<Widget>[] {
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
        placeholder: dictionary.forms.title,
      },
    },
    {
      accessorKey: "template_coding",
      header: dictionary.forms.template_coding,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.template_coding,
        variant: "text",
        placeholder: dictionary.forms.template_coding,
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
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <div>
            {status === "active" ? (
              <Badge variant="verified">{dictionary.common.active}</Badge>
            ) : (
              <Badge variant="destructive">{dictionary.common.deactive}</Badge>
            )}
          </div>
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
      header: "",
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
