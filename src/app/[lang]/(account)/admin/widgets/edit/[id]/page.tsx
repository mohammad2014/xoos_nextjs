import CreateEditWidgetForm from "@/components/account/form/CreateEditWidgetForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import {
  getWidgetById,
  getWidgetsTemplate,
  getWidgetsTemplateList,
} from "@/lib/api";

interface Props {
  params: Promise<{ id: number }>;
}

export default async function page({ params }: Props) {
  const { id } = await params;
  const widget = await getWidgetById(id);
  const widgetsTemplateList = await getWidgetsTemplateList();
  const WidgetsTemplate = await getWidgetsTemplate();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateWidgets"]}>
      <CreateEditWidgetForm
        widgetsTemplateList={widgetsTemplateList}
        WidgetsTemplate={WidgetsTemplate}
        defaultValue={widget}
      />
    </ProtectWithPermissionWrapper>
  );
}
