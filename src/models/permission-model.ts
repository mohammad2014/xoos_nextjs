import { RowData } from "./row-data";

export interface Permission extends RowData {
  id: number;
  name: string;
  title: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}
