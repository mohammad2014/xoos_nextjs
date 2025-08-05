"use server";

import { api } from "./api";

export interface SocialItem {
  id: number;
  type: string;
  title: string;
  link: string;
  status?: string;
}

export const getSocial = async (): Promise<SocialItem[]> => {
  const result = await api.get("/api/social-media");
  return result.data.data;
};
