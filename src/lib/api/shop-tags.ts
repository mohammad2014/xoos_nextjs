"use server";
import { FetchParams } from "@/hooks/use-data-table-data";
import axios from "axios";
import { api, getCsrfToken } from ".";
import { ShopTagFormData } from "@/schemas/shopTagSchema";

export const getShopTags = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-tags", {
      params: { page, perPage, filters, sort, globalFilter },
    });
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const getShopTagById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-tags/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createShopTag = async (shopTagData: ShopTagFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/shop-tags", shopTagData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateShopTag = async (
  shopTagData: ShopTagFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(`api/admin/shop-tags/${id}`, shopTagData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteShopTag = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(`api/admin/shop-tags/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const changePriorityShopTag = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put("api/admin/shop-tags/change-priority", {
      id,
      action,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
