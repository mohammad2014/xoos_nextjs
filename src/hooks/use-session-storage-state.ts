"use client";
import { useState, useEffect } from "react";

export default function useSessionStorageState<T>(
  key: string,
  initialValue: T
) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch (error) {
      console.error("useSessionStorageState error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("useSessionStorageState write error:", error);
    }
  }, [key, state]);

  return [state, setState] as const;
}
