import { CartItem } from "./cart";
import { CustomerDetails, OrderDetails } from "./order";

export interface CheckoutFormData {
  customerDetails: CustomerDetails;
  paymentMethod: string;
  orderType: string;
  cartItems: CartItem[];
}

export interface OrderCreationData extends OrderDetails {
  shopId?: string;
}