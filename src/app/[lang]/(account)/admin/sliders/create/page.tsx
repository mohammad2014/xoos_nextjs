import CreateEditSliderForm from "@/components/account/form/CreateEditSliderForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";

export default async function page() {
  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateSliders"]}>
      <CreateEditSliderForm />
    </ProtectWithPermissionWrapper>
  );
}
