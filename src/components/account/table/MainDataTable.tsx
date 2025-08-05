"use client";
import { ColumnDef, getExpandedRowModel } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableData } from "@/models/data-table-data";
import { RowData } from "@/models/row-data";
import { useState } from "react";
import {
  DataTableActionBar,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import DataTableActionDelete from "@/components/data-table/data-table-action-delete";
import ContainerView from "../ContainerView";
import { DataTableGlobalSearch } from "@/components/data-table/data-table-global-search";

interface MainDataTableProps<TData extends RowData, TValue> {
  data: DataTableData<TData>;
  columns: ColumnDef<TData, TValue>[];
  onSuccess?: () => void;
  action?: (
    ids: number[]
  ) => Promise<{ status: string; message: string; data: { ids: number[] } }>;
}

export function MainDataTable<TData extends RowData, TValue>({
  data,
  columns,
  onSuccess,
  action,
}: MainDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const { table, shallow, debounceMs, throttleMs } = useDataTable<TData>({
    data: data.data,
    columns,
    pageCount: Math.ceil((data.total ?? 1) / (data.per_page ?? 10)),
    initialState: {
      pagination: {
        pageIndex: (data.current_page ?? 1) - 1,
        pageSize: data.per_page ?? data.data.length,
      },
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => String(row.id),
    getSubRows: (row: TData) =>
      Array.isArray(row.children) ? (row.children as TData[]) : undefined,
    getExpandedRowModel: getExpandedRowModel(),
    meta: { onSuccess },
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id as number);

  return (
    <ContainerView>
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableGlobalSearch table={table} debounceMs={debounceMs} />
          <DataTableFilterList
            table={table}
            align="start"
            shallow={shallow}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
          />
          <DataTableSortList table={table} align="start" />
          <DataTableActionBar table={table}>
            <DataTableActionBarSelection table={table} />
            <DataTableActionDelete
              ids={selectedIds}
              action={action!}
              onSuccess={onSuccess}
            />
          </DataTableActionBar>
        </DataTableAdvancedToolbar>
      </DataTable>
    </ContainerView>
  );
}
