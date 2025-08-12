import { motion } from "framer-motion";
import { ShopInfoCard } from "./ShopInfoCard";
import { BookedBoardingsCard } from "./BookedBoardingsCard";
import { DashboardStatsDisplay } from "./DashboardStatsDisplay";
import { OrdersOverviewCard } from "./OrdersOverviewCard";
import type { DashboardStats } from "@/types/dashboard";

interface DashboardContentProps {
  shopData: {
    shopName: string;
    businessRegistrationNumber: string;
    shopCategory: string;
    shopAddress: string;
    telephone: string;
    email: string;
  };
  stats: DashboardStats;
  bookedBoardings: any[];
  boardingPlacesCount: number;
  ownerId: string;
}

export const DashboardContent = ({
  shopData,
  stats,
  bookedBoardings,
  boardingPlacesCount,
  ownerId,
}: DashboardContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Stats Grid */}
      <DashboardStatsDisplay stats={stats} ownerId={ownerId} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ShopInfoCard
          shopName={shopData.shopName}
          businessRegistrationNumber={shopData.businessRegistrationNumber}
          shopCategory={shopData.shopCategory}
          shopAddress={shopData.shopAddress}
          telephone={shopData.telephone}
          email={shopData.email}
        />

        <BookedBoardingsCard 
          bookedCount={bookedBoardings.length}
          totalCount={boardingPlacesCount}
        />
      </div>

      {/* Orders Overview */}
      <div className="mt-6">
        <OrdersOverviewCard ownerId={ownerId} />
      </div>
    </motion.div>
  );
};