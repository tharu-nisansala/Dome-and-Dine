import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { doc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { Store } from "lucide-react";
import { useState } from "react";
import { FoodShopFormFields } from "./FoodShopFormFields";
import type { FoodShop } from "@/types/FoodShop";

interface AddFoodShopModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (foodShop: FoodShop) => void;
}

const AddFoodShopModal = ({ open, onClose, onAdd }: AddFoodShopModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    rating: "0",
    universities: [] as string[],
    isOpen: true,
    location: {
      address: "",
      city: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    businessHours: {
      open: "09:00",
      close: "17:00",
      daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to add a food shop");
      return;
    }

    setLoading(true);
    try {
      const foodShopData = {
        ...formData,
        ownerId: auth.currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      } as FoodShop;

      const docRef = await addDoc(collection(db, "foodShops"), foodShopData);
      onAdd({ id: docRef.id, ...foodShopData });
      toast.success("Food shop added successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to add food shop");
      console.error("Error adding food shop:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Store className="h-6 w-6 text-primary" />
            Add New Food Shop
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <FoodShopFormFields formData={formData} setFormData={setFormData} />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-32"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-32"
            >
              {loading ? "Adding..." : "Add Shop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodShopModal;