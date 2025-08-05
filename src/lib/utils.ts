import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to interpolate variables in translation strings
export function interpolate(
  template: string,
  variables: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key]?.toString() || match;
  });
}

// // Helper function to get nested translation
// export function getNestedTranslation(obj, path: string): string {
//   console.log(obj);

//   return path.split(".").reduce((current, key) => current?.[key], obj) || path;
// }
