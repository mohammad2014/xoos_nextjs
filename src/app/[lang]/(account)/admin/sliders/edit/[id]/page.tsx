import CreateEditSliderForm from "@/components/account/form/CreateEditSliderForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getSliderById } from "@/lib/api";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const slider = await getSliderById(id);
  console.log(slider);

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["UpdateSliders"]}>
      <CreateEditSliderForm defaultValue={slider.data} />
    </ProtectWithPermissionWrapper>
  );
}
