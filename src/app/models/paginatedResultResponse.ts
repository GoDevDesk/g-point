export interface PaginatedResultResponse<T>{
    items: T[];        // Lista de elementos
    totalItems: number; // Total de elementos disponibles
    page: number;       // Página actual
    pageSize: number;   // Tamaño de página
}