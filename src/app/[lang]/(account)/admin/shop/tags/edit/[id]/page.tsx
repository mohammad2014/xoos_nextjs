import CreateEditShopTagForm from "@/components/account/form/CreateEditShopTagFrom";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getShopTagById } from "@/lib/api/shop-tags";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const shopTag = await getShopTagById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateShopTags"]}>
      <CreateEditShopTagForm defaultValue={shopTag.data} />
    </ProtectWithPermissionWrapper>
  );
}
