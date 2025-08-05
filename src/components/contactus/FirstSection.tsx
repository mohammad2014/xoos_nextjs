import { Phone } from "lucide-react";
import { Heading } from "../ui/Heading";
import { ReactElement } from "react";

type InfoItem = {
  id: number;
  icon: ReactElement;
  title: string;
  subTitle: string;
};

const info: InfoItem[] = [
  {
    id: 1,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "فروش اینترنتی:",
    subTitle: "051 - 38431110",
  },
  {
    id: 2,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "خدمات پس از فروش:",
    subTitle: "051 - 38431110",
  },
  {
    id: 3,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "واحد طراح:",
    subTitle: "09151053139",
  },
  {
    id: 4,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "اخذ نمایندگی:",
    subTitle: "051 - 38431110",
  },
  {
    id: 5,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "آدرس فروشگاه:",
    subTitle: "مشهد، خیابان سناباد، بین سناباد 43 و 45 ، مبلمان ارم هوم",
  },
  {
    id: 6,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "آدرس ایمیل:",
    subTitle: "info @ eram.ir",
  },
  {
    id: 7,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "تلگرام ما را دنبال کنید. ",
    subTitle: "",
  },
  {
    id: 8,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "اینستاگرام ما را دنبال کنید. ",
    subTitle: "",
  },
  {
    id: 9,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "مسیریاب گوگل:",
    subTitle: "آدرس گالری مبلمان ارم هوم",
  },
  {
    id: 10,
    icon: <Phone size={16} className="text-primary-600" />,
    title: "مسیریاب نشان: ",
    subTitle: "آدرس گالری مبلمان ارم هوم",
  },
];

export default function FirstSection() {
  return (
    <div>
      <header className="mb-8">
        <Heading level={1} className="mb-10">
          مشتاقانه منتظر تماستان هستیم
        </Heading>
        <p className="text-primary-600">
          برای درخواست اطلاعات بیشتر، در مورد درخواست‌ها، اطلاعات محصول، موجودی،
          تحویل، قیمت‌ها و موارد دیگر ، فرم زیر را پر کنید یا با ما تماس بگیرید.
        </p>
      </header>
      <section className="flex flex-col gap-6">
        {info.map((item) => (
          <div key={item.id} className="bg-primary-100 rounded-sm px-5 py-3">
            <div className="flex gap-x-4 items-center">
              <span>{item.icon}</span>
              <div className="flex gap-x-2 items-center">
                <Heading level={4}>{item.title}</Heading>
                <p className="text-primary-600">{item.subTitle}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
