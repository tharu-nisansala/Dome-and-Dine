import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Loader2, ShieldCheck, Banknote } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface PaymentFormProps {
  isLoading: boolean;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
  totalAmount: number;
  paymentType: 'advance' | 'full';
  paymentMethod: 'card' | 'cash';
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvvChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaymentTypeChange: (value: 'advance' | 'full') => void;
  onPaymentMethodChange: (value: 'card' | 'cash') => void;
  onSubmit: (e: React.FormEvent) => void;
  onTotalAmountChange: (amount: number) => void;
}

export const PaymentForm = ({
  isLoading,
  cardNumber,
  expiry,
  cvv,
  cardName,
  totalAmount,
  paymentType,
  paymentMethod,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onCardNameChange,
  onPaymentTypeChange,
  onPaymentMethodChange,
  onSubmit,
  onTotalAmountChange,
}: PaymentFormProps) => {
  const advanceAmount = totalAmount * 0.5;

  // Update total amount when payment type changes
  useEffect(() => {
    const newAmount = paymentType === 'advance' ? advanceAmount : totalAmount;
    onTotalAmountChange(newAmount);
  }, [paymentType, totalAmount, advanceAmount, onTotalAmountChange]);

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Amount</h3>
        <RadioGroup
          value={paymentType}
          onValueChange={(value: 'advance' | 'full') => onPaymentTypeChange(value)}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="advance" id="advance" className="peer sr-only" />
            <Label
              htmlFor="advance"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-sm font-medium">Advance Payment</span>
              <span className="text-lg font-bold text-primary">Rs. {advanceAmount.toFixed(2)}</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="full" id="full" className="peer sr-only" />
            <Label
              htmlFor="full"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-sm font-medium">Full Payment</span>
              <span className="text-lg font-bold text-primary">Rs. {totalAmount.toFixed(2)}</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value: 'card' | 'cash') => onPaymentMethodChange(value)}
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
              <span className="text-sm font-medium">Cash Payment</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={onCardNameChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={onCardNumberChange}
              placeholder="1234 5678 9012 3456"
              required
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={onExpiryChange}
                placeholder="MM/YY"
                required
                maxLength={5}
              />
            </div>

            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={onCvvChange}
                placeholder="123"
                required
                maxLength={3}
                type="password"
              />
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>

      <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
        <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
        <span>Your payment information is secure</span>
      </div>
    </form>
  );
};