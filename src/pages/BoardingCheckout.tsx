import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardingPlace } from "@/types/boardingPlaceTypes";
import { PaymentForm } from "@/components/boarding/PaymentForm";
import { BookingSummaryCard } from "@/components/boarding/BookingSummaryCard";
import { PaymentSuccessView } from "@/components/boarding/PaymentSuccessView";
import { OrderDetails } from "@/types/order";
import { BookingNotificationHandler } from "@/components/boarding/BookingNotificationHandler";

const BoardingCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentType, setPaymentType] = useState<'advance' | 'full'>('advance');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<OrderDetails['paymentDetails'] | null>(null);
  const [currentTotal, setCurrentTotal] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const boardingPlace = location.state?.boardingPlace as BoardingPlace;
  const bookingId = location.state?.bookingId;
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    if (!boardingPlace || !bookingId || !bookingDetails) {
      navigate('/boarding-list');
    }
    // Set initial total
    setCurrentTotal(parseFloat(boardingPlace?.price?.toString() || '0'));
  }, [boardingPlace, bookingId, bookingDetails, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const paymentDetails = {
        type: paymentType,
        method: paymentMethod,
        amount: currentTotal,
        date: new Date(),
        transactionId: `TRX-${Date.now()}`,
        customerName: bookingDetails.name,
        customerEmail: bookingDetails.email
      };

      await updateDoc(doc(db, "bookings", bookingId), {
        status: "paid",
        paymentDate: new Date(),
        paymentDetails,
        userId: auth.currentUser?.uid
      });

      setPaymentDetails(paymentDetails);
      setShowReceipt(true);
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!boardingPlace || !bookingId || !bookingDetails) {
    return null;
  }

  if (showReceipt && paymentDetails) {
    return (
      <PaymentSuccessView
        boardingPlace={boardingPlace}
        paymentDetails={paymentDetails}
        bookingId={bookingId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {boardingPlace?.ownerId && (
        <BookingNotificationHandler shopOwnerId={boardingPlace.ownerId} />
      )}
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 group flex items-center gap-2 hover:bg-gray-100 animate-fade-in"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <Home className="h-4 w-4" />
            <span>Back to Boarding Details</span>
          </Button>

          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
              <PaymentForm
                isLoading={isLoading}
                cardNumber={cardNumber}
                expiry={expiry}
                cvv={cvv}
                cardName={cardName}
                totalAmount={parseFloat(boardingPlace?.price?.toString() || '0')}
                paymentType={paymentType}
                paymentMethod={paymentMethod}
                onCardNumberChange={(e) => setCardNumber(e.target.value)}
                onExpiryChange={(e) => setExpiry(e.target.value)}
                onCvvChange={(e) => setCvv(e.target.value)}
                onCardNameChange={(e) => setCardName(e.target.value)}
                onPaymentTypeChange={setPaymentType}
                onPaymentMethodChange={setPaymentMethod}
                onSubmit={handlePayment}
                onTotalAmountChange={setCurrentTotal}
              />
            </Card>

            <BookingSummaryCard
              boardingPlace={boardingPlace}
              bookingDetails={{
                ...bookingDetails,
                totalPrice: currentTotal
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingCheckout;