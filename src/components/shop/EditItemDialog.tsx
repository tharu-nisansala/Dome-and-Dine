import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Package2, ImageIcon, DollarSign, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedItem: any) => Promise<void>;
  initialData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
}

export const EditItemDialog = ({ isOpen, onClose, onSubmit, initialData }: EditItemDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editForm, setEditForm] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialData.imageUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (Number(editForm.price) < 0) {
        throw new Error("Price cannot be negative");
      }

      if (Number(editForm.stock) < 0) {
        throw new Error("Stock cannot be negative");
      }

      const updatedData = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        imageUrl: editForm.imageUrl.trim(),
      };

      await onSubmit(updatedData);
      onClose();
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setEditForm(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Package2 className="h-6 w-6 text-primary" />
            Edit Item
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <Label htmlFor="name" className="text-base font-semibold">Item Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="h-11"
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label htmlFor="description" className="text-base font-semibold">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px] resize-none"
                placeholder="Enter item description"
                required
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                min="0"
                step="0.01"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="stock" className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={editForm.stock}
                onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                min="0"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label htmlFor="imageUrl" className="text-base font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={editForm.imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="h-11"
                placeholder="Enter image URL"
                required
              />
              
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-lg overflow-hidden border shadow-sm"
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={() => setImagePreview("")}
                  />
                  <Badge className="absolute top-2 right-2">Preview</Badge>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-32"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-32"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};