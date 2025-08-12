import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface OrderStatusManagerProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusManager = ({ orderId, currentStatus }: OrderStatusManagerProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOrderStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const orderRef = doc(db, "food_orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        lastUpdated: new Date()
      });
      
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={currentStatus}
        onValueChange={updateOrderStatus}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Update Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="preparing">Preparing</SelectItem>
          <SelectItem value="ready">Ready for Pickup</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};