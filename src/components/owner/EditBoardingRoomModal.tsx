import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { BoardingPlace } from "@/utils/boardingPlaceTypes";
import { UniversitySelector } from "../boarding/UniversitySelector";

interface EditBoardingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardingPlace: BoardingPlace;
  onUpdate: (updatedBoardingPlace: BoardingPlace) => void;
}

export default function EditBoardingRoomModal({ 
  isOpen, 
  onClose, 
  boardingPlace, 
  onUpdate 
}: EditBoardingRoomModalProps) {
  const [formData, setFormData] = useState({
    name: boardingPlace.name,
    description: boardingPlace.description,
    image: boardingPlace.image,
    price: boardingPlace.price.toString(),
    universities: boardingPlace.universities,
    rating: boardingPlace.rating.toString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
      };

      const boardingRef = doc(db, "boardingPlaces", boardingPlace.id);
      await updateDoc(boardingRef, updatedData);
      
      onUpdate({ ...boardingPlace, ...updatedData });
      toast.success("Boarding room updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating boarding room:", error);
      toast.error("Failed to update boarding room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUniversityToggle = (university: string) => {
    setFormData(prev => ({
      ...prev,
      universities: prev.universities.includes(university)
        ? prev.universities.filter(u => u !== university)
        : [...prev.universities, university]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Edit Boarding Room
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter room name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your boarding room"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                    required
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rs./month)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter monthly price"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="Enter rating"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>

                <UniversitySelector
                  selectedUniversities={formData.universities}
                  onUniversityToggle={handleUniversityToggle}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 sticky bottom-0 bg-background py-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6"
              >
                {isSubmitting ? "Updating..." : "Update Room"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}