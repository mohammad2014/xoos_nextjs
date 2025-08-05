import CreateEditWidgetForm from "@/components/account/form/CreateEditWidgetForm";
import ProtectWithPermissionWrapper from "@/components/account/ProtectWithPermissionWrapper";
import { getWidgetsTemplate, getWidgetsTemplateList } from "@/lib/api";

export default async function page() {
  const widgetsTemplateList = await getWidgetsTemplateList();
  const WidgetsTemplate = await getWidgetsTemplate();

  return (
    <ProtectWithPermissionWrapper requiredPermissions={["CreateWidgets"]}>
      <CreateEditWidgetForm
        widgetsTemplateList={widgetsTemplateList}
        WidgetsTemplate={WidgetsTemplate}
      />
    </ProtectWithPermissionWrapper>
  );
}
