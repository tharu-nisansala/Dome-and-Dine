import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Building, Package2 } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";
import { motion } from "framer-motion";

interface DashboardStatsComponentProps {
  stats: DashboardStats;
}

export const DashboardStatsComponent = ({ stats }: DashboardStatsComponentProps) => {
  const statsData = [
    {
      title: "Food Shops",
      value: stats.totalFoodShops,
      icon: <Store className="h-4 w-4" />,
    },
    {
      title: "Boarding Places",
      value: stats.totalBoardingPlaces,
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: <Package2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 p-2 text-primary">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};