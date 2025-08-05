"use server";
import { ShopGroupFormData } from "@/schemas/shopGroupSchema";
import { FetchParams } from "@/hooks/use-data-table-data";
import axios from "axios";
import { api, getCsrfToken } from ".";

export const getShopGroups = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  try {
    await getCsrfToken();
    const { data } = await api.get("api/admin/shop-groups", {
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

export const getShopGroupById = async (id: number) => {
  try {
    await getCsrfToken();
    const { data } = await api.get(`api/admin/shop-groups/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const createShopGroup = async (shopGroupData: ShopGroupFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/shop-groups", shopGroupData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const updateShopGroup = async (
  shopGroupData: ShopGroupFormData,
  id: number
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put(
      `api/admin/shop-groups/${id}`,
      shopGroupData
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteShopGroup = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    const { data } = await api.delete(`api/admin/shop-groups/delete-multiple`, {
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

export const changePriorityShopGroup = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    await getCsrfToken();
    const { data } = await api.put("api/admin/shop-groups/change-priority", {
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
