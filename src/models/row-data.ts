export interface RowData {
  id: string | number;
  created_at?: string | Date | null; // سازگار با created_at از بک‌اند
  [key: string]: unknown;
  children?: RowData[] | undefined;
}
