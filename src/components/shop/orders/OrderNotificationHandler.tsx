import { useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { Order } from "@/types/order";

interface OrderNotificationHandlerProps {
  shopOwnerId: string;
  onNewOrder: (order: Order) => void;
  onError?: (error: any) => void;
}

export const OrderNotificationHandler = ({ 
  shopOwnerId, 
  onNewOrder,
  onError 
}: OrderNotificationHandlerProps) => {
  useEffect(() => {
    if (!shopOwnerId) {
      console.log("No shop owner ID provided");
      return;
    }

    console.log("Setting up order notifications for shop owner:", shopOwnerId);
    
    // Create a query for new orders
    const ordersQuery = query(
      collection(db, "food_orders"),
      where("shopDetails.ownerId", "==", shopOwnerId),
      orderBy("orderDate", "desc")
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      ordersQuery, 
      (snapshot) => {
        try {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const newOrder = {
                id: change.doc.id,
                ...change.doc.data(),
                orderDate: change.doc.data().orderDate?.toDate() || new Date(),
              } as Order;
              
              console.log("New order received:", newOrder);
              
              // Show notification for new order
              toast.success("New Order Received!", {
                description: `Order #${newOrder.orderNumber} - ${newOrder.customerName}`,
                duration: 5000,
              });
              
              // Pass the new order to parent component
              onNewOrder(newOrder);
            }
          });
        } catch (error) {
          console.error("Error processing order changes:", error);
          onError?.(error);
        }
      },
      (error) => {
        console.error("Error in order notifications:", error);
        if (error.code === 'failed-precondition' && error.message.includes('requires an index')) {
          toast.error(
            "Database index required. Please contact support to enable order tracking.",
            { duration: 5000 }
          );
        } else {
          toast.error("Failed to setup order notifications");
        }
        onError?.(error);
      }
    );

    return () => unsubscribe();
  }, [shopOwnerId, onNewOrder, onError]);

  return null;
};