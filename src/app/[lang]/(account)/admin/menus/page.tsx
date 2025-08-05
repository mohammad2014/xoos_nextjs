"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteMenu, getMenus } from "@/lib/api";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { menuColumns } from "@/components/account/columns/MenuColumns";
import { Menu } from "@/models/menu-model";
import AddItemPage from "@/components/account/AddItemPage";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Menu>({
    fetchFunction: getMenus,
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  console.log(data);

  return (
    <>
      <Heading level={1}>{dictionary.nav.menus}</Heading>
      {hasPermission("CreateMenus") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.menu}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={menuColumns(dictionary)}
          onSuccess={refetch}
          action={deleteMenu}
        />
      )}
    </>
  );
}
