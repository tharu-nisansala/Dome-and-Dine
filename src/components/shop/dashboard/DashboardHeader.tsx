import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  shopData: {
    shopName: string;
    shopCategory: string;
    profileUrl?: string;
  };
  userPhotoURL?: string | null;
  onProfileUpdate: () => void;
  foodShopsCount: number;
  boardingPlacesCount: number;
  onNavigate: (path: string) => void;
}

export const DashboardHeader = ({
  shopData,
  userPhotoURL,
  onProfileUpdate,
  foodShopsCount,
  boardingPlacesCount,
  onNavigate,
}: DashboardHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={shopData.profileUrl || userPhotoURL || ""} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {shopData.shopName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{shopData.shopName}</h1>
            <p className="text-gray-500">{shopData.shopCategory}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onProfileUpdate}
            >
              <Camera className="mr-2 h-4 w-4" />
              Update Profile Picture
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => onNavigate("/manage-food-shops")}
          >
            Manage Food Shop ({foodShopsCount})
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onNavigate("/manage-boarding-rooms")}
          >
            Manage Boarding Rooms ({boardingPlacesCount})
          </Button>
        </div>
      </div>
    </motion.div>
  );
};