import { MenuItem } from "@/types/menu";
import { RowData } from "./row-data";

export interface Menu extends RowData {
  id: number;
  name: string;
  title: string;
  description?: string;
  items: MenuItem[];
}
