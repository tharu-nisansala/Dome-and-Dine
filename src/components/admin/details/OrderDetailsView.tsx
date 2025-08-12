import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Timestamp } from 'firebase/firestore';

interface OrderDetailsViewProps {
  order: any;
}

export const OrderDetailsView = ({ order }: OrderDetailsViewProps) => {
  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "PPp");
    }
    return format(date, "PPp");
  };

  return (
    <div key={order.id} className="p-6 border-b last:border-0 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">
            Order #{order.id.slice(0, 8)}
          </h3>
          <p className="text-sm text-gray-500">
            Placed on: {formatDate(new Date(order.createdAt))}
          </p>
        </div>
        <Badge 
          variant={
            order.status === "completed"
              ? "success"
              : order.status === "pending"
              ? "secondary"
              : "destructive"
          }
          className={`text-xs px-2 py-1 rounded ${
            order.status === "completed" ? "bg-green-100 text-green-800" : 
            order.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-3">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex items-center justify-between">
            <span>{item.name}</span>
            <span>Rs. {item.price}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 font-semibold">
        <span>Total Amount:</span>
        <span>Rs. {order.totalAmount}</span>
      </div>
    </div>
  );
};