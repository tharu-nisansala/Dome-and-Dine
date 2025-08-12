import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const handleShopOwnerRegistration = async (userData: any, uid: string) => {
  const shopData = {
    ...userData,
    uid,
    shopStatus: 'pending',
    isVerified: false,
    status: 'active',
    profileUrl: userData.profileUrl || ''
  };
  await addDoc(collection(db, "shop_owners"), shopData);
};