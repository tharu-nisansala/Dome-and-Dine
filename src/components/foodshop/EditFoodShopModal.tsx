import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";
import { Store } from "lucide-react";
import { useState } from "react";
import { FoodShopFormFields } from "./FoodShopFormFields";
import type { FoodShop } from "@/types/FoodShop";

interface EditFoodShopModalProps {
  open: boolean;
  onClose: () => void;
  foodShop: FoodShop;
  onUpdate: (foodShop: FoodShop) => void;
}

const EditFoodShopModal = ({ open, onClose, foodShop, onUpdate }: EditFoodShopModalProps) => {
  const [formData, setFormData] = useState({
    name: foodShop.name || "",
    description: foodShop.description || "",
    image: foodShop.image || "",
    rating: foodShop.rating || "0",
    universities: foodShop.universities || [],
    isOpen: foodShop.isOpen ?? true,
    location: {
      address: foodShop.location?.address || "",
      city: foodShop.location?.city || "",
      coordinates: foodShop.location?.coordinates ? {
        lat: foodShop.location.coordinates.latitude,
        lng: foodShop.location.coordinates.longitude
      } : undefined
    },
    contact: {
      phone: foodShop.contact?.phone || "",
      email: foodShop.contact?.email || "",
      website: foodShop.contact?.website || "",
    },
    businessHours: foodShop.businessHours || {
      open: "09:00",
      close: "17:00",
      daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        ...formData,
        location: {
          ...formData.location,
          coordinates: formData.location.coordinates ? {
            latitude: formData.location.coordinates.lat,
            longitude: formData.location.coordinates.lng
          } : undefined
        },
        updatedAt: new Date()
      };

      await updateDoc(doc(db, "foodShops", foodShop.id), updatedData);
      onUpdate({ ...foodShop, ...updatedData });
      toast.success("Food shop updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update food shop");
      console.error("Error updating food shop:", error);
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
            Edit Food Shop
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
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodShopModal;