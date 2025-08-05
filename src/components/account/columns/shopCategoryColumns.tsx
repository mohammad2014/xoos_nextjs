"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { EllipsisVertical, ChevronDown, ChevronRight } from "lucide-react";
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
import { Checkbox } from "../../ui/checkbox";
import ConfirmDelete from "../ConfirmDelete";
import { Dictionary } from "@/lib/dict";
import { useAuth } from "@/contexts/authContext";
import { useDictionary } from "@/hooks/use-dictionary";
import { deleteShopCategory } from "@/lib/api/shop-categories";
import { ShopCategory } from "@/models/shop-category-model";
import Link from "next/link";

interface ActionsCellProps {
  row: Row<ShopCategory>;
  onSuccess?: () => void;
}

export const ActionsCell = ({ row, onSuccess }: ActionsCellProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { dictionary } = useDictionary();

  if (!hasPermission(["UpdateShopCategory", "DeleteShopCategory"], "any")) {
    return null;
  }

  return (
    <div className="flex flex-nowrap justify-end items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-1">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {hasPermission("UpdateShopCategory") && (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin/shop/categories/edit/${row.original.id}`}>
                  {dictionary.common.edit}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {hasPermission("DeleteShopCategory") && (
            <>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                {dictionary.common.delete}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
            action={deleteShopCategory}
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

export function shopCategoryColumns(
  dictionary: Dictionary
): ColumnDef<ShopCategory>[] {
  return [
    {
      id: "expand",
      header: "",
      size: 36,
      cell: ({ row }) => (
        <div className="h-full flex items-center overflow-hidden w-full">
          {row.getCanExpand() ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={row.getToggleExpandedHandler()}
              className="p-1"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4 rtl:rotate-180" />
              )}
            </Button>
          ) : (
            <span className="h-4 w-9 inline-block" />
          )}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      accessorKey: "description",
      header: dictionary.forms.description,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.getValue("description") as string;
        return (
          <div className="max-w-50 lg:max-w-max truncate" title={value}>
            {value || "-"}
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
      accessorKey: "level",
      header: dictionary.forms.level,
      enableColumnFilter: true,
      meta: {
        label: dictionary.forms.level,
        variant: "text",
        placeholder:
          dictionary.common.search + " " + dictionary.forms.level + "...",
      },
    },
    {
      id: "actions",
      enableColumnFilter: false,
      meta: {
        label: "Actions",
        variant: "text",
      },
      cell: ActionsCell,
    },
  ];
}
