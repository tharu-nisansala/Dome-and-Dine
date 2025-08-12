import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { OrderOptions } from "@/components/checkout/OrderOptions";
import { OrderComplete } from "@/components/checkout/OrderComplete";
import { PostOrderHandler } from "@/components/checkout/PostOrderHandler";
import { CustomerDetailsCard } from "@/components/checkout/CustomerDetailsCard";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { generatePDF } from "@/utils/pdfUtils";
import { OrderDetails } from "@/types/order";
import { CartItem } from "@/types/cart";
import { validateOrderData } from "@/utils/checkoutUtils";
import { createOrder } from "@/utils/checkoutOperations";

interface CustomerDetails {
  fullName: string;
  telephone: string;
  email: string;
  address: string;
}

export const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: "",
    telephone: "",
    email: "",
    address: "",
  });

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCustomerDetails({
            fullName: userData.fullName || "",
            telephone: userData.telephone || "",
            email: user.email || "",
            address: userData.address || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const q = query(
      collection(db, "cart_items"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CartItem[];
      
      setCartItems(items);
      setIsLoadingCart(false);
    }, (error) => {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
      setIsLoadingCart(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleCustomerDetailsChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCustomerDetails = () => {
    if (!customerDetails.fullName || !customerDetails.telephone || !customerDetails.email) {
      toast.error("Please fill in all required customer details");
      return false;
    }
    if (orderType === "delivery" && !customerDetails.address) {
      toast.error("Please provide a delivery address");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateOrderData(paymentMethod, orderType) || !validateCustomerDetails()) {
      return;
    }

    setIsLoading(true);

    try {
      const { orderDetails: newOrderDetails } = await createOrder(
        cartItems,
        customerDetails,
        orderType,
        paymentMethod,
        user!.uid
      );

      setOrderDetails(newOrderDetails);
      setOrderComplete(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (orderDetails) {
      const doc = generatePDF(orderDetails);
      doc.autoPrint();
      doc.output('dataurlnewwindow');
    }
  };

  const handleDownload = () => {
    if (orderDetails) {
      const doc = generatePDF(orderDetails);
      doc.save(`order-receipt-${orderDetails.orderNumber}.pdf`);
    }
  };

  if (isLoadingCart) {
    return <LoadingSpinner />;
  }

  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          {user && (
            <PostOrderHandler
              userId={user.uid}
              orderItems={cartItems}
              onComplete={() => {
                console.log("Post-order processing completed");
              }}
            />
          )}
          <OrderComplete
            orderDetails={orderDetails}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 group flex items-center gap-2 hover:bg-gray-100 animate-fade-in"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <UtensilsCrossed className="h-4 w-4" />
            <span>Back to Food Cart</span>
          </Button>

          <div className="grid gap-8 animate-fade-in">
            <CustomerDetailsCard
              fullName={customerDetails.fullName}
              telephone={customerDetails.telephone}
              email={customerDetails.email}
              address={customerDetails.address}
              orderType={orderType}
              onInputChange={handleCustomerDetailsChange}
            />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <OrderOptions
                  paymentMethod={paymentMethod}
                  orderType={orderType}
                  onPaymentMethodChange={setPaymentMethod}
                  onOrderTypeChange={setOrderType}
                />
                {paymentMethod === "card" && (
                  <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
                    <PaymentForm
                      isLoading={isLoading}
                      onSubmit={handlePlaceOrder}
                    />
                  </Card>
                )}
                {paymentMethod === "cash" && (
                  <Card className="p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
                    <Button
                      className="w-full"
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      Place Order
                    </Button>
                  </Card>
                )}
              </div>

              <CheckoutSummary 
                cartItems={cartItems} 
                orderType={orderType}  
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;