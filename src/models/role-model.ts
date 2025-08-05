import { RowData } from "./row-data";

export interface Role extends RowData {
  id: number;
  level: number;
  name: string;
  title: string;
  systemic: string;
  description: string | null;
}
