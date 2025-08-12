import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { OrderDetailsView } from "@/components/shop/orders/OrderDetailsView";
import { ShoppingBag } from "lucide-react";
import { Order } from "@/types/order";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface FoodOrdersCardProps {
  ownerId: string;
}

export function FoodOrdersCard({ ownerId }: FoodOrdersCardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) {
      console.log("No owner ID provided");
      setLoading(false);
      return;
    }

    console.log("Setting up orders listener for owner:", ownerId);
    
    // Query orders where shopDetails.ownerId matches the current owner's ID
    const ordersQuery = query(
      collection(db, "food_orders"),
      where("shopDetails.ownerId", "==", ownerId),
      orderBy("orderDate", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        try {
          const ordersData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              orderDate: data.orderDate instanceof Timestamp 
                ? data.orderDate.toDate() 
                : new Date(data.orderDate),
              orderNumber: data.orderNumber || `ORD-${doc.id.slice(0, 8).toUpperCase()}`
            } as Order;
          });
          
          console.log("Fetched orders:", ordersData);
          setOrders(ordersData);
          setError(null);
          setLoading(false);
        } catch (error) {
          console.error("Error processing orders:", error);
          setError("Error loading orders. Please try again.");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        toast.error("Failed to load orders");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ownerId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Recent Food Orders</CardTitle>
          <ShoppingBag className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-gray-500">
              {error}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderDetailsView key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}