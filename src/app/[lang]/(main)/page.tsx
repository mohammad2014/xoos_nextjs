import BannerSlider from "@/components/main/widgets/BannerSlider";
import WidgetsRender from "@/components/main/widgets/WidgetsRender";
import { getHomeSliderMain } from "@/lib/api";
import { getWidgets } from "@/lib/fetchWidgets";
import { SliderItemFrom } from "@/models/slider-model";

export default async function page() {
  const slides: SliderItemFrom[] = await getHomeSliderMain();
  const widgets = await getWidgets();
  console.log(widgets);

  return (
    <>
      <BannerSlider slides={slides} />
      <WidgetsRender widgets={widgets} />
    </>
  );
}
