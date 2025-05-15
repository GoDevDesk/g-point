export interface Plan {
    id: number,
    userId: number,
    productId?: number,
    price: number,
    active: boolean
}