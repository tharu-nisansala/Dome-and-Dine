import React from "react";
import { BoardingPlace } from "@/utils/boardingPlaceTypes";
import BoardingRoomCard from "./BoardingRoomCard";

interface BoardingRoomsGridProps {
    boardingPlaces: BoardingPlace[];
    onEdit: (boardingPlace: BoardingPlace) => void;
    onDelete: (id: string) => void;
    onManageDetails: (boardingPlace: BoardingPlace) => void;
    onToggleAvailability: (id: string, isAvailable: boolean) => void;
}

const BoardingRoomsGrid: React.FC<BoardingRoomsGridProps> = ({
    boardingPlaces,
    onEdit,
    onDelete,
    onManageDetails,
    onToggleAvailability,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardingPlaces.map((place) => (
                <BoardingRoomCard
                    key={place.id}
                    boardingPlace={place}
                    onEdit={() => onEdit(place)}
                    onDelete={() => onDelete(place.id)}
                    onManageDetails={() => onManageDetails(place)}
                    onToggleAvailability={onToggleAvailability}
                />
            ))}
        </div>
    );
};

export default BoardingRoomsGrid;