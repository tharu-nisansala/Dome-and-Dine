import { collection, deleteDoc, doc, getDocs, query, updateDoc, where, increment } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { format } from 'date-fns';
import { toast } from "sonner";

export const generateOrderNumber = () => {
  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

export const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toFixed(2)}`;
};

export const clearUserCart = async (userId: string) => {
  try {
    console.log("Clearing cart for user:", userId);
    const cartRef = collection(db, "cart_items");
    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => {
      console.log("Deleting cart item:", doc.id);
      return deleteDoc(doc.ref);
    });
    
    await Promise.all(deletePromises);
    console.log("Cart cleared successfully");
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    toast.error("Failed to clear cart");
    return false;
  }
};

export const updateFoodStock = async (items: Array<{ itemId: string; quantity: number }>) => {
  try {
    console.log("Updating stock for items:", items);
    
    // Update items one by one to avoid concurrent modifications
    for (const item of items) {
      const itemRef = doc(db, "shopItems", item.itemId);
      console.log(`Updating stock for item ${item.itemId} by -${item.quantity}`);
      
      await updateDoc(itemRef, {
        stock: increment(-item.quantity)
      });
    }
    
    console.log("Stock updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating stock:", error);
    toast.error("Failed to update stock");
    return false;
  }
};