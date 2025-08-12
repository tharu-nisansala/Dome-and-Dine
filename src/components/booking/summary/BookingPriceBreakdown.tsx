import { Card } from "@/components/ui/card";

interface BookingPriceBreakdownProps {
  price: number;
  serviceFee: number;
}

export const BookingPriceBreakdown = ({ price, serviceFee }: BookingPriceBreakdownProps) => {
  const totalPrice = price + serviceFee;

  return (
    <div className="space-y-4 divide-y">
      <div className="flex justify-between py-2">
        <span className="text-gray-600">Price</span>
        <span className="font-medium text-gray-900">Rs. {price.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="text-gray-600">Service Fee</span>
        <span className="font-medium text-gray-900">Rs. {serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-4">
        <span className="text-lg font-semibold text-gray-900">Total Price</span>
        <span className="text-lg font-bold text-primary">Rs. {totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};