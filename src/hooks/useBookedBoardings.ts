import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { BoardingPlace } from "@/types/boardingPlaceTypes";

export const useBookedBoardings = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ["booked-boardings", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      
      const boardingQuery = query(
        collection(db, "boardingPlaces"),
        where("ownerId", "==", ownerId),
        where("isAvailable", "==", false)
      );
      
      const snapshot = await getDocs(boardingQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BoardingPlace[];
    },
    enabled: !!ownerId
  });
};