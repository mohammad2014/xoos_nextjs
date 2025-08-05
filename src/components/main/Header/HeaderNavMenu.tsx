import { getMainMenu, MenuItem } from "@/lib/menuApi";
import Link from "next/link";

export default async function HeaderNavMenu() {
  const mainMenu: MenuItem[] = await getMainMenu();
  console.log(mainMenu);

  return (
    <nav className="gap-8 menu-links hidden lg:flex">
      {mainMenu.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="text-sm text-primary-900 hover:text-primary transition-colors"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
