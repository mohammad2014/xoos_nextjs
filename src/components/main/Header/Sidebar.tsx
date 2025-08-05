import {
  getSidebarMainMenu,
  getSidebarSecondaryMenu,
  MenuResponseData,
} from "@/lib/menuApi";
import SidebarContent from "./SidebarContent";
import { Locale } from "@/lib/dict";

type SidebarProps = {
  lang: Locale;
};

export default async function Sidebar({ lang }: SidebarProps) {
  const menuItemsData: MenuResponseData = await getSidebarMainMenu();
  const introductionSidebarData: MenuResponseData =
    await getSidebarSecondaryMenu();

  return (
    <SidebarContent
      lang={lang}
      mainItems={menuItemsData.items}
      mainDescription={menuItemsData.description}
      introItems={introductionSidebarData.items}
      introDescription={introductionSidebarData.description}
    />
  );
}
