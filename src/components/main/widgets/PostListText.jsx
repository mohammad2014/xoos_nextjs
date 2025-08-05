import ServiceIntroduction from "../landing/supportOverview/ServiceIntroduction";
import SupportInformation from "../landing/supportOverview/SupportInformation";

export function PostListText({ data }) {
  console.log(data);

  return (
    <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-12">
      <ServiceIntroduction data={data} />
      <SupportInformation items={data.items} />
    </div>
  );
}
