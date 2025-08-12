import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Store, Home, Trash2, Edit, Eye } from "lucide-react";
import { FoodShop } from "../../../types/FoodShop";
import { BoardingPlace } from "../../../types/boardingPlaceTypes";

interface ShopCardProps {
  item: FoodShop | BoardingPlace;
  type: 'foodShop' | 'boardingPlace';
  onDelete: (id: string) => void;
  onEdit: (item: FoodShop | BoardingPlace) => void;
  onView: (item: FoodShop | BoardingPlace) => void;
}

export const ShopCard = ({ item, type, onDelete, onEdit, onView }: ShopCardProps) => {
  const Icon = type === 'foodShop' ? Store : Home;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {'universities' in item && (
          <div className="flex flex-wrap gap-2">
            {item.universities.map((university, index) => (
              <Badge key={index} variant="secondary">
                {university}
              </Badge>
            ))}
          </div>
        )}

        {'price' in item && (
          <div className="text-primary font-semibold">
            Rs. {item.price}/month
          </div>
        )}

        {'isOpen' in item && (
          <Badge 
            variant={item.isOpen ? "success" : "destructive"}
            className="mt-2"
          >
            {item.isOpen ? 'Open' : 'Closed'}
          </Badge>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(item)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};