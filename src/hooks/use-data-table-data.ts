"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { DataTableData } from "@/models/data-table-data";
export interface FetchParams {
  page: number;
  perPage: number;
  filters: [];
  sort: [];
  globalFilter: string | null;
}

interface UseDataTableDataOptions<T> {
  fetchFunction: (params: FetchParams) => Promise<{ data: DataTableData<T> }>;
}

export function useDataTableData<T>({
  fetchFunction,
}: UseDataTableDataOptions<T>) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? "10";
  const filters = searchParams.get("filters");
  const sort = searchParams.get("sort");
  const globalFilter = searchParams.get("globalFilter");

  const [data, setData] = useState<DataTableData<T>>({
    data: [],
    total: 0,
    per_page: 10,
    current_page: 1,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const parsedFilters = filters ? JSON.parse(filters) : [];
      const parsedSort = sort ? JSON.parse(sort) : [];
      const res = await fetchFunction({
        page: Number(page),
        perPage: Number(perPage),
        filters: parsedFilters,
        sort: parsedSort,
        globalFilter,
      });
      console.log(res);

      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      // Optionally, handle error state more gracefully, e.g., show a toast
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters, sort, fetchFunction, globalFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
}
