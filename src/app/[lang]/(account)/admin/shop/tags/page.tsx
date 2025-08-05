"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { shopTagColumns } from "@/components/account/columns/ShopTagColumns";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopTag } from "@/models/shop-tag-model";
import { deleteShopTag, getShopTags } from "@/lib/api/shop-tags";
import AddItemPage from "@/components/account/AddItemPage";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<ShopTag>({
    fetchFunction: getShopTags,
  });

  console.log(data);

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopTags")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.tags}</Heading>
      {hasPermission("CreateShopTags") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.tags}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={shopTagColumns(dictionary)}
          onSuccess={refetch}
          action={deleteShopTag}
        />
      )}
    </>
  );
}
