import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";

export const fetchShopDetails = async (shopId: string | undefined) => {
  if (!shopId) {
    console.log("No shopId provided for fetchShopDetails");
    return null;
  }

  try {
    console.log("Fetching shop details for shopId:", shopId);
    // Try food_shops collection first
    let shopDoc = await getDoc(doc(db, "food_shops", shopId));
    
    // If not found, try users collection (for shop owners)
    if (!shopDoc.exists()) {
      console.log("Shop not found in food_shops, trying users collection");
      shopDoc = await getDoc(doc(db, "users", shopId));
    }
    
    if (shopDoc.exists()) {
      const shopData = shopDoc.data();
      console.log("Shop data found:", shopData);
      return {
        name: shopData.name || shopData.shopName || 'N/A',
        telephone: shopData.contact?.phone || shopData.telephone || 'N/A',
        location: shopData.location?.address || shopData.address || 'N/A',
        ownerId: shopId // Include the ownerId in the returned object
      };
    }
    console.log("Shop document does not exist in either collection");
    return null;
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return null;
  }
};

export const fetchUserDetails = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        fullName: userData.fullName || userData.email || 'N/A',
        email: userData.email || 'N/A',
        university: userData.university || 'N/A'
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export const validateOrderData = (paymentMethod: string, orderType: string) => {
  if (!paymentMethod || !orderType) {
    toast.error("Please select both payment method and order type");
    return false;
  }
  return true;
};
