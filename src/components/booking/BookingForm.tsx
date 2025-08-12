import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { BoardingPlace } from "@/types/boardingPlaceTypes";

interface BookingFormProps {
  bookingDetails: {
    name: string;
    email: string;
    phone: string;
    price: number;
    serviceFee: number;
    checkInDate: Date;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  errors: { [key: string]: string };
  onSubmit: (e: React.FormEvent) => void;
  boardingPlace: BoardingPlace;
}

export const BookingForm = ({
  bookingDetails,
  handleChange,
  date,
  setDate,
  errors,
  onSubmit,
  boardingPlace,
}: BookingFormProps) => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create booking document
      const bookingRef = await addDoc(collection(db, "bookings"), {
        ...bookingDetails,
        checkInDate: date,
        status: "pending",
        createdAt: new Date(),
        boardingPlaceId: boardingPlace.id
      });

      // Update boarding place availability
      await updateDoc(doc(db, "boardingPlaces", boardingPlace.id), {
        isAvailable: false
      });

      // Navigate to payment page with booking details
      navigate('/boarding-checkout', {
        state: {
          boardingPlace,
          bookingDetails: {
            ...bookingDetails,
            checkInDate: date,
          },
          bookingId: bookingRef.id,
        }
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-700">Full Name</Label>
          <Input
            id="name"
            value={bookingDetails.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={cn(
              "mt-1",
              errors.name && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={bookingDetails.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={cn(
              "mt-1",
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
          <Input
            id="phone"
            value={bookingDetails.phone}
            onChange={handleChange}
            placeholder="+94 XX XXX XXXX"
            className={cn(
              "mt-1",
              errors.phone && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.checkInDate && "border-red-500 focus-visible:ring-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.checkInDate && (
            <p className="text-red-500 text-sm">{errors.checkInDate}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Continue to Payment
      </Button>
    </form>
  );
};