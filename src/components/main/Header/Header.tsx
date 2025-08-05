import Image from "next/image";
import HeaderNavMenu from "./HeaderNavMenu";
import HeaderNavAction from "./HeaderNavAction";
import Sidebar from "./Sidebar";
import HeaderNavToggle from "./HeaderNavToggle";

export default function Header({ ...props }) {
  const { lang } = props;
  return (
    <header className="sticky top-0 z-50 h-18 bg-primary-0 text-primary-900 flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
      <div className="flex items-center gap-5 w-4/10">
        <HeaderNavToggle />
        <HeaderNavMenu />
      </div>
      <div className="w-2/10 relative h-full">
        <Image
          src="/images/logo.png"
          alt="Site Logo"
          fill
          className="object-contain scale-120"
        />
      </div>
      <HeaderNavAction />
      <Sidebar lang={lang} />
    </header>
  );
}
