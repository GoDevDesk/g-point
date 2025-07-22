export interface PaginatedResultResponse<T>{
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
}