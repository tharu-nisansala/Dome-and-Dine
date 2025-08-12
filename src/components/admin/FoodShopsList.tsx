import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Trash2, Store, Star, Edit, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FoodShop } from "../../types/FoodShop";

interface FoodShopsListProps {
  foodShops: FoodShop[];
  onDeleteClick: (id: string) => void;
  onEditClick: (shop: FoodShop) => void;
}

export const FoodShopsList = ({ foodShops, onDeleteClick, onEditClick }: FoodShopsListProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foodShops.map((shop) => (
        <Card 
          key={shop.id} 
          className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="relative h-48 mb-4 -mt-6 -mx-6 overflow-hidden">
                {shop.image ? (
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Store className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{shop.name}</h3>
                    <Badge 
                      variant={shop.isOpen ? "default" : "secondary"}
                      className={`${
                        shop.isOpen 
                          ? "bg-green-100 text-green-800 hover:bg-green-200" 
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {shop.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  {shop.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{shop.rating}</span>
                    </div>
                  )}
                </div>
                
                {shop.description && (
                  <p className="text-gray-500 text-sm line-clamp-2">{shop.description}</p>
                )}

                {shop.universities && shop.universities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {shop.universities.map((university, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {university}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEditClick(shop)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => onDeleteClick(shop.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => navigate(`/shop/${shop.id}/manage-items`)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Shop Items
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
