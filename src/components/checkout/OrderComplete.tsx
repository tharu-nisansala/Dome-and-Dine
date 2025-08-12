import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OrderDetails } from "@/types/order";
import { ReceiptHeader } from "./ReceiptHeader";

interface OrderCompleteProps {
  orderDetails: OrderDetails;
  onPrint: () => void;
  onDownload: () => void;
}

export const OrderComplete = ({ orderDetails, onPrint, onDownload }: OrderCompleteProps) => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-2xl mx-auto p-6 space-y-6">
      <ReceiptHeader />

      <div className="space-y-4">
        <div className="pt-4">
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between text-sm">
              <span>Order Number:</span>
              <span className="font-medium">{orderDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{orderDetails.orderDate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Customer:</span>
              <span>{orderDetails.userDetails?.fullName || orderDetails.customerName}</span>
            </div>
            {orderDetails.userDetails?.university && (
              <div className="flex justify-between text-sm">
                <span>University:</span>
                <span>{orderDetails.userDetails.university}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Order Details</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-4 text-sm font-medium bg-gray-50 p-2 rounded">
              <span>Item</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            {orderDetails.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 text-sm py-1">
                <span>{item.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-right">Rs. {item.price.toFixed(2)}</span>
                <span className="text-right">Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Type:</span>
              <span>{orderDetails.orderType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span>{orderDetails.paymentMethod}</span>
            </div>
            {orderDetails.deliveryFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery Fee:</span>
                <span>Rs. {orderDetails.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total Amount:</span>
              <span>Rs. {orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={onPrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Button onClick={onDownload} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    </Card>
  );
};