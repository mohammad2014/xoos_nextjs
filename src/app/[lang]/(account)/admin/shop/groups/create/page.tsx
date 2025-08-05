import CreateEditShopGroupForm from "@/components/account/form/CreateEditShopGroupForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default async function page() {
  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateShopGroups"]}>
      <CreateEditShopGroupForm />
    </ProtectWithPermissionWrapper>
  );
}
