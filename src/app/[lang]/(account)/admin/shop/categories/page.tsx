"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopCategory } from "@/models/shop-category-model";
import {
  deleteShopCategory,
  getShopCategories,
} from "@/lib/api/shop-categories";
import AddItemPage from "@/components/account/AddItemPage";
import { shopCategoryColumns } from "@/components/account/columns/shopCategoryColumns";
import { useDataTableDataLocalSearch } from "@/hooks/use-data-table-data-local-search";

export default function Page() {
  const { data, loading, refetch, isFiltered } =
    useDataTableDataLocalSearch<ShopCategory>({
      fetchFunction: getShopCategories,
    });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopCategory")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.categories}</Heading>
      {hasPermission("CreateShopCategory") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.category}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          key={String(isFiltered)}
          data={data}
          columns={shopCategoryColumns(dictionary)}
          onSuccess={refetch}
          action={deleteShopCategory}
        />
      )}
    </>
  );
}
