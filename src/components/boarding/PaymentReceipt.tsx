import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { BoardingPlace } from "@/types/boardingPlaceTypes";
import { format } from "date-fns";
import { Timestamp } from 'firebase/firestore';

interface PaymentReceiptProps {
  boardingPlace: BoardingPlace;
  paymentDetails: {
    type: 'advance' | 'full';
    method: 'card' | 'cash';
    amount: number;
    date: Date | Timestamp;
    transactionId: string;
    customerName: string;
    customerEmail: string;
  };
  onPrint: () => void;
  onDownload: () => void;
}

export const PaymentReceipt = ({
  boardingPlace,
  paymentDetails,
  onPrint,
  onDownload,
}: PaymentReceiptProps) => {
  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP');
    }
    return format(date, 'PPP');
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
        <p className="text-gray-500">Thank you for your booking!</p>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Boarding Details:</h3>
          <div className="space-y-2 text-gray-600">
            <p>Room: {boardingPlace.name}</p>
            <p>Location: {boardingPlace.location}</p>
            <p>Monthly Rent: Rs. {typeof boardingPlace.price === 'string' ? 
              parseFloat(boardingPlace.price).toFixed(2) : 
              boardingPlace.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Payment Details:</h3>
          <div className="space-y-2 text-gray-600">
            <p>Transaction ID: {paymentDetails.transactionId}</p>
            <p>Date: {formatDate(paymentDetails.date)}</p>
            <p>Payment Type: {paymentDetails.type === 'advance' ? 'Advance Payment' : 'Full Payment'}</p>
            <p>Payment Method: {paymentDetails.method === 'card' ? 'Card Payment' : 'Cash Payment'}</p>
            <p>Amount Paid: Rs. {paymentDetails.amount.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Customer Details:</h3>
          <div className="space-y-2 text-gray-600">
            <p>Name: {paymentDetails.customerName}</p>
            <p>Email: {paymentDetails.customerEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Button onClick={onPrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Receipt
        </Button>
        <Button onClick={onDownload} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </Card>
  );
};