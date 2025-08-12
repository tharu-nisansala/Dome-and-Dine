import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Store } from "lucide-react";
import { BoardingRoomFormFields } from "../boarding/BoardingRoomFormFields";

interface AddBoardingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (boardingRoom: any) => Promise<void>;
}

export default function AddBoardingRoomModal({
  isOpen,
  onClose,
  onAdd,
}: AddBoardingRoomModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    universities: [] as string[],
    rating: "0",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to add a boarding room");
      return;
    }

    if (!formData.name || !formData.description || !formData.image || !formData.price || formData.universities.length === 0) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const boardingRoomData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        ownerId: auth.currentUser.uid,
        createdAt: new Date(),
        type: 'boarding'
      };

      const docRef = await addDoc(collection(db, "boardingPlaces"), boardingRoomData);
      await onAdd({ id: docRef.id, ...boardingRoomData });
      toast.success("Boarding room added successfully");
      onClose();
      setFormData({
        name: "",
        description: "",
        image: "",
        price: "",
        universities: [],
        rating: "0",
      });
    } catch (error) {
      console.error("Error adding boarding room:", error);
      toast.error("Failed to add boarding room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-primary" />
            Add New Boarding Room
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] px-6">
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <BoardingRoomFormFields
              formData={formData}
              setFormData={setFormData}
            />

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
                {isSubmitting ? (
                  <>
                    <Store className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Room"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}