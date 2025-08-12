import React from "react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardingRoomHeaderProps {
    onAddNew: () => void;
}

const BoardingRoomHeader: React.FC<BoardingRoomHeaderProps> = ({ onAddNew }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-gray-900">Manage Boarding Rooms</h1>
                </div>
                <p className="text-gray-500">Add, edit, and manage your boarding room listings</p>
            </div>
            <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={onAddNew}
            >
                + Add New Room
            </Button>
        </div>
    );
};

export default BoardingRoomHeader;