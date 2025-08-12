import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";
import { motion } from "framer-motion";

interface OrdersStatusCardProps {
  activeOrders: number;
  error?: string;
}

export const OrdersStatusCard = ({ activeOrders, error }: OrdersStatusCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Orders
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-primary/10 p-2 text-primary">
            <Package2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="text-2xl font-bold">{activeOrders}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};