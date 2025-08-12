export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  shopId: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopItemDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  shopId: string;
  ownerId: string;
}

export interface UpdateShopItemDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
}