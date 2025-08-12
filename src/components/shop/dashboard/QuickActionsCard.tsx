import { Button } from "@/components/ui/button";
import { Store, Building2, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopSettingsDialog } from "../ShopSettingsDialog";

interface QuickActionsCardProps {
  onManageShops: () => void;
  onManageBoardingRooms: () => void;
}

export const QuickActionsCard = ({
  onManageShops,
  onManageBoardingRooms,
}: QuickActionsCardProps) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-4">
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 flex items-center justify-center space-x-2 py-6 px-4 rounded-lg"
            onClick={onManageShops}
          >
            <Store className="w-5 h-5" />
            <span className="text-sm sm:text-base">Manage Shops</span>
          </Button>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 flex items-center justify-center space-x-2 py-6 px-4 rounded-lg"
            onClick={onManageBoardingRooms}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-sm sm:text-base">Manage Boarding Rooms</span>
          </Button>
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 flex items-center justify-center space-x-2 py-6 px-4 rounded-lg"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm sm:text-base">Update Shop Info</span>
          </Button>
        </div>
      </div>

      <ShopSettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
    </motion.div>
  );
};