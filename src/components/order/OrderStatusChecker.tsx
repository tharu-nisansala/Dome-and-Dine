import { useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid } from "date-fns";
import { Order } from "@/types/order";
import { Timestamp } from 'firebase/firestore';
import { Separator } from "@/components/ui/separator";

export const OrderStatusChecker = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerFullName, setCustomerFullName] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | Timestamp | null | undefined) => {
    if (!date) return "Invalid date";
    
    if (date instanceof Timestamp) {
      return format(date.toDate(), "PPp");
    }
    
    const parsedDate = date instanceof Date ? date : new Date(date);
    return isValid(parsedDate) ? format(parsedDate, "PPp") : "Invalid date";
  };

  const fetchCustomerName = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().fullName || userDoc.data().displayName;
      }

      const shopOwnerDoc = await getDoc(doc(db, "shop_owners", userId));
      if (shopOwnerDoc.exists()) {
        return shopOwnerDoc.data().fullName || shopOwnerDoc.data().displayName;
      }

      const adminDoc = await getDoc(doc(db, "admins", userId));
      if (adminDoc.exists()) {
        return adminDoc.data().fullName || adminDoc.data().displayName;
      }

      return null;
    } catch (error) {
      console.error("Error fetching customer name:", error);
      return null;
    }
  };

  const checkOrderStatus = async () => {
    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setIsLoading(true);
    try {
      const ordersRef = collection(db, "food_orders");
      const q = query(ordersRef, where("orderNumber", "==", orderNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Order not found");
        setOrderDetails(null);
        setCustomerFullName("");
      } else {
        const orderData = querySnapshot.docs[0].data() as Order;
        orderData.id = querySnapshot.docs[0].id;
        
        if (orderData.userId) {
          const fullName = await fetchCustomerName(orderData.userId);
          setCustomerFullName(fullName || "");
        }
        
        setOrderDetails(orderData);
        toast.success("Order found!");
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      toast.error("Failed to check order status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Check Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Order Number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={checkOrderStatus}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Check"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {orderDetails && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{orderDetails.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(orderDetails.orderDate)}
                  </p>
                </div>
                <Badge className={`${getStatusColor(orderDetails.status)} px-3 py-1`}>
                  {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                </Badge>
              </div>

              <Separator />

              {/* Customer Details */}
              <div>
                <h4 className="font-medium text-lg mb-3">Customer Details</h4>
                <div className="space-y-2">
                  <p className="text-sm flex items-center gap-2">
                    {customerFullName || orderDetails.customerName}
                  </p>
                  {orderDetails.customerDetails?.telephone && (
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {orderDetails.customerDetails.telephone}
                    </p>
                  )}
                  {orderDetails.customerDetails?.email && (
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {orderDetails.customerDetails.email}
                    </p>
                  )}
                  {orderDetails.customerDetails?.address && (
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {orderDetails.customerDetails.address}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h4 className="font-medium text-lg mb-3">Order Items</h4>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Order Type</span>
                  <span className="font-medium">{orderDetails.orderType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Method</span>
                  <span className="font-medium">{orderDetails.paymentMethod}</span>
                </div>
                {orderDetails.deliveryFee && orderDetails.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>Rs. {orderDetails.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total Amount</span>
                  <span>Rs. {orderDetails.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Shop Details if available */}
              {orderDetails.shopDetails && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-lg mb-3">Shop Details</h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{orderDetails.shopDetails.name}</p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {orderDetails.shopDetails.telephone}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {orderDetails.shopDetails.location}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};