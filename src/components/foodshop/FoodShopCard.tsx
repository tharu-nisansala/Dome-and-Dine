import { FoodShop } from "@/types/FoodShop";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Star, Edit, Trash2 } from "lucide-react";

interface FoodShopCardProps {
    foodShop: FoodShop;
    onEdit: (shop: FoodShop) => void;
    onDelete: (id: string) => void;
}

export const FoodShopCard = ({ foodShop, onEdit, onDelete }: FoodShopCardProps) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
                <div className="flex flex-col h-full">
                    {foodShop.image ? (
                        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                            <img
                                src={foodShop.image}
                                alt={foodShop.name}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 mb-4 bg-gray-100 rounded-lg">
                            <Store className="h-12 w-12 text-gray-400" />
                        </div>
                    )}

                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-gray-900">{foodShop.name}</h3>
                                <Badge 
                                    variant={foodShop.isOpen ? "default" : "secondary"}
                                    className={`${
                                        foodShop.isOpen 
                                            ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }`}
                                >
                                    {foodShop.isOpen ? "Open" : "Closed"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium">{foodShop.rating}</span>
                            </div>
                        </div>

                        {foodShop.description && (
                            <p className="text-gray-500 text-sm line-clamp-2">{foodShop.description}</p>
                        )}

                        {foodShop.universities && foodShop.universities.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {foodShop.universities.map((university, index) => (
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

                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => onEdit(foodShop)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => onDelete(foodShop.id)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};