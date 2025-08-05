import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { DataTableData } from "@/models/data-table-data";

type NestedItem = {
  id: string | number;
  children?: NestedItem[];
};

interface UseDataTableDataOptions<T extends NestedItem> {
  fetchFunction: () => Promise<{ data: DataTableData<T> }>;
}

export function useDataTableDataLocalSearch<T extends NestedItem>({
  fetchFunction,
}: UseDataTableDataOptions<T>) {
  const searchParams = useSearchParams();
  const globalFilter = searchParams.get("globalFilter")?.toLowerCase() ?? "";

  const [rawData, setRawData] = useState<DataTableData<T>>({
    data: [],
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    return fetchFunction()
      .then((res) => setRawData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const matches = useCallback(
    (item: T, term: string): boolean =>
      Object.values(item).some((val) => {
        if (typeof val === "object" && val !== null) return false;
        return String(val).toLowerCase().includes(term);
      }),
    []
  );

  const filterTree = useCallback(
    (items: T[], term: string): T[] => {
      return items
        .map((node) => {
          if (matches(node, term)) return node;
          if (!node.children) return null;
          const filteredChildren = filterTree(node.children as T[], term);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean) as T[];
    },
    [matches]
  );

  const data = useMemo(() => {
    if (!globalFilter) {
      setIsFiltered(false);
      return rawData;
    } else {
      setIsFiltered(true);
    }
    const filtered = filterTree(rawData.data, globalFilter);
    return { ...rawData, data: filtered, total: filtered.length };
  }, [rawData, globalFilter, filterTree]);

  return { data, loading, refetch: fetchData, isFiltered };
}
