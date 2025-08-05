export interface DataTableData<TData> {
  data: TData[];
  total?: number;
  per_page?: number;
  current_page?: number;
}
