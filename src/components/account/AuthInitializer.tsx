import type React from "react";
import { cookies } from "next/headers";
import {
  AuthProvider,
  type AuthState,
  type User,
} from "@/contexts/authContext";

export async function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  let initialState: AuthState = {
    user: null,
    token: null,
    role: null,
    permissions: [],
    isAuthenticated: false,
    isLoading: false, // Initial state is not loading, as it's already loaded on server
  };

  try {
    const token = cookieStore.get("token")?.value || null;
    const userCookie = cookieStore.get("user")?.value;
    const role = cookieStore.get("role")?.value || null;
    const permissionsCookie = cookieStore.get("permissions")?.value;

    let user;

    if (userCookie && userCookie !== "undefined") {
      console.log(typeof userCookie);
      user = JSON.parse(userCookie) as User;
    }

    let permissions: string[] = [];
    if (permissionsCookie && permissionsCookie !== "undefined") {
      permissions = JSON.parse(permissionsCookie) as string[];
    }

    if (token && user && role && permissions.length > 0) {
      initialState = {
        user,
        token,
        role,
        permissions,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error("Error reading auth cookies on server:", error);
    // Fallback to default unauthenticated state
  }

  return <AuthProvider initialState={initialState}>{children}</AuthProvider>;
}
