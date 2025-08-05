import CreateEditShopGroupForm from "@/components/account/form/CreateEditShopGroupForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getShopGroupById } from "@/lib/api/shop-groups";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const shopGroup = await getShopGroupById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateShopGroups"]}>
      <CreateEditShopGroupForm defaultValue={shopGroup.data} />
    </ProtectWithPermissionWrapper>
  );
}
