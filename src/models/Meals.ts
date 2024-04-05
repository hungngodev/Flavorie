export interface MealRequest {
    ingredients: string[];
}
export interface MealResponse {
    count: number;
    hits: Array<{
        recipe: MealRequest
    }>
}