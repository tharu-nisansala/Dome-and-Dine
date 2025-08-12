import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Phone, Store, Eye } from "lucide-react";
import { FoodShop } from "@/types/FoodShop";
import { motion } from "framer-motion";
import { useState } from "react";
import { FoodShopDetailsModal } from "./FoodShopDetailsModal";

interface FoodShopCardProps {
  shop: FoodShop;
  onOrderClick: (shop: FoodShop) => void;
  isOrderEnabled: boolean;
}

export const FoodShopCard = ({ shop, onOrderClick, isOrderEnabled }: FoodShopCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-0">
            <div className="relative">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <Badge 
                variant={shop.isOpen ? "success" : "destructive"}
                className="absolute top-4 right-4 shadow-lg"
              >
                {shop.isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {shop.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {shop.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{shop.businessHours.open} - {shop.businessHours.close}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{shop.location.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{shop.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{shop.contact.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDetails(true)}
                  className="rounded-full"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => onOrderClick(shop)}
                  className="w-full h-12 text-base font-medium group-hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none disabled:opacity-50"
                  disabled={!isOrderEnabled || !shop.isOpen}
                >
                  {!isOrderEnabled ? 'Select University' : shop.isOpen ? 'Order Now' : 'Currently Closed'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <FoodShopDetailsModal
        foodShop={shop}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};