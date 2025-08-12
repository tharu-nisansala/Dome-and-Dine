import { PaymentReceipt } from "./PaymentReceipt";
import { BoardingPlace } from "@/types/boardingPlaceTypes";
import { OrderDetails } from "@/types/order";
import { generateBoardingPDF } from "@/utils/pdfGenerationUtils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Timestamp } from 'firebase/firestore';

interface PaymentSuccessViewProps {
  boardingPlace: BoardingPlace;
  paymentDetails: OrderDetails['paymentDetails'];
  bookingId: string;
}

export const PaymentSuccessView = ({
  boardingPlace,
  paymentDetails,
  bookingId,
}: PaymentSuccessViewProps) => {
  const convertToDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <PaymentReceipt
          boardingPlace={boardingPlace}
          paymentDetails={{
            ...paymentDetails,
            date: paymentDetails.date
          }}
          onPrint={() => window.print()}
          onDownload={() => {
            if (paymentDetails) {
              const orderDetails: Partial<OrderDetails> = {
                id: bookingId,
                orderNumber: bookingId,
                orderDate: convertToDate(new Date()),
                customerName: paymentDetails.customerName,
                orderType: "boarding",
                paymentMethod: paymentDetails.method,
                totalAmount: paymentDetails.amount,
                items: [],
                deliveryFee: 0,
                status: "completed",
                paymentDetails,
                boardingPlace: {
                  name: boardingPlace.name,
                  location: boardingPlace.location || '',
                  price: boardingPlace.price
                }
              };

              const doc = generateBoardingPDF({
                boardingPlace,
                paymentDetails,
                orderDetails
              });
              doc.save(`receipt-${paymentDetails.transactionId}.pdf`);
            }
          }}
        />
      </div>
      <Footer />
    </div>
  );
};