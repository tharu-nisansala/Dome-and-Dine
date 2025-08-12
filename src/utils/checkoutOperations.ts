import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Timestamp } from "firebase/firestore";
import { OrderDetails } from "@/types/order";
import { CartItem } from "@/types/cart";
import { generateOrderNumber } from "./orderUtils";
import { fetchShopDetails, fetchUserDetails } from "./checkoutUtils";

export const createOrder = async (
  cartItems: CartItem[],
  customerDetails: {
    fullName: string;
    telephone: string;
    email: string;
    address?: string;
  },
  orderType: string,
  paymentMethod: string,
  userId: string
): Promise<{ orderId: string; orderDetails: OrderDetails }> => {
  const firstItem = cartItems[0];
  const shopId = firstItem?.shopId || firstItem?.ownerId;
  
  const [shopDetails, userDetails] = await Promise.all([
    shopId ? fetchShopDetails(shopId) : null,
    userId ? fetchUserDetails(userId) : null
  ]);

  const deliveryFee = orderType === 'delivery' ? 50 : 0;
  const totalAmount = cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0) + deliveryFee;

  const now = Timestamp.now();

  const orderData: OrderDetails = {
    id: generateOrderNumber(),
    orderNumber: generateOrderNumber(),
    items: cartItems,
    totalAmount,
    paymentMethod,
    orderType,
    orderDate: now.toDate(),
    createdAt: now,
    userId: userId,
    customerName: customerDetails.fullName,
    deliveryFee,
    status: 'pending',
    paymentDetails: {
      type: 'full',
      method: paymentMethod as 'card' | 'cash',
      amount: totalAmount,
      date: now.toDate(),
      transactionId: `TRX-${Date.now()}`,
      customerName: customerDetails.fullName,
      customerEmail: customerDetails.email
    },
    customerDetails: {
      fullName: customerDetails.fullName,
      telephone: customerDetails.telephone,
      email: customerDetails.email,
      ...(orderType === 'delivery' ? { address: customerDetails.address } : {})
    },
    ...(userDetails && { 
      userDetails: {
        fullName: userDetails.fullName,
        email: userDetails.email,
        university: userDetails.university
      }
    }),
    ...(shopDetails && { 
      shopDetails: {
        ownerId: shopId!,
        name: shopDetails.name,
        telephone: shopDetails.telephone,
        location: shopDetails.location
      }
    })
  };

  const docRef = await addDoc(collection(db, "food_orders"), orderData);
  return { orderId: docRef.id, orderDetails: orderData };
};