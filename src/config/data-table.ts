// تعریف تایپ برای زبان‌های مجاز
type Language = "en" | "fa" | "ar";

// تعریف اینترفیس برای ترجمه‌ها
interface Translation {
  contains: string;
  doesNotContain: string;
  is: string;
  isNot: string;
  isEmpty: string;
  isNotEmpty: string;
  isLessThan: string;
  isLessThanOrEqual: string;
  isGreaterThan: string;
  isGreaterThanOrEqual: string;
  isBetween: string;
  isRelativeToToday: string;
  isBefore: string;
  isAfter: string;
  isOnOrBefore: string;
  isOnOrAfter: string;
  hasAnyOf: string;
  hasNoneOf: string;
  asc: string;
  desc: string;
}

// تعریف دیکشنری‌های ترجمه
const translations: Record<Language, Translation> = {
  en: {
    contains: "Contains",
    doesNotContain: "Does not contain",
    is: "Is",
    isNot: "Is not",
    isEmpty: "Is empty",
    isNotEmpty: "Is not empty",
    isLessThan: "Is less than",
    isLessThanOrEqual: "Is less than or equal to",
    isGreaterThan: "Is greater than",
    isGreaterThanOrEqual: "Is greater than or equal to",
    isBetween: "Is between",
    isRelativeToToday: "Is relative to today",
    isBefore: "Is before",
    isAfter: "Is after",
    isOnOrBefore: "Is on or before",
    isOnOrAfter: "Is on or after",
    hasAnyOf: "Has any of",
    hasNoneOf: "Has none of",
    asc: "Asc",
    desc: "Desc",
  },
  fa: {
    contains: "شامل می‌شود",
    doesNotContain: "شامل نمی‌شود",
    is: "است",
    isNot: "نیست",
    isEmpty: "خالی است",
    isNotEmpty: "خالی نیست",
    isLessThan: "کمتر از",
    isLessThanOrEqual: "کمتر یا مساوی",
    isGreaterThan: "بیشتر از",
    isGreaterThanOrEqual: "بیشتر یا مساوی",
    isBetween: "بین",
    isRelativeToToday: "نسبت به امروز",
    isBefore: "قبل از",
    isAfter: "بعد از",
    isOnOrBefore: "در یا قبل از",
    isOnOrAfter: "در یا بعد از",
    hasAnyOf: "شامل هر یک از",
    hasNoneOf: "شامل هیچ‌کدام از",
    asc: "صعودی",
    desc: "نزولی",
  },
  ar: {
    contains: "يحتوي",
    doesNotContain: "لا يحتوي",
    is: "هو",
    isNot: "ليس",
    isEmpty: "فارغ",
    isNotEmpty: "غير فارغ",
    isLessThan: "أقل من",
    isLessThanOrEqual: "أقل من أو يساوي",
    isGreaterThan: "أكبر من",
    isGreaterThanOrEqual: "أكبر من أو يساوي",
    isBetween: "بين",
    isRelativeToToday: "بالنسبة لليوم",
    isBefore: "قبل",
    isAfter: "بعد",
    isOnOrBefore: "في أو قبل",
    isOnOrAfter: "في أو بعد",
    hasAnyOf: "يحتوي على أي من",
    hasNoneOf: "لا يحتوي على أي من",
    asc: "تصاعدي",
    desc: "تنازلي",
  },
};

const getLanguageFromUrl = (): Language => {
  if (typeof window === "undefined") {
    return "fa";
  }
  const path = window.location.pathname;
  const match = path.match(/^\/(en|fa|ar)\//);
  return match ? (match[1] as Language) : "fa";
};

const getTranslatedConfig = () => {
  const lang = getLanguageFromUrl();
  const dict = translations[lang] || translations.fa;

  return {
    textOperators: [
      { label: dict.contains, value: "iLike" as const },
      { label: dict.doesNotContain, value: "notILike" as const },
      { label: dict.is, value: "eq" as const },
      { label: dict.isNot, value: "ne" as const },
      { label: dict.isEmpty, value: "isEmpty" as const },
      { label: dict.isNotEmpty, value: "isNotEmpty" as const },
    ],
    numericOperators: [
      { label: dict.is, value: "eq" as const },
      { label: dict.isNot, value: "ne" as const },
      { label: dict.isLessThan, value: "lt" as const },
      { label: dict.isLessThanOrEqual, value: "lte" as const },
      { label: dict.isGreaterThan, value: "gt" as const },
      { label: dict.isGreaterThanOrEqual, value: "gte" as const },
      { label: dict.isBetween, value: "isBetween" as const },
      { label: dict.isEmpty, value: "isEmpty" as const },
      { label: dict.isNotEmpty, value: "isNotEmpty" as const },
    ],
    dateOperators: [
      { label: dict.is, value: "eq" as const },
      { label: dict.isNot, value: "ne" as const },
      { label: dict.isBefore, value: "lt" as const },
      { label: dict.isAfter, value: "gt" as const },
      { label: dict.isOnOrBefore, value: "lte" as const },
      { label: dict.isOnOrAfter, value: "gte" as const },
      { label: dict.isBetween, value: "isBetween" as const },
      { label: dict.isRelativeToToday, value: "isRelativeToToday" as const },
      { label: dict.isEmpty, value: "isEmpty" as const },
      { label: dict.isNotEmpty, value: "isNotEmpty" as const },
    ],
    selectOperators: [
      { label: dict.is, value: "eq" as const },
      { label: dict.isNot, value: "ne" as const },
      { label: dict.isEmpty, value: "isEmpty" as const },
      { label: dict.isNotEmpty, value: "isNotEmpty" as const },
    ],
    multiSelectOperators: [
      { label: dict.hasAnyOf, value: "inArray" as const },
      { label: dict.hasNoneOf, value: "notInArray" as const },
      { label: dict.isEmpty, value: "isEmpty" as const },
      { label: dict.isNotEmpty, value: "isNotEmpty" as const },
    ],
    booleanOperators: [
      { label: dict.is, value: "eq" as const },
      { label: dict.isNot, value: "ne" as const },
    ],
    sortOrders: [
      { label: dict.asc, value: "asc" as const },
      { label: dict.desc, value: "desc" as const },
    ],
    filterVariants: [
      "text",
      "number",
      "range",
      "date",
      "dateRange",
      "boolean",
      "select",
      "multiSelect",
    ] as const,
    operators: [
      "iLike",
      "notILike",
      "eq",
      "ne",
      "inArray",
      "notInArray",
      "isEmpty",
      "isNotEmpty",
      "lt",
      "lte",
      "gt",
      "gte",
      "isBetween",
      "isRelativeToToday",
    ] as const,
    joinOperators: ["and", "or"] as const,
  };
};

// تعریف dataTableConfig
export const dataTableConfig = getTranslatedConfig();

// تایپ برای dataTableConfig
export type DataTableConfig = typeof dataTableConfig;
