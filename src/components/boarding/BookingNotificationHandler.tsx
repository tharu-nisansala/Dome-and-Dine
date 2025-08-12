import { useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Booking } from "@/types/booking";
import { toast } from "sonner";

interface BookingNotificationHandlerProps {
  shopOwnerId: string;
  onNewBooking?: (booking: Booking) => void;
}

export const BookingNotificationHandler = ({
  shopOwnerId,
  onNewBooking,
}: BookingNotificationHandlerProps) => {
  useEffect(() => {
    if (!shopOwnerId) return;

    console.log("Setting up booking notifications for shop owner:", shopOwnerId);

    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("boardingPlace.ownerId", "==", shopOwnerId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            const booking: Booking = {
              id: change.doc.id,
              customerName: data.customerName || "",
              checkInDate: data.checkInDate?.toDate() || new Date(),
              status: data.status || "pending",
              boardingPlace: data.boardingPlace,
              createdAt: data.createdAt?.toDate() || new Date(),
              totalAmount: data.totalAmount || 0,
              paymentType: data.paymentType || "advance",
              userId: data.userId,
              email: data.email || ""
            };
            
            console.log("New booking received:", booking);
            
            toast.success("New booking received!", {
              description: `${booking.customerName} has made a booking.`,
            });

            if (onNewBooking) {
              onNewBooking(booking);
            }
          }
        });
      },
      (error) => {
        console.error("Error listening to bookings:", error);
        toast.error("Failed to listen to new bookings");
      }
    );

    return () => {
      console.log("Cleaning up booking notifications listener");
      unsubscribe();
    };
  }, [shopOwnerId, onNewBooking]);

  return null;
};