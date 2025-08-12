import { db } from "@/firebase/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

export const deleteItem = async (collectionName: string, itemId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, itemId));
    toast.success(`${collectionName} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting ${collectionName}:`, error);
    toast.error(`Failed to delete ${collectionName}`);
    throw error;
  }
};