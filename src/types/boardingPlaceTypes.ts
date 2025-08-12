export interface BoardingPlace {
  id: string;
  name: string;
  description: string;
  image: string;
  universities: string[];
  price: string | number;
  rating: number;
  location: string; // Made required
  amenities?: string[];
  createdAt?: any;
  address?: string;
  rules?: string[];
  ownerId?: string;
  isAvailable: boolean; // Added isAvailable property
}

export interface BookingPayment {
  type: 'advance' | 'full';
  method: 'cash' | 'card';
  amount: number;
}