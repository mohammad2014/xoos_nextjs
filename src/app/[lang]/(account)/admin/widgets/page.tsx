"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteWidget, getWidgets } from "@/lib/api";
import { useDictionary } from "@/hooks/use-dictionary";
import AddItemPage from "@/components/account/AddItemPage";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Widget } from "@/models/widget-model";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { WidgetColumns } from "@/components/account/columns/WidgetColumns";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Widget>({
    fetchFunction: getWidgets,
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <>
      <Heading level={1}>{dictionary.nav.widgets}</Heading>
      {hasPermission("CreateWidgets") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.widget}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={WidgetColumns(dictionary)}
          onSuccess={refetch}
          action={deleteWidget}
        />
      )}
    </>
  );
}
