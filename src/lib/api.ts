"use server";
import { UserFormData } from "@/schemas/userSchema";
import { UpdateUserFormData } from "@/schemas/userSchema";
import { PasswordFormData } from "@/schemas/passwordSchema";
import { SliderFormData } from "@/schemas/sliderSchema";
import { WidgetFormData } from "@/schemas/widgetSchema";
import { Menu } from "@/types/menu";
import axios from "axios";
import { cookies } from "next/headers";
import { SocialFormData } from "@/schemas/socialSchema";
import { FetchParams } from "@/hooks/use-data-table-data";

export const api = axios.create({
  baseURL: "https://srv.xoos.ir",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en",
  },
});

api.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCsrfToken = async () => {
  const response = await api.get("/sanctum/csrf-cookie");
  return response;
};

export interface Slide {
  title: string;
  coding: string;
  image: number;
  priority: number;
  image_info: {
    id: number;
    url: string;
    description: string;
  };
}

export const getHomeSliderMain = async (): Promise<Slide[]> => {
  const response = await api.get("/api/sliders/slider_main");
  return response.data.data.items;
};

//? PUBLIC_APIS
export const getCities = async () => {
  const { data } = await api.get("/api/cities");
  return data;
};

//?UPLOAD ATTACHMENT
export const uploadAttachment = async (file: File, description?: string) => {
  try {
    await getCsrfToken();
    const formData = new FormData();

    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const { data } = await api.post("/api/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "خطا در آپلود فایل.");
    }
    throw new Error("خطای غیرمنتظره در آپلود فایل رخ داد.");
  }
};

//? VERIFY
export const verifyEmail = async (status: number, id: number) => {
  try {
    await getCsrfToken();
    console.log(status, id);

    const payload = { status: status };
    console.log(payload);

    const { data } = await api.patch(
      `/api/admin/users/${id}/verify-email`,
      payload
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || { message: "خطای ناشناخته" };
      return { ...errData, status: 0 };
    }
    return { status: 0, message: "خطای ناشناخته در سرور" };
  }
};
export const verifyMobile = async (status: number, id: number) => {
  try {
    await getCsrfToken();
    console.log(status, id);

    const payload = { status: status };
    console.log(payload);

    const { data } = await api.patch(
      `/api/admin/users/${id}/verify-mobile`,
      payload
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data || { message: "خطای ناشناخته" };
      return { ...errData, status: 0 }; // افزودن status: 0 برای خطاها
    }
    return { status: 0, message: "خطای ناشناخته در سرور" };
  }
};

