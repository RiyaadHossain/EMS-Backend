import { SortOrder } from "mongoose";

export type IPagination = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?:SortOrder;
};
