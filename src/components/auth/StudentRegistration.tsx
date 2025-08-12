import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { User } from "@/types/user";

export const handleStudentRegistration = async (userData: Partial<User>, uid: string) => {
  await addDoc(collection(db, "users"), {
    ...userData,
    uid,
    status: 'active'
  });
};