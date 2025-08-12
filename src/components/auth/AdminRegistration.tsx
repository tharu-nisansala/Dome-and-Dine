import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { generateAdminCode } from "@/utils/adminUtils";
import { toast } from "sonner";
import { User } from "@/types/user";

export const handleAdminRegistration = async (userData: Partial<User>, uid: string) => {
  const adminCode = generateAdminCode();
  
  await addDoc(collection(db, "admins"), {
    ...userData,
    uid,
    isVerified: true,
    verificationDate: new Date(),
    verificationCode: adminCode,
    status: 'active'
  });

  toast.success(`Admin account created! Your verification code is: ${adminCode}`);
  toast.info("Please save this code. You'll need it to log in.");
};