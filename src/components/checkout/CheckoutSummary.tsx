import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { CartItem } from "@/types/cart";

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  orderType?: string;
}

export const CheckoutSummary = ({ cartItems, orderType }: CheckoutSummaryProps) => {
  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 50 : 0;
    return itemsTotal + deliveryFee;
  };

  return (
    <Card className="p-6 space-y-4 shadow-lg bg-gray-50">
      <div className="flex items-center gap-2">
        <Receipt className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Food Order Summary</h2>
      </div>
      <div className="space-y-3">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded-md"
              />
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="font-medium text-gray-800">
              Rs. {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        {orderType === 'delivery' && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-gray-800">Rs. 50.00</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total Amount</span>
          <span className="text-primary">Rs. {calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};