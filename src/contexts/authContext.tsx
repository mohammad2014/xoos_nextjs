"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { setCookie, deleteCookie } from "cookies-next";

// Types
export interface User {
  id: number;
  full_name: string;
  mobile: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  user: User;
  token: string;
  role: string;
  permissions: string[];
  expires_at: string;
  remember_me: boolean;
}

type AuthAction =
  | { type: "SET_AUTH"; payload: LoginData }
  | { type: "CLEAR_AUTH" }
  | { type: "SET_LOADING"; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        permissions: action.payload.permissions,
        isAuthenticated: true,
        isLoading: false,
      };
    case "CLEAR_AUTH":
      return {
        ...initialState,
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
}

// Context
interface AuthContextType {
  state: AuthState;
  setAuth: (data: LoginData) => void;
  clearAuth: () => void;
  hasPermission: (
    permissions: string | string[],
    mode?: "all" | "any"
  ) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
  initialState?: AuthState;
}

export function AuthProvider({
  children,
  initialState: serverInitialState,
}: AuthProviderProps) {
  const [state, dispatch] = useReducer(
    authReducer,
    serverInitialState || initialState
  );

  const setAuth = (data: LoginData) => {
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    const maxAgeInSeconds = Math.floor(
      (expiresAt.getTime() - now.getTime()) / 1000
    );

    setCookie("token", data.token, { maxAge: maxAgeInSeconds });
    setCookie("user", JSON.stringify(data.user), { maxAge: maxAgeInSeconds });
    setCookie("role", data.role, { maxAge: maxAgeInSeconds });
    setCookie("permissions", JSON.stringify(data.permissions), {
      maxAge: maxAgeInSeconds,
    });

    dispatch({ type: "SET_AUTH", payload: data });
  };

  const clearAuth = () => {
    deleteCookie("token");
    deleteCookie("user");
    deleteCookie("role");
    deleteCookie("permissions");
    dispatch({ type: "CLEAR_AUTH" });
  };

  const hasPermission = (
    permissions: string | string[],
    mode: "all" | "any" = "any"
  ): boolean => {
    const permissionArray = Array.isArray(permissions)
      ? permissions
      : [permissions];
    if (mode === "all") {
      return permissionArray.every((perm) => state.permissions.includes(perm));
    }
    return permissionArray.some((perm) => state.permissions.includes(perm));
  };

  const hasRole = (role: string): boolean => {
    return state.role === role;
  };

  const value: AuthContextType = {
    state,
    setAuth,
    clearAuth,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
