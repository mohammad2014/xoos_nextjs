export function useDirection(lang: string) {
  const language = ["fa", "ar"];

  const direction = language.includes(lang) ? "right" : "left";

  return direction;
}
