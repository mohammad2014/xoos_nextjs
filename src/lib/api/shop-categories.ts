"use server";

import { ShopCategoryFormData } from "@/schemas/shopCategorySchema";
import { ShopCategory } from "@/models/shop-category-model";
import axios from "axios";
import { api, getCsrfToken } from ".";

export const getShopCategories = async () => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-categories");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در دریافت دسته‌بندی‌ها");
  }
};

export const getShopCategoriesList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/shop-categories/list");
  return data.data;
};

export const getShopCategoryById = async (
  id: number
): Promise<ShopCategory> => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-categories/${id}`);
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در دریافت دسته‌بندی");
  }
};

export const createShopCategory = async (
  shopCategoryData: ShopCategoryFormData
) => {
  try {
    await getCsrfToken();
    const { data } = await api.post(
      "api/admin/shop-categories",
      shopCategoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در ایجاد دسته‌بندی");
  }
};

export const updateShopCategory = async (
  shopCategoryData: ShopCategoryFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-categories/${id}`,
      shopCategoryData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در به‌روزرسانی دسته‌بندی");
  }
};

export const deleteShopCategory = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(
      `api/admin/shop-categories/delete-multiple`,
      {
        data: ids,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در حذف دسته‌بندی");
  }
};

export const changePriorityShopCategory = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      "api/admin/shop-categories/change-priority",
      {
        id,
        action,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
    throw new Error("خطای ناشناخته در تغییر اولویت دسته‌بندی");
  }
};
