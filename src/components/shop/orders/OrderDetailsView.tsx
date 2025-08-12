import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderStatusManager } from "./OrderStatusManager";
import { Order } from "@/types/order";
import { Timestamp } from "firebase/firestore";

interface OrderDetailsViewProps {
  order: Order;
}

export const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
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

  const formatOrderDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "PPp");
    }
    return format(date, "PPp");
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            Order #{order.orderNumber}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {formatOrderDate(order.orderDate)}
          </p>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Customer Details</h4>
            <p className="text-sm">{order.customerName}</p>
            {order.userDetails?.email && (
              <p className="text-sm text-gray-500">{order.userDetails.email}</p>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Total Amount</span>
                <span>Rs. {order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Update Status</h4>
            <OrderStatusManager 
              orderId={order.id} 
              currentStatus={order.status} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};