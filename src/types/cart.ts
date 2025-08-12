export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  shopId?: string;
  ownerId?: string;
  itemId?: string;
}

export interface OrderCartItem {
  id: string;
  itemId: string;
  quantity: number;
}