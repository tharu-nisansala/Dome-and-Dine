import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Phone, Mail, Globe, Clock, Star, Store } from "lucide-react";
import { FoodShop } from "@/types/FoodShop";
import { Badge } from "@/components/ui/badge";

interface FoodShopDetailsModalProps {
  foodShop: FoodShop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FoodShopDetailsModal = ({
  foodShop,
  open,
  onOpenChange,
}: FoodShopDetailsModalProps) => {
  if (!foodShop) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            {foodShop.name}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh]">
          <div className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={foodShop.image}
                alt={foodShop.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{foodShop.rating} Rating</span>
                </div>
                <Badge 
                  variant={foodShop.isOpen ? "default" : "secondary"}
                  className={`${
                    foodShop.isOpen 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {foodShop.isOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{foodShop.location.address}, {foodShop.location.city}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>
                    {foodShop.businessHours.open} - {foodShop.businessHours.close}
                    <span className="ml-2 text-sm text-gray-500">
                      ({foodShop.businessHours.daysOpen.join(", ")})
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{foodShop.contact.phone}</span>
                </div>

                {foodShop.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{foodShop.contact.email}</span>
                  </div>
                )}

                {foodShop.contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <a 
                      href={foodShop.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {foodShop.contact.website}
                    </a>
                  </div>
                )}
              </div>

              {foodShop.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {foodShop.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};