import { useEffect, useState } from "react";
import { Store, Building, Package2 } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface DashboardStatsDisplayProps {
  stats: DashboardStats;
  ownerId: string;
}

export const DashboardStatsDisplay = ({ stats, ownerId }: DashboardStatsDisplayProps) => {
  const [foodOrdersCount, setFoodOrdersCount] = useState<number>(0);
  const [bookedBoardingsCount, setBookedBoardingsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!ownerId) return;

      try {
        setIsLoading(true);
        const ordersQuery = query(
          collection(db, "food_orders"),
          where("shopDetails.ownerId", "==", ownerId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersCount = ordersSnapshot.size;
        
        console.log("Fetched orders count:", ordersCount);
        setFoodOrdersCount(ordersCount);

        const boardingsQuery = query(
          collection(db, "boardingPlaces"),
          where("ownerId", "==", ownerId),
          where("isAvailable", "==", false)
        );
        const boardingsSnapshot = await getDocs(boardingsQuery);
        setBookedBoardingsCount(boardingsSnapshot.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [ownerId]);

  const statsData = [
    {
      title: "Food Shops",
      value: stats.totalFoodShops,
      icon: <Store className="h-4 w-4 text-primary" />,
    },
    {
      title: "Booked Boardings",
      value: `${bookedBoardingsCount} / ${stats.totalBoardingPlaces}`,
      description: `${Math.round((bookedBoardingsCount / (stats.totalBoardingPlaces || 1)) * 100)}% Occupancy`,
      icon: <Building className="h-4 w-4 text-primary" />,
    },
    {
      title: "Food Orders",
      value: isLoading ? "Loading..." : foodOrdersCount,
      icon: <Package2 className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 p-2">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.description && (
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};