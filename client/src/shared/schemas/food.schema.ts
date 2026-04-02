export interface CreateProductInput {
  name: string;
  price: number;
  image: string;
  category: 'FOOD' | 'DRINK' | 'COMBO';
  description?: string;
}
export interface CreateComboInput {
  name: string;
  price: number;
  image: string;
  comboItems: { productId: string; quantity: number }[];
  description?: string;
  discountPercent?: number;
}
export interface PatchProductInput {
  name?: string;
  price?: number;
  image?: string;
  category?: 'FOOD' | 'DRINK' | 'COMBO';
  description?: string;
  isActive?: boolean;
  comboItems?: { productId: string; quantity: number }[];
  discountPercent?: number | null;
}
