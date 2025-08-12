import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CreditCard, Banknote, UtensilsCrossed, Car, Store } from "lucide-react";

interface OrderOptionsProps {
  paymentMethod: string;
  orderType: string;
  onPaymentMethodChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
}

export const OrderOptions = ({
  paymentMethod,
  orderType,
  onPaymentMethodChange,
  onOrderTypeChange
}: OrderOptionsProps) => {
  return (
    <Card className="p-6 space-y-6 shadow-lg bg-gray-50">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={onPaymentMethodChange}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="card" id="card" className="peer sr-only" />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <CreditCard className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Card Payment</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
            <Label
              htmlFor="cash"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Banknote className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Type</h3>
        <RadioGroup
          value={orderType}
          onValueChange={onOrderTypeChange}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
            <Label
              htmlFor="delivery"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Car className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Delivery</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="takeaway" id="takeaway" className="peer sr-only" />
            <Label
              htmlFor="takeaway"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Store className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Takeaway</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="dineIn" id="dineIn" className="peer sr-only" />
            <Label
              htmlFor="dineIn"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <UtensilsCrossed className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Dine In</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </Card>
  );
};