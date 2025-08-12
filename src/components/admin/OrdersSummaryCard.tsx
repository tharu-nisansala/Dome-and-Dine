import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { ShoppingBag, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export const OrdersSummaryCard = () => {
  const { data, isLoading, error } = useAdminOrders();

  const formatDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), "PPp");
    }
    return format(date, "PPp");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">
            Failed to load orders. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalOrders = (data?.foodOrders?.length || 0) + (data?.boardingOrders?.length || 0);
  const totalRevenue = data?.totalRevenue || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Orders Summary</span>
          <div className="flex items-center gap-4 text-sm">
            <span>Total Orders: {totalOrders}</span>
            <span>Total Revenue: Rs. {totalRevenue.toFixed(2)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="food" className="space-y-4">
          <TabsList>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Food Orders ({data?.foodOrders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="boarding" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Boarding Orders ({data?.boardingOrders?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="food" className="space-y-4">
            {data?.foodOrders && data.foodOrders.length > 0 ? (
              data.foodOrders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {order.orderDate && formatDate(order.orderDate)}
                      </p>
                      <p className="text-sm">Customer: {order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {order.status}
                      </Badge>
                      <p className="mt-2 font-semibold">
                        Rs. {Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No food orders found
              </div>
            )}
          </TabsContent>

          <TabsContent value="boarding" className="space-y-4">
            {data?.boardingOrders && data.boardingOrders.length > 0 ? (
              data.boardingOrders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Booking #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {order.orderDate && formatDate(order.orderDate)}
                      </p>
                      <p className="text-sm">Customer: {order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }>
                        {order.status}
                      </Badge>
                      <p className="mt-2 font-semibold">
                        Rs. {Number(order.totalAmount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No boarding orders found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};