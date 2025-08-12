import { BoardingPlace } from "./boardingPlaceTypes";

export interface Booking {
  id: string;
  customerName: string;
  checkInDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  boardingPlace: BoardingPlace;
  createdAt: Date;
  totalAmount: number;
  paymentType: 'advance' | 'full';
  userId: string;
  email: string;
}