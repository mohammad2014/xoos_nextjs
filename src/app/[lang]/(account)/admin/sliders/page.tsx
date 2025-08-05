"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteSlider, getSliders } from "@/lib/api";
import { useDictionary } from "@/hooks/use-dictionary";
import AddItemPage from "@/components/account/AddItemPage";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Slider } from "@/models/slider-model";
import { SliderColumns } from "@/components/account/columns/SliderColumns";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/hooks/use-data-table-data";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Slider>({
    fetchFunction: getSliders,
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();

  return (
    <>
      <Heading level={1}>{dictionary.nav.sliders}</Heading>
      {hasPermission("CreateSliders") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.slider}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={SliderColumns(dictionary)}
          onSuccess={refetch}
          action={deleteSlider}
        />
      )}
    </>
  );
}
