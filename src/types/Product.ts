export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  imageUrl: string;
  category?: string;
}