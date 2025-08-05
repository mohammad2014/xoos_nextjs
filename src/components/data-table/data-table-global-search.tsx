import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import React from "react";
import { useDictionary } from "@/hooks/use-dictionary";

interface DataTableGlobalSearchProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  debounceMs?: number;
}

export function DataTableGlobalSearch<TData>({
  table,
  placeholder,
  debounceMs = 300,
}: DataTableGlobalSearchProps<TData>) {
  const { dictionary } = useDictionary();
  placeholder = placeholder || dictionary.ui.table.globalSearch;
  const [searchValue, setSearchValue] = React.useState(
    table.getState().globalFilter ?? ""
  );

  const debouncedSetGlobalFilter = useDebouncedCallback((value: string) => {
    table.setGlobalFilter(value);
  }, debounceMs);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSetGlobalFilter(value);
    table.setPageIndex(0); // Reset to first page on search
  };

  return (
    <div className="max-w-sm">
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearch}
        className="w-full text-sm h-8"
      />
    </div>
  );
}
