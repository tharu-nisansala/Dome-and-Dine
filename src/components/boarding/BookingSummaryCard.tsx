import { Card } from "@/components/ui/card";
import { BoardingPlace } from "@/types/boardingPlaceTypes";

interface BookingSummaryCardProps {
  boardingPlace: BoardingPlace;
  bookingDetails: {
    customerName: string;
    checkInDate: string | Date;
    totalPrice: number;
  };
}

export const BookingSummaryCard = ({ boardingPlace, bookingDetails }: BookingSummaryCardProps) => {
  const formatPrice = (price: number) => {
    return price?.toFixed(2) || "0.00";
  };

  return (
    <Card className="p-6 space-y-4 shadow-lg bg-gray-50 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <img 
                src={boardingPlace.image} 
                alt={boardingPlace.name} 
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800 hover:text-primary transition-colors">
                {boardingPlace.name}
              </p>
              <p className="text-sm text-gray-500">{bookingDetails.customerName}</p>
              <p className="text-sm text-gray-500">
                Check-in: {new Date(bookingDetails.checkInDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">Rs. {formatPrice(bookingDetails.totalPrice)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};