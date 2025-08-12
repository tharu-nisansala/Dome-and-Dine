import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Order } from "@/types/order";
import { OrderDetailsView } from "@/components/shop/orders/OrderDetailsView";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set up real-time listener for orders
        const q = query(
          collection(db, "food_orders"),
          where("userId", "==", user.uid),
          orderBy("orderDate", "desc")
        );

        const ordersUnsubscribe = onSnapshot(
          q, 
          (querySnapshot) => {
            const ordersData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              orderDate: doc.data().orderDate?.toDate() || new Date(),
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
            setLoading(false);
          }
        );

        return () => ordersUnsubscribe();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderDetailsView key={order.id} order={order} />
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;