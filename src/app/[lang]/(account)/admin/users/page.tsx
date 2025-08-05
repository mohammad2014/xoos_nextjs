"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteUser, getUsers } from "@/lib/api";
import { userColumns } from "@/components/account/columns/UserColumns";
import { useDictionary } from "@/hooks/use-dictionary";
import { User } from "@/models/user-model";
import AddItemPage from "@/components/account/AddItemPage";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<User>({
    fetchFunction: getUsers,
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  console.log(data);

  const router = useRouter();
  if (!hasPermission("AccessUsers")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.users}</Heading>
      {hasPermission("CreateUsers") && (
        <AddItemPage
          label={dictionary.common.add + " " + dictionary.nav.user}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={userColumns(dictionary)}
          onSuccess={refetch}
          action={deleteUser}
        />
      )}
    </>
  );
}
