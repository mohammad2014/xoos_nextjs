import { MenuDashboard } from "@/components/account/table/menuSortable/MenuDashborad";
import { getMenuById } from "@/lib/api";

interface Props {
  params: Promise<{ id: number }>;
}
export default async function page({ params }: Props) {
  const { id } = await params;
  const menu = await getMenuById(id);

  return <MenuDashboard defaultMenu={menu.data} />;
}
