import { getFooterItems } from "@/lib/menuApi";
import FooterList from "./FooterList";
import Newsletter from "./Newsletter";
import Copyright from "./Copyright";
import { Separator } from "@/components/ui/separator";
import SelectLanguage from "@/components/account/SelectLanguage";
import SocialMedia from "./SocialMedia";

export default async function Footer() {
  const footerItems = await getFooterItems();

  return (
    <div className="max-w-[1560px] mx-auto w-9/10 mt-10 py-10 border-t-1 border-primary-300">
      <div className="grid grid-cols-12 gap-6 pb-6 md:pb-10">
        <div className="col-span-12 lg:col-span-9">
          <FooterList footerItems={footerItems} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <Newsletter />
          <SocialMedia />
        </div>
      </div>
      <Separator />
      <Copyright />
      <div className="mx-auto flex w-full justify-center">
        <SelectLanguage />
      </div>
    </div>
  );
}
