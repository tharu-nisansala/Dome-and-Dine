import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Order } from "@/types/order";
import { toast } from "sonner";

interface FoodOrder extends Order {
  type: 'food';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface BoardingOrder extends Order {
  type: 'boarding';
  boardingDetails: {
    roomId: string;
    checkIn: Timestamp;
    checkOut: Timestamp;
  };
}

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      try {
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
            orderDate: data.orderDate || data.createdAt || now,
            customerName: data.customerName || 'Unknown Customer',
            status: data.status || 'pending',
            totalAmount: data.totalAmount || 0,
            items: data.items || [],
            type: 'food' as const,
            userId: data.userId || 'unknown',
            createdAt: data.createdAt || now,
            orderType: 'food',
            paymentMethod: data.paymentMethod || 'cash',
            paymentDetails: data.paymentDetails || {
              type: 'full',
              method: 'cash',
              amount: data.totalAmount || 0,
              date: data.createdAt || now,
              transactionId: doc.id,
              customerName: data.customerName || 'Unknown Customer',
              customerEmail: data.customerEmail || ''
            },
            customerDetails: data.customerDetails || {
              fullName: data.customerName || 'Unknown Customer',
              telephone: '',
              email: data.customerEmail || ''
            },
            userDetails: data.userDetails || {
              fullName: data.customerName || 'Unknown Customer',
              email: data.customerEmail || ''
            },
            shopDetails: data.shopDetails || {
              name: '',
              telephone: '',
              location: '',
              ownerId: ''
            }
          } as FoodOrder;
        });

        const boardingOrders = boardingOrdersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            orderNumber: data.orderNumber || `B-${doc.id.slice(0, 6)}`,
            orderDate: data.orderDate || data.createdAt || now,
            customerName: data.customerName || 'Unknown Customer',
            status: data.status || 'pending',
            totalAmount: data.totalAmount || 0,
            type: 'boarding' as const,
            userId: data.userId || 'unknown',
            createdAt: data.createdAt || now,
            orderType: 'boarding',
            paymentMethod: data.paymentMethod || 'cash',
            items: [],
            boardingDetails: {
              roomId: data.boardingDetails?.roomId || '',
              checkIn: data.boardingDetails?.checkIn || now,
              checkOut: data.boardingDetails?.checkOut || now
            },
            paymentDetails: data.paymentDetails || {
              type: 'full',
              method: 'cash',
              amount: data.totalAmount || 0,
              date: data.createdAt || now,
              transactionId: doc.id,
              customerName: data.customerName || 'Unknown Customer',
              customerEmail: data.customerEmail || ''
            },
            customerDetails: data.customerDetails || {
              fullName: data.customerName || 'Unknown Customer',
              telephone: '',
              email: data.customerEmail || ''
            },
            userDetails: data.userDetails || {
              fullName: data.customerName || 'Unknown Customer',
              email: data.customerEmail || ''
            },
            shopDetails: data.shopDetails || {
              name: '',
              telephone: '',
              location: '',
              ownerId: ''
            }
          } as BoardingOrder;
        });

        console.log("Total orders processed:", [...foodOrders, ...boardingOrders].length);

        return {
          foodOrders,
          boardingOrders,
          totalOrders: foodOrders.length + boardingOrders.length,
          totalRevenue: [...foodOrders, ...boardingOrders].reduce(
            (acc, order) => acc + (Number(order.totalAmount) || 0),
            0
          )
        };
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
        throw error;
      }
    }
  });
};