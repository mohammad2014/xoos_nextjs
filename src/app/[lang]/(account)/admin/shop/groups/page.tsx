"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { shopGroupColumns } from "@/components/account/columns/ShopGroupColumns";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { ShopGroup } from "@/models/shop-group-model";
import AddItemPage from "@/components/account/AddItemPage";
import { deleteShopGroup, getShopGroups } from "@/lib/api/shop-groups";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<ShopGroup>({
    fetchFunction: getShopGroups,
  });

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessShopGroups")) {
    router.push("/dashboard");
  }
  console.log(data.data);

  return (
    <>
      <Heading level={1}>{dictionary.nav.groups}</Heading>
      {hasPermission("CreateShopGroups") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.group}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={shopGroupColumns(dictionary)}
          onSuccess={refetch}
          action={deleteShopGroup}
        />
      )}
    </>
  );
}
