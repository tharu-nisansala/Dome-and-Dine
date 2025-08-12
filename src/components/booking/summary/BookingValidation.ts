import { auth } from "../../../firebase/firebaseConfig";
import { BoardingPlace } from "@/types/boardingPlaceTypes";
import { toast } from "sonner";

export const validateBookingData = (boardingPlace: BoardingPlace | undefined) => {
  if (!auth.currentUser) {
    console.log("Authentication error: User not logged in");
    toast.error("Please login to make a booking");
    return false;
  }

  if (!boardingPlace?.id) {
    console.error("Invalid boarding place data:", boardingPlace);
    toast.error("Invalid boarding place data. Please try again.");
    return false;
  }

  return true;
};

export const handleBookingError = (error: unknown) => {
  console.error("Error saving booking:", error);
  
  if (error instanceof Error) {
    toast.error(`Failed to save booking: ${error.message}`);
  } else {
    toast.error("Failed to save booking. Please try again.");
  }
};