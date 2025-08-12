import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { motion } from "framer-motion";

interface BookedBoardingsCardProps {
  bookedCount: number;
  totalCount: number;
}

export const BookedBoardingsCard = ({ bookedCount, totalCount }: BookedBoardingsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-gray-800">Booked Boardings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{bookedCount}</span>
              <span className="text-gray-500">/ {totalCount}</span>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((bookedCount / totalCount) * 100) || 0}% Occupancy
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};