import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { ShopItemImage } from "./ShopItemImage";
import { EditItemDialog } from "./EditItemDialog";
import { Badge } from "../../components/ui/badge";

interface ManageShopItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    ownerId: string;
  };
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, updatedItem: Partial<ManageShopItemCardProps['item']>) => Promise<void>;
}

export const ManageShopItemCard = ({ item, onDelete, onEdit }: ManageShopItemCardProps) => {
  const [user] = useAuthState(auth);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSubmit = async (updatedData: Partial<ManageShopItemCardProps['item']>) => {
    if (!user) {
      toast.error("You must be logged in to update items");
      return;
    }

    try {
      setIsLoading(true);
      await onEdit(item.id, updatedData);
      setIsEditDialogOpen(false);
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(item.id);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="relative">
            <ShopItemImage imageUrl={item.imageUrl} name={item.name} />
            <Badge 
              variant={item.stock > 0 ? "default" : "destructive"}
              className="absolute top-2 right-2"
            >
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">
                Rs. {item.price.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={{
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          imageUrl: item.imageUrl,
        }}
      />
    </motion.div>
  );
};
