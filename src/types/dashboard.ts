export interface ShopData {
  uid: string;
  shopName: string;
  shopCategory: string;
  businessRegistrationNumber: string;
  shopAddress: string;
  telephone: string;
  email: string;
  profileUrl?: string;
}

export interface DashboardStats {
  totalFoodShops: number;
  totalBoardingPlaces: number;
  activeOrders: number;
  bookedBoardings: number;
}