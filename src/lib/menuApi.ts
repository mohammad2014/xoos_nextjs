"use server";

import axios from "axios";
import { api, getCsrfToken } from "./api";

export type MenuImageInfo = {
  id: number;
  url: string;
  description: string;
};

export type MenuChildItem = {
  id: number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  link: string;
  level: number;
  image?: number;
  imageUrl?: string;
  imageName?: string;
  priority: number;
  parentId: number;
  children: MenuChildItem[];
  image_info?: MenuImageInfo | null;
};

export type MenuItem = {
  id: number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  link: string;
  level: number;
  priority: number;
  children: MenuChildItem[];
  image_info?: MenuImageInfo | null;
};

export type MenuResponseData = {
  description: string;
  items: MenuItem[];
};

export const getSidebarMainMenu = async (): Promise<MenuResponseData> => {
  try {
    const { data } = await api.get("/api/menus/menu_sidebar_1");
    console.log("sidebar main menu data", data);

    return {
      description: data.data.description,
      items: data.data.items,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      console.log("sidebar main menu error", errData);
      return errData;
    }
    throw error; // Rethrow non-Axios errors
  }
};

export const getSidebarSecondaryMenu = async (): Promise<MenuResponseData> => {
  try {
    const { data } = await api.get("/api/menus/menu_sidebar_2");
    console.log("sidebar secondary menu data", data);

    return {
      description: data.data.description,
      items: data.data.items,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      console.log("sidebar secondary menu error", errData);
      return errData;
    }
    throw error; // Rethrow non-Axios errors
  }
};

export const getMainMenu = async (): Promise<MenuItem[]> => {
  try {
    const { data } = await api.get("/api/menus/menu_main");
    console.log("main menu data", data);

    return data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      console.log("main menu error", errData);
      return errData;
    }
    throw error; // Rethrow non-Axios errors
  }
};

export const getFooterItems = async (): Promise<MenuItem[]> => {
  try {
    const { data } = await api.get("/api/menus/menu_footer");
    console.log("footer items data", data);

    return data.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      console.log("footer items error", errData);
      return errData;
    }
    throw error; // Rethrow non-Axios errors
  }
};

export async function newsletterSubscribe({ email }: { email: string }) {
  try {
    console.log("email server", email);

    await getCsrfToken();
    const { data } = await api.post("/api/newsletter/subscribe", { email });
    console.log("news data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      console.log("newsletter error", errData);
      return errData;
    }
    throw error; // Rethrow non-Axios errors
  }
}
