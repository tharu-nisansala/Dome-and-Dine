export interface FoodShop {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: string;
  universities: string[];
  ownerId: string;
  isOpen: boolean;
  location: {
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  businessHours: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  categories: string[];
  createdAt?: Date;
  updatedAt?: Date;
}