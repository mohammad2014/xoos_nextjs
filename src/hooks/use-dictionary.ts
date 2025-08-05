import { useParams } from "next/navigation";
import { Dictionary, Locale } from "@/lib/dict";
import en from "@/dictionaries/en.json";
import fa from "@/dictionaries/fa.json";
import ar from "@/dictionaries/ar.json";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fa,
  ar
};

export function useDictionary() {
  const params = useParams();
  const lang = (params?.lang as Locale) || "fa";
  const dictionary = dictionaries[lang] || dictionaries.fa;
  return { dictionary, lang };
}
