import { Banner } from "./Banner";
import ProductBar from "./ProductBar";
import { SwiperList } from "./SwiperList";
import { PostBar } from "./PostBar";
import { PostListText } from "./PostListText";

const componentList = {
  banner_1: Banner,
  swiper_list_1: SwiperList,
  post_bar_1: PostBar,
  product_bar_1: ProductBar,
  post_list_text_1: PostListText,
};

export default function WidgetsRender({ widgets }) {
  if (!widgets) return null;
  console.log(widgets);

  return (
    <div className="space-y-15 mt-10 max-w-[1560px] mx-auto w-9/10">
      {widgets.map((widget) => {
        const Component = componentList[widget.template_coding];
        if (!Component) {
          return null;
        }
        return <Component key={widget.id} data={widget} />;
      })}
    </div>
  );
}
