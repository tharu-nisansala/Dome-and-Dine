import { useEffect } from "react";
import { clearUserCart, updateFoodStock } from "@/utils/orderUtils";
import { toast } from "sonner";
import { CartItem, OrderCartItem } from "@/types/cart";

interface PostOrderHandlerProps {
  userId: string;
  orderItems: CartItem[];
  onComplete: () => void;
}

export const PostOrderHandler = ({ userId, orderItems, onComplete }: PostOrderHandlerProps) => {
  useEffect(() => {
    const handlePostOrder = async () => {
      try {
        // Clear cart items
        await clearUserCart(userId);
        
        // Convert CartItems to OrderCartItems
        const stockUpdates: OrderCartItem[] = orderItems.map(item => ({
          id: item.id,
          itemId: item.itemId || item.id, // Fallback to id if itemId is not present
          quantity: item.quantity
        }));
        
        console.log("Stock updates to be processed:", stockUpdates);
        await updateFoodStock(stockUpdates);
        
        onComplete();
      } catch (error) {
        console.error("Error in post-order processing:", error);
        toast.error("There was an issue processing your order");
      }
    };

    handlePostOrder();
  }, [userId, orderItems, onComplete]);

  return null;
};