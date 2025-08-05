"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteRole, getRoles } from "@/lib/api";
import AddItemModal from "@/components/account/AddItemModal";
import { Role } from "@/models/role-model";
import CreateEditRoleForm from "@/components/account/form/CreateEditRoleForm";
import { roleColumns } from "@/components/account/columns/RoleColumns";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Role>({
    fetchFunction: getRoles,
  });

  console.log(data);

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessRoles")) {
    router.push("/dashboard");
  }

  return (
    <>
      <Heading level={1}>{dictionary.nav.roles}</Heading>
      {hasPermission("CreateRoles") && (
        <AddItemModal
          FormComponent={CreateEditRoleForm}
          onSuccess={refetch}
          label={dictionary.common.add + " " + dictionary.nav.role}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={roleColumns(dictionary)}
          onSuccess={refetch}
          action={deleteRole}
        />
      )}
    </>
  );
}
