import { getSocial, SocialItem } from "@/lib/getSocial";
import {
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  MessageCircle,
  MessageSquareText,
} from "lucide-react";
import { JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  x: <Twitter className="w-5 h-5" />,
  rubika: <MessageSquareText className="w-5 h-5" />,
  bale: <MessageCircle className="w-5 h-5" />,
  eitaa: <MessageCircle className="w-5 h-5" />,
  soroush_plus: <MessageSquareText className="w-5 h-5" />,
};

export default async function SocialMedia() {
  const socialItems: SocialItem[] = await getSocial();

  return (
    <div>
      <p className="text-primary-600">ما را دنبال کنید</p>
      <div className="flex flex-wrap gap-4 mt-2">
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            title={item.title}
            className="text-primary-400 hover:text-primary-600 transition-colors cursor-default"
          >
            {iconMap[item.type]}
          </a>
        ))}
      </div>
    </div>
  );
}
