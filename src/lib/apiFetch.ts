"use server";

import { cookies } from "next/headers";
import { getCsrfToken } from "./api";

const BASE_URL = "https://srv.xoos.ir";

export async function apiFetch(
  path: string,
  options: RequestInit & { tag?: string } = {}
) {
  await getCsrfToken();

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers,
    next: options.tag ? { tags: [options.tag] } : undefined,
  };

  const res = await fetch(`${BASE_URL}${path}`, fetchOptions);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("apiFetch error:", res.status, error);
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}