//? ROLES
export const getRoles = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/roles", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  console.log(data);

  return data;
};
export const getRolesList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/roles/list");
  return data;
};
export const updateRole = async (roleData: {
  id: number;
  name: string;
  title: string;
  level: string;
  systemic: "yes" | "no";
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { id, ...rest } = roleData;
    const { data } = await api.put(`api/admin/roles/${id}`, rest);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createRole = async (roleData: {
  name: string;
  title: string;
  level: string;
  systemic: "yes" | "no";
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/roles", roleData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteRole = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/roles/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};

//? PERMISSIONS
export const getPermissions = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/permissions", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};
export const updatePermission = async (permissionData: {
  id: number;
  name: string;
  title: string;
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { id, ...rest } = permissionData;
    const { data } = await api.put(`api/admin/roles/${id}`, rest);
    console.log(data);

    return data;
  } catch {
    console.log("error");
  }
};
export const createPermissions = async (permissionData: {
  name: string;
  title: string;
  description?: string | undefined;
}) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("api/admin/permissions", permissionData);

    return data;
  } catch {
    console.log("error");
  }
};
export const deletePermission = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/permissions/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
//? ROLE_PERMISSIONS
export const getRolesPermissions = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/permissions");
  return data;
};
export const getRolePermissionById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/roles/${id}/permissions`);
  return data;
};
export const updateRolePermissions = async (
  roleId: number,
  permissionIds: number[]
) => {
  await getCsrfToken();
  const payload = {
    role_id: roleId,
    permission_ids: permissionIds,
  };

  const { data } = await api.post("api/admin/roles-permissions", payload);
  return data;
};
//? USERS
export const getUsers = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  // console.log(page, perPage, filters, sort);

  const params = {
    page,
    perPage,
    filters: Array.isArray(filters) ? JSON.stringify(filters) : "[]",
    sort: Array.isArray(sort) ? JSON.stringify(sort) : "[]",
    globalFilter,
  };

  const { data } = await api.get("api/admin/users", {
    params,
  });
  console.log(data);
  return data;
};
export const getUserById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/users/${id}`);

  return data;
};
export const updateUser = async (userData: UpdateUserFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/users/${id}`, userData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createUser = async (userData: UserFormData) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("/api/admin/users", userData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteUser = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };
    console.log(ids);
    const { data } = await api.delete(`api/admin/users/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
export const changeStatusUser = async (status: string, id: number) => {
  try {
    await getCsrfToken();
    console.log(status);

    const { data } = await api.patch(`api/admin/users/${id}/change-status`, {
      status,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const changePassword = async (
  userData: PasswordFormData,
  id: number
) => {
  try {
    await getCsrfToken();

    const { data } = await api.patch(
      `api/admin/users/${id}/change-password`,
      userData
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

//?SLIDERS
export const getSliders = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/sliders", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};
export const getSliderById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/sliders/${id}`);
  return data;
};
export const updateSlider = async (sliderData: SliderFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/sliders/${id}`, sliderData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createSlider = async (sliderData: SliderFormData) => {
  try {
    console.log("sliderData:", sliderData);

    await getCsrfToken();
    const { data } = await api.post("/api/admin/sliders", sliderData);
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteSlider = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(`api/admin/sliders/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
//?MENUS
export const getMenus = async ({
  page = 1,
  perPage = 10,
  filters = [],
  sort = [],
  globalFilter,
}: FetchParams) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/menus", {
    params: { page, perPage, filters, sort, globalFilter },
  });
  return data;
};
export const getMenuById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/menus/${id}`);
  return data;
};
export const deleteMenu = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(`api/admin/menus/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createMenus = async (menuData: Menu) => {
  try {
    await getCsrfToken();
    const { data } = await api.post(`api/admin/menus`, menuData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};
export const updateMenus = async (menuData: Menu, id: number | undefined) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/menus/${id}`, menuData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

//?WIDGETS
export const getWidgets = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets");
  return data;
};
export const getWidgetsTemplateList = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets/templates/list");
  return data.data;
};
export const getWidgetsTemplate = async () => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/widgets/templates");
  return data.data;
};
export const getWidgetById = async (id: number) => {
  await getCsrfToken();
  const { data } = await api.get(`api/admin/widgets/${id}`);
  return data.data;
};
export const updateWidget = async (widgetData: WidgetFormData, id: number) => {
  try {
    await getCsrfToken();

    const { data } = await api.put(`api/admin/widgets/${id}`, widgetData);
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const createWidget = async (widgetData: WidgetFormData) => {
  try {
    console.log("widgetData:", widgetData);

    await getCsrfToken();
    const { data } = await api.post("/api/admin/widgets", widgetData);
    console.log("data", data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const deleteWidget = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(`api/admin/widgets/delete-multiple`, {
      data: ids,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};

export const changePriorityWidget = async (
  id: number,
  action: "up" | "down"
) => {
  https: try {
    await getCsrfToken();
    const { data } = await api.put("api/admin/widgets/update-priority", {
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

//?SOCIALS
export const getSocialMedias = async ({
  page = 1,
  perPage = 10,
  filters = [],
}) => {
  await getCsrfToken();
  const { data } = await api.get("api/admin/social-media", {
    params: { page, perPage, filters },
  });
  return data;
};
export const createSocailMedia = async (socialMediaData: SocialFormData) => {
  try {
    console.log("socialMediaData:", socialMediaData);

    await getCsrfToken();
    const { data } = await api.post("/api/admin/social-media", socialMediaData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
export const updateSocailMedia = async (
  socialMediaData: SocialFormData,
  id: number
) => {
  try {
    console.log("socialMediaData:", socialMediaData);

    await getCsrfToken();
    const { data } = await api.put(
      `/api/admin/social-media/${id}`,
      socialMediaData
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export const deleteSocialMedia = async (id: Array<number>) => {
  try {
    await getCsrfToken();
    const ids = { ids: id };

    const { data } = await api.delete(
      `api/admin/social-media/delete-multiple`,
      {
        data: ids,
      }
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);

      const errData = error.response?.data;
      return errData;
    }
  }
};

export const changePrioritySocialMedia = async (
  id: number,
  action: "up" | "down"
) => {
  try {
    console.log(id, action);

    await getCsrfToken();
    const { data } = await api.put("api/admin/social-media/change-priority", {
      id,
      action,
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
