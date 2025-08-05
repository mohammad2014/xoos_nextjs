import { api } from "./api";

export const getWidgets = async () => {
  try {
    const response = await api.get("/api/widgets");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching widgets:", error);
    return [];
  }
};
