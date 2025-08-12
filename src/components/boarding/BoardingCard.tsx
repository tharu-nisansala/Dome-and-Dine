import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, School, Eye, CheckCircle, XCircle } from 'lucide-react';
import { BoardingPlace } from '@/types/boardingPlaceTypes';
import { useState } from 'react';
import { BoardingDetailsModal } from './BoardingDetailsModal';
import { Badge } from '@/components/ui/badge';

interface BoardingCardProps {
  item: BoardingPlace;
  onBookNow: (boardingPlace: BoardingPlace) => void;
  isBookingEnabled: boolean;
}

export const BoardingCard = ({ item, onBookNow, isBookingEnabled }: BoardingCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return parseInt(price || '0').toLocaleString();
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in bg-white">
        <CardContent className="p-0">
          <div className="aspect-video w-full overflow-hidden relative">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <Badge 
              className={`absolute top-2 right-2 ${
                item.isAvailable ? 'bg-green-500' : 'bg-red-500'
              } text-white`}
            >
              {item.isAvailable ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <XCircle className="w-4 h-4 mr-1" />
              )}
              {item.isAvailable ? 'Available' : 'Booked'}
            </Badge>
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600">
                {item.universities.length} {item.universities.length === 1 ? 'University' : 'Universities'} Nearby
              </span>
            </div>
            
            {item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-600">
                  {item.location}
                </span>
              </div>
            )}
            
            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
            
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{item.rating.toFixed(1)}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-primary font-bold text-lg">
                  Rs. {formatPrice(item.price)}/month
                </p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDetails(true)}
                  className="rounded-full"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={() => onBookNow(item)}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!isBookingEnabled || !item.isAvailable}
              >
                {!isBookingEnabled ? 'Select University' : !item.isAvailable ? 'Not Available' : 'Book Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <BoardingDetailsModal
        boardingPlace={item}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};