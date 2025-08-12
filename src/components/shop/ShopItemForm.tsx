import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Package2, ImageIcon, DollarSign, ClipboardList, Store } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShopItemFormProps {
  newItem: {
    name: string;
    description: string;
    price: string;
    stock: string;
    imageUrl: string;
  };
  setNewItem: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    price: string;
    stock: string;
    imageUrl: string;
  }>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting?: boolean;
}

export const ShopItemForm = ({ newItem, setNewItem, onSubmit, isSubmitting }: ShopItemFormProps) => {
  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Add New Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
                <Package2 className="h-4 w-4 text-primary" />
                Item Name
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="mt-1.5"
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-base font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-primary" />
                Description
              </Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="mt-1.5 min-h-[100px] resize-none"
                placeholder="Enter item description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-base font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="mt-1.5"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-base font-medium flex items-center gap-2">
                  <Package2 className="h-4 w-4 text-primary" />
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  className="mt-1.5"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="imageUrl" className="text-base font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="mt-1.5"
                placeholder="Enter image URL"
                required
              />
              {newItem.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-lg overflow-hidden border"
                >
                  <img
                    src={newItem.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            <Store className="h-4 w-4" />
            {isSubmitting ? "Adding Item..." : "Add Item"}
          </Button>
        </form>
      </div>
    </ScrollArea>
  );
};