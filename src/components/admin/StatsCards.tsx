import { Users, Store, Home, ShoppingCart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

interface StatsCardsProps {
  stats: {
    users: number;
    shops: number;
    boardings: number;
    orders: number;
  };
  onCardClick: (type: 'users' | 'shops' | 'boardings' | 'orders') => void;
}

export const StatsCards = ({ stats, onCardClick }: StatsCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div onClick={() => onCardClick('users')} className="cursor-pointer">
        <DashboardCard
          title="Total Users"
          value={stats.users}
          icon={<Users className="h-4 w-4" />}
          description="Click to view all users"
        />
      </div>
      <div onClick={() => onCardClick('shops')} className="cursor-pointer">
        <DashboardCard
          title="Active Shops"
          value={stats.shops}
          icon={<Store className="h-4 w-4" />}
          description="Click to view all shops"
        />
      </div>
      <div onClick={() => onCardClick('boardings')} className="cursor-pointer">
        <DashboardCard
          title="Boarding Places"
          value={stats.boardings}
          icon={<Home className="h-4 w-4" />}
          description="Click to view all boarding places"
        />
      </div>
      <div onClick={() => onCardClick('orders')} className="cursor-pointer">
        <DashboardCard
          title="Total Orders"
          value={stats.orders}
          icon={<ShoppingCart className="h-4 w-4" />}
          description="Click to view all orders"
        />
      </div>
    </div>
  );
};