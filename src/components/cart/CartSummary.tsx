import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface CartSummaryProps {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  onCheckout: () => void;
}

export const CartSummary = ({ items, onCheckout }: CartSummaryProps) => {
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Card className="p-6 sticky top-4 animate-fade-in animation-delay-150">
      <div className="flex items-center gap-2 mb-6">
        <Receipt className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </div>
      <div className="space-y-3 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-gray-600">
            <span>{item.name} × {item.quantity}</span>
            <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold text-lg mb-6">
          <span>Total</span>
          <span className="text-primary">Rs. {calculateTotal().toFixed(2)}</span>
        </div>
        <Button
          className="w-full hover:scale-105 transition-transform"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </Card>
  );
};