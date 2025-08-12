import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { toast } from "sonner";
import { FoodShop } from "../../../types/FoodShop";
import { BoardingPlace } from "../../../types/boardingPlaceTypes";
import { UniversitySelector } from "../../foodshop/UniversitySelector";

interface EditShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FoodShop | BoardingPlace;
  type: 'foodShop' | 'boardingPlace';
  onUpdate: () => void;
}

export const EditShopModal = ({ isOpen, onClose, item, type, onUpdate }: EditShopModalProps) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    image: item.image,
    universities: item.universities,
    ...(type === 'foodShop' && { isOpen: (item as FoodShop).isOpen }),
    ...(type === 'boardingPlace' && { price: (item as BoardingPlace).price }),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const docRef = doc(db, type === 'foodShop' ? 'foodShops' : 'boardingPlaces', item.id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date(),
      });

      toast.success(`${type === 'foodShop' ? 'Food shop' : 'Boarding place'} updated successfully`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit {type === 'foodShop' ? 'Food Shop' : 'Boarding Place'}
          </DialogTitle>
          <DialogDescription>
            Make changes to your {type === 'foodShop' ? 'food shop' : 'boarding place'} here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                required
              />
            </div>

            {type === 'foodShop' && (
              <div className="flex items-center justify-between">
                <Label htmlFor="isOpen">Shop Status</Label>
                <Switch
                  id="isOpen"
                  checked={formData.isOpen}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isOpen: checked }))
                  }
                />
              </div>
            )}

            {type === 'boardingPlace' && (
              <div>
                <Label htmlFor="price">Price per Month</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))
                  }
                  min="0"
                  required
                />
              </div>
            )}

            <div>
              <Label>Universities</Label>
              <UniversitySelector
                selectedUniversities={formData.universities}
                onUniversityToggle={(university) => {
                  setFormData(prev => ({
                    ...prev,
                    universities: prev.universities.includes(university)
                      ? prev.universities.filter(u => u !== university)
                      : [...prev.universities, university]
                  }));
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
