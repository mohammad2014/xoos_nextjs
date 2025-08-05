"use client";
import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deletePermission, getPermissions } from "@/lib/api";
import AddItemModal from "@/components/account/AddItemModal";
import { permissionsColumns } from "@/components/account/columns/PermissionsColumns";
import CreateEditPermissionForm from "@/components/account/form/CreateEditPermissionForm";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDictionary } from "@/hooks/use-dictionary";
import { useAuth } from "@/contexts/authContext";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { Permission } from "@/models/permission-model";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Permission>({
    fetchFunction: getPermissions,
  });
  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessPermissions")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.permissions}</Heading>
      {hasPermission("CreatePermissions") && (
        <AddItemModal
          FormComponent={CreateEditPermissionForm}
          onSuccess={refetch}
          label={dictionary.common.add + " " + dictionary.nav.permission}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={permissionsColumns(dictionary)}
          onSuccess={refetch}
          action={deletePermission}
        />
      )}
    </>
  );
}
