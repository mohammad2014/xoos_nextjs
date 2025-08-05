"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDictionary } from "@/hooks/use-dictionary";
import { setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
export default function SelectLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const { dictionary } = useDictionary();
  const handleLanguageChange = (newLocale: string) => {
    setCookie("locale", newLocale, { maxAge: 30 * 24 * 60 * 60 });

    router.push(`/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "")}`);
  };

  return (
    <div>
      <Select onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={dictionary.ui.language.selectLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="fa">{dictionary.ui.language.fa}</SelectItem>
            <SelectItem value="en">{dictionary.ui.language.en}</SelectItem>
            <SelectItem value="ar">{dictionary.ui.language.ar}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
