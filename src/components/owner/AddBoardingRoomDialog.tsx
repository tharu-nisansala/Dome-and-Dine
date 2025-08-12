import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface BoardingRoom {
    name: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    universities: string[];
}

interface AddBoardingRoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (boardingRoom: Omit<BoardingRoom, 'id' | 'createdAt' | 'ownerId'>) => Promise<void>;
    universities: string[];
}

const AddBoardingRoomDialog: React.FC<AddBoardingRoomDialogProps> = ({ 
    open, 
    onOpenChange, 
    onAdd, 
    universities 
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [newBoardingRoom, setNewBoardingRoom] = useState<BoardingRoom>({
        name: "",
        description: "",
        image: "",
        price: 0,
        rating: 0,
        universities: [],
    });

    const filteredUniversities = universities.filter(uni =>
        uni.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = async () => {
        try {
            if (!newBoardingRoom.name || !newBoardingRoom.description || !newBoardingRoom.image ||
                !newBoardingRoom.price || newBoardingRoom.universities.length === 0) {
                toast.error("All fields are required");
                return;
            }

            if (newBoardingRoom.rating < 0 || newBoardingRoom.rating > 5) {
                toast.error("Rating must be between 0 and 5");
                return;
            }

            if (newBoardingRoom.price <= 0) {
                toast.error("Price must be a positive number");
                return;
            }

            await onAdd(newBoardingRoom);
            setNewBoardingRoom({
                name: "",
                description: "",
                image: "",
                price: 0,
                rating: 0,
                universities: [],
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error adding boarding room:', error);
            toast.error("Failed to add boarding room");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Add New Boarding Room</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[70vh] pr-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Room Name</Label>
                            <Input
                                id="name"
                                value={newBoardingRoom.name}
                                onChange={(e) => setNewBoardingRoom({
                                    ...newBoardingRoom,
                                    name: e.target.value,
                                })}
                                placeholder="Enter room name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={newBoardingRoom.description}
                                onChange={(e) => setNewBoardingRoom({
                                    ...newBoardingRoom,
                                    description: e.target.value,
                                })}
                                placeholder="Enter room description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                value={newBoardingRoom.image}
                                onChange={(e) => setNewBoardingRoom({
                                    ...newBoardingRoom,
                                    image: e.target.value,
                                })}
                                placeholder="Enter image URL"
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Price (Rs.)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={newBoardingRoom.price}
                                onChange={(e) => setNewBoardingRoom({
                                    ...newBoardingRoom,
                                    price: parseFloat(e.target.value) || 0,
                                })}
                                placeholder="Enter price"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label htmlFor="rating">Rating (0-5)</Label>
                            <Input
                                id="rating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={newBoardingRoom.rating}
                                onChange={(e) => setNewBoardingRoom({
                                    ...newBoardingRoom,
                                    rating: parseFloat(e.target.value) || 0,
                                })}
                                placeholder="Enter rating"
                            />
                        </div>
                        <div>
                            <Label>Select Universities</Label>
                            <Input
                                type="text"
                                placeholder="Search universities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2"
                            />
                            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                                {filteredUniversities.map((university, idx) => (
                                    <div key={idx} className="flex items-center space-x-2 p-1 hover:bg-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={newBoardingRoom.universities.includes(university)}
                                            onChange={(e) => {
                                                const updatedUniversities = e.target.checked
                                                    ? [...newBoardingRoom.universities, university]
                                                    : newBoardingRoom.universities.filter(u => u !== university);
                                                setNewBoardingRoom({
                                                    ...newBoardingRoom,
                                                    universities: updatedUniversities,
                                                });
                                            }}
                                        />
                                        <span>{university}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={handleAdd} className="w-full">Add Room</Button>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AddBoardingRoomDialog;