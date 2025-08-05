"use client";

import { Heading } from "@/components/ui/Heading";
import { MainDataTable } from "@/components/account/table/MainDataTable";
import { deleteRole, getSocialMedias } from "@/lib/api";
import AddItemModal from "@/components/account/AddItemModal";
import { useDictionary } from "@/hooks/use-dictionary";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDataTableData } from "@/hooks/use-data-table-data";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { socialColumns } from "@/components/account/columns/SocialColumns";
import { Social } from "@/models/social-model";
import CreateEditSocialForm from "@/components/account/form/CreateEditSocialMediaForm";

export default function Page() {
  const { data, loading, refetch } = useDataTableData<Social>({
    fetchFunction: getSocialMedias,
  });
  console.log(data);

  const { dictionary } = useDictionary();
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission("AccessWidgetSocialMedia")) {
    router.push("/dashboard");
  }
  return (
    <>
      <Heading level={1}>{dictionary.nav.socialMedia}</Heading>
      {hasPermission("CreateWidgetSocialMedia") && (
        <AddItemModal
          FormComponent={CreateEditSocialForm}
          onSuccess={refetch}
          label={dictionary.common.add + " " + dictionary.nav.socialMedia}
        />
      )}
      {loading ? (
        <TableSkeleton />
      ) : (
        <MainDataTable
          data={data}
          columns={socialColumns(dictionary)}
          onSuccess={refetch}
          action={deleteRole}
        />
      )}
    </>
  );
}
