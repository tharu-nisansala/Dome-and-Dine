import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash } from "lucide-react";
import { toast } from "sonner";

interface BoardingRoom {
  id: string;
  name: string;
  location: string;
}

interface BoardingRoomsListProps {
  boardingRooms: BoardingRoom[];
  onDeleteClick: (id: string) => void;
}

export const BoardingRoomsList = ({ boardingRooms, onDeleteClick }: BoardingRoomsListProps) => {
  const handleDelete = async (id: string) => {
    try {
      await onDeleteClick(id);
      toast.success("Boarding room deleted successfully");
    } catch (error) {
      toast.error("Failed to delete boarding room");
    }
  };

  return (
    <Card className="col-span-3 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl font-semibold">Boarding Rooms</span>
          <span className="text-sm text-muted-foreground">({boardingRooms.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {boardingRooms.map((room) => (
              <div
                key={room.id}
                className="group flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{room.name}</span>
                  <span className="text-sm text-muted-foreground">{room.location}</span>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};