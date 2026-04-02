export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems?: number;
    total?: number;
    totalPages: number;
    currentPage?: number;
    page?: number;
    itemsPerPage?: number;
    limit?: number;
  };
}
