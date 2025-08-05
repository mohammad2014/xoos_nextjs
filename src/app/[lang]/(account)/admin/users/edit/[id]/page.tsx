import CreateEditUserForm from "@/components/account/form/CreateEditUserForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getCities, getRolesList, getUserById } from "@/lib/api";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const rolesList = await getRolesList();
  const cities = await getCities();
  const { id } = await params;
  const user = await getUserById(id);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateUsers"]}>
      <CreateEditUserForm
        rolesList={rolesList.data}
        cities={cities.data}
        defaultValue={user.data}
      />
    </ProtectWithPermissionWrapper>
  );
}
