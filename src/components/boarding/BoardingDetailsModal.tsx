import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Star } from "lucide-react";
import { BoardingPlace } from "@/types/boardingPlaceTypes";

interface BoardingDetailsModalProps {
  boardingPlace: BoardingPlace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BoardingDetailsModal = ({
  boardingPlace,
  open,
  onOpenChange,
}: BoardingDetailsModalProps) => {
  if (!boardingPlace) return null;

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return parseInt(price || '0').toLocaleString();
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'object' && location !== null) {
      return `${location.address}, ${location.city}`;
    }
    return location || 'Location not available';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {boardingPlace.name}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[70vh]">
          <div className="space-y-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={boardingPlace.image}
                alt={boardingPlace.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">{boardingPlace.rating.toFixed(1)} Rating</span>
              </div>

              {boardingPlace.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{formatLocation(boardingPlace.location)}</span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {boardingPlace.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-2xl font-bold text-primary">
                  Rs. {formatPrice(boardingPlace.price)}/month
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};