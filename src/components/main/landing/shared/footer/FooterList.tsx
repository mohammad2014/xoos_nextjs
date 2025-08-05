import { Heading } from "@/components/ui/Heading";
import { MenuItem } from "@/lib/menuApi";

type FooterListProps = {
  footerItems: MenuItem[];
};

export default function FooterList({ footerItems }: FooterListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-8">
      {footerItems
        .filter((item) => item.children && item.children.length > 0)
        .map((item) => (
          <div key={item.id} className="lg:col-span-3">
            <Heading level={3} className="mb-4">
              {item.title}
            </Heading>

            <ul className="flex flex-col gap-y-2">
              {item.children!.map((child) => (
                <li key={child.id}>
                  <Heading level={4}>{child.title}</Heading>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
