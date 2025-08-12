import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface User {
  id: string;
  email: string;
  userType: string;
  createdAt: Timestamp;
  fullName: string;
  university?: string;
}

interface Shop {
  id: string;
  name: string;
  ownerId: string;
  status: string;
  createdAt: Timestamp;
}

interface BaseOrder {
  id: string;
  orderNumber: string;
  orderDate: Timestamp;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: Timestamp;
  userId: string;
}

interface FoodOrder extends BaseOrder {
  type: 'food';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface BoardingOrder extends BaseOrder {
  type: 'boarding';
  boardingDetails: {
    roomId: string;
    checkIn: Timestamp;
    checkOut: Timestamp;
  };
}

type Order = FoodOrder | BoardingOrder;

export const useAdminData = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    }
  });

  const { data: shops, isLoading: shopsLoading } = useQuery({
    queryKey: ["admin-shops"],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, "foodShops"));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shop[];
    }
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log("Fetching orders...");
      const [foodOrdersSnapshot, boardingOrdersSnapshot] = await Promise.all([
        getDocs(collection(db, "food_orders")),
        getDocs(collection(db, "boarding_orders"))
      ]);

      console.log("Food orders count:", foodOrdersSnapshot.size);
      console.log("Boarding orders count:", boardingOrdersSnapshot.size);

      const now = Timestamp.now();

      const foodOrders = foodOrdersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderNumber: data.orderNumber || `F-${doc.id.slice(0, 6)}`,
          orderDate: data.orderDate || now,
          customerName: data.customerName || 'Unknown Customer',
          status: data.status || 'pending',
          totalAmount: data.totalAmount || 0,
          createdAt: data.createdAt || now,
          userId: data.userId || 'unknown',
          type: 'food' as const,
          items: data.items || []
        } as FoodOrder;
      });

      const boardingOrders = boardingOrdersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          orderNumber: data.orderNumber || `B-${doc.id.slice(0, 6)}`,
          orderDate: data.orderDate || now,
          customerName: data.customerName || 'Unknown Customer',
          status: data.status || 'pending',
          totalAmount: data.totalAmount || 0,
          createdAt: data.createdAt || now,
          userId: data.userId || 'unknown',
          type: 'boarding' as const,
          boardingDetails: {
            roomId: data.boardingDetails?.roomId || '',
            checkIn: data.boardingDetails?.checkIn || now,
            checkOut: data.boardingDetails?.checkOut || now
          }
        } as BoardingOrder;
      });

      console.log("Total orders processed:", [...foodOrders, ...boardingOrders].length);
      return [...foodOrders, ...boardingOrders];
    }
  });

  return {
    users: users || [],
    shops: shops || [],
    orders: orders || [],
    isLoading: usersLoading || shopsLoading || ordersLoading,
  };
};