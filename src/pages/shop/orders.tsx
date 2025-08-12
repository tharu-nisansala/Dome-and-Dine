import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OrderNotificationHandler } from "@/components/shop/orders/OrderNotificationHandler";
import { OrderDetailsView } from "@/components/shop/orders/OrderDetailsView";
import { Loader2 } from "lucide-react";
import { Order } from "@/types/order";

export default function ViewOrders() {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNewOrder = (order: Order) => {
    setOrders(prevOrders => {
      // Check if order already exists
      const exists = prevOrders.some(o => o.id === order.id);
      if (!exists) {
        return [order, ...prevOrders];
      }
      return prevOrders;
    });
  };

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {user && (
        <OrderNotificationHandler
          shopOwnerId={user.uid}
          onNewOrder={handleNewOrder}
        />
      )}

      <div className="container mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderDetailsView key={order.id} order={order} />
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}