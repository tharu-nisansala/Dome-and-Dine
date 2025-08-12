import React from "react";
import { BoardingPlace } from "@/utils/boardingPlaceTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";

interface BoardingRoomCardProps {
    boardingPlace: BoardingPlace;
    onEdit: () => void;
    onDelete: () => void;
    onManageDetails: () => void;
    onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

const BoardingRoomCard: React.FC<BoardingRoomCardProps> = ({
    boardingPlace,
    onEdit,
    onDelete,
    onManageDetails,
    onToggleAvailability,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="aspect-video w-full overflow-hidden relative">
                <img 
                    src={boardingPlace.image} 
                    alt={boardingPlace.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
                <Badge 
                    className={`absolute top-2 right-2 ${
                        boardingPlace.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                    {boardingPlace.isAvailable ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                    )}
                    {boardingPlace.isAvailable ? 'Available' : 'Booked'}
                </Badge>
            </div>
            <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{boardingPlace.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {boardingPlace.description}
                </p>
                <p className="text-primary font-semibold mb-4">
                    Rs. {boardingPlace.price}/month
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {boardingPlace.universities.map((university, index) => (
                        <Badge 
                            key={index}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                            {university}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between mb-4">
                    <Label htmlFor={`availability-${boardingPlace.id}`} className="text-sm text-gray-600">
                        Availability Status
                    </Label>
                    <Switch
                        id={`availability-${boardingPlace.id}`}
                        checked={boardingPlace.isAvailable}
                        onCheckedChange={(checked) => onToggleAvailability(boardingPlace.id, checked)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onEdit}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
                <Button 
                    className="w-full mt-2 bg-primary hover:bg-primary/90"
                    onClick={onManageDetails}
                >
                    Manage Room Details
                </Button>
            </div>
        </div>
    );
};

export default BoardingRoomCard;