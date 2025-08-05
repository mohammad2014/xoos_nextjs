import CreateEditShopTagForm from "@/components/account/form/CreateEditShopTagFrom";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default async function page() {
  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateShopTags"]}>
      <CreateEditShopTagForm />
    </ProtectWithPermissionWrapper>
  );
}
