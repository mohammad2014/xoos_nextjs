"use client";
import { useReducer, useRef, useCallback } from "react";
import type { MenuItem, Menu } from "@/types/menu";
import { stripImageFields } from "@/utils/menuUtils";
import { toast } from "sonner";
import { createMenus, updateMenus } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useDictionary } from "./use-dictionary";

// تعریف حالت منو با اضافه کردن isLoading
type MenuState = {
  menu: Menu;
  isLoading: boolean;
};

// تعریف اکشن‌ها
type MenuAction =
  | { type: "SET_ITEMS"; payload: MenuItem[] }
  | { type: "UPDATE_MENU_DATA"; payload: Partial<Menu> }
  | { type: "RESET_TO_DEFAULT"; payload: Partial<Menu> | undefined }
  | { type: "SET_LOADING"; payload: boolean };

// تعریف reducer
const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        menu: { ...state.menu, items: action.payload },
        isLoading: false,
      };
    case "UPDATE_MENU_DATA":
      return {
        ...state,
        menu: { ...state.menu, ...action.payload },
        isLoading: false,
      };
    case "RESET_TO_DEFAULT":
      return {
        menu: {
          id: action.payload?.id,
          title: action.payload?.title ?? "",
          name: action.payload?.name ?? "",
          description: action.payload?.description ?? "",
          items: action.payload?.items
            ? ensureNumericalIds(action.payload.items)
            : [],
        },
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// تابع برای اطمینان از IDهای عددی و همگام‌سازی image_info
function ensureNumericalIds(items: MenuItem[]): MenuItem[] {
  return items.map((item, index) => ({
    ...item,
    id: item.id ?? Date.now() + index,
    image: item.image,
    imageUrl: item.image_info?.url ?? item.imageUrl,
    imageName: item.image_info?.name ?? item.imageName,
    children: item.children ? ensureNumericalIds(item.children) : undefined,
  }));
}

export function useMenuState(defaultMenu?: Partial<Menu>) {
  const initialDefaultMenuRef = useRef<Partial<Menu> | undefined>(defaultMenu);
  const router = useRouter();
  const { dictionary } = useDictionary();
  // تعریف حالت اولیه
  const getInitialState = useCallback(
    (initialData?: Partial<Menu>): MenuState => ({
      menu: {
        id: initialData?.id,
        title: initialData?.title ?? "",
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        items: initialData?.items ? ensureNumericalIds(initialData.items) : [],
      },
      isLoading: false,
    }),
    []
  );

  const [state, dispatch] = useReducer(
    menuReducer,
    initialDefaultMenuRef.current,
    getInitialState
  );

  // به‌روزرسانی آیتم‌ها
  const updateItems = useCallback((newItems: MenuItem[]) => {
    dispatch({ type: "SET_ITEMS", payload: newItems });
  }, []);

  // به‌روزرسانی داده‌های منو
  const updateMenu = useCallback((menuData: Partial<Menu>) => {
    dispatch({ type: "UPDATE_MENU_DATA", payload: menuData });
  }, []);

  // ذخیره تمام تغییرات با مدیریت لودینگ
  const saveAllChanges = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    const isEditSession = Boolean(state.menu.id);

    try {
      const cleanedMenu = {
        ...state.menu,
        items: stripImageFields(state.menu.items),
      };
      const result = isEditSession
        ? await updateMenus(cleanedMenu, state.menu.id)
        : await createMenus(cleanedMenu);

      if (result?.status === "success") {
        toast.success(result.message);
        router.push("/admin/users");
      } else {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            messages.forEach((msg) => {
              toast.error(`${fieldName}: ${msg}`);
            });
          }
        });
      }
    } catch (error) {
      console.log(error);

      toast.error(
        isEditSession
          ? dictionary.errors.updateError
          : dictionary.errors.createError
      );
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    state.menu,
    dictionary.errors.createError,
    dictionary.errors.updateError,
    router,
  ]);

  // بازنشانی تغییرات
  const resetChanges = useCallback(() => {
    dispatch({
      type: "RESET_TO_DEFAULT",
      payload: initialDefaultMenuRef.current,
    });
    toast.info("تغییرات بازنشانی شد!");
  }, []);

  return {
    menu: state.menu,
    isLoading: state.isLoading,
    updateItems,
    updateMenu,
    saveAllChanges,
    resetChanges,
  };
}
