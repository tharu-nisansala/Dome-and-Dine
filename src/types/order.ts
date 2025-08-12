import { Timestamp } from 'firebase/firestore';

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date | Timestamp;
  customerName: string;
  orderType: string;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  deliveryFee?: number;
  paymentDetails: PaymentDetails;
  userId?: string;
  customerDetails?: CustomerDetails;
  userDetails?: UserDetails;
  shopDetails?: ShopDetails;
  createdAt: Date | Timestamp;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ownerId?: string;
}

export interface PaymentDetails {
  type: 'advance' | 'full';
  method: 'card' | 'cash';
  amount: number;
  date: Date | Timestamp;
  transactionId: string;
  customerName: string;
  customerEmail: string;
}

export interface CustomerDetails {
  fullName: string;
  telephone: string;
  email: string;
  address?: string;
}

export interface UserDetails {
  fullName: string;
  university?: string;
  email?: string;
}

export interface ShopDetails {
  name: string;
  telephone: string;
  location: string;
  ownerId: string;
}

export interface OrderDetails extends Order {
  boardingPlace?: {
    name: string;
    location: string;
    price: string | number;
    ownerId?: string;
  };
}