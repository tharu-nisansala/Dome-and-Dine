export interface BoardingPlace {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'boarding';
  image: string;
  rating: number;
  universities: string[];
  ownerId: string;
  createdAt: Date;
  location: string;
  isAvailable: boolean;
}

export interface BoardingPlaceFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  rating: string;
  universities: string[];
  location: string;
}