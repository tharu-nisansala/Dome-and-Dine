import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Home, School } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { BoardingPlace } from "@/types/boardingPlaceTypes";

interface BoardingDetailsViewProps {
  boarding: BoardingPlace;
}

export const BoardingDetailsView = ({ boarding }: BoardingDetailsViewProps) => {
  if (!boarding) {
    return (
      <div className="p-6 text-center text-gray-500">
        No boarding details available
      </div>
    );
  }

  const formatDate = (date: any) => {
    try {
      if (date?.toDate) {
        return format(date.toDate(), 'PPp');
      }
      return 'Date not available';
    } catch (error) {
      return 'Date not available';
    }
  };

  // Format location object if it's an object, otherwise use as string
  const formatLocation = (location: any) => {
    if (typeof location === 'object' && location !== null) {
      return `${location.address}, ${location.city}`;
    }
    return location || 'Location not available';
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{boarding.name || 'No Name'}</h3>
          </div>
          {boarding.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{formatLocation(boarding.location)}</span>
            </div>
          )}
        </div>
        <Badge 
          variant="secondary"
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          Rs. {typeof boarding.price === 'number' ? boarding.price.toLocaleString() : parseInt(boarding.price || '0').toLocaleString()}/month
        </Badge>
      </div>

      <Separator />

      {boarding.description && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Description</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{boarding.description}</p>
        </div>
      )}

      {boarding.amenities && boarding.amenities.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {boarding.amenities.map((amenity: string, index: number) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {boarding.universities && boarding.universities.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <School className="h-4 w-4" />
              Universities Nearby
            </h4>
            <div className="flex flex-wrap gap-2">
              {boarding.universities.map((university: string, index: number) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {university}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {boarding.createdAt && (
        <>
          <Separator />
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Listed on: {formatDate(boarding.createdAt)}</span>
          </div>
        </>
      )}

      {boarding.address && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Full Address</h4>
            <p className="text-gray-600">{boarding.address}</p>
          </div>
        </>
      )}

      {boarding.rules && boarding.rules.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">House Rules</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {boarding.rules.map((rule: string, index: number) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};