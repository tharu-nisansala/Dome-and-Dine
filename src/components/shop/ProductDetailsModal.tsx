import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "../../types/Product";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onUpdateStock: (id: string, newStock: number) => void;
  isShopOwner?: boolean;
}

const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  onUpdateStock,
  isShopOwner = false,
}: ProductDetailsModalProps) => {
  const handleStockChange = (increment: boolean) => {
    if (!isShopOwner) {
      toast.error("Only shop owners can update stock");
      return;
    }
    const newStock = increment ? product.stock + 1 : Math.max(0, product.stock - 1);
    onUpdateStock(product.id, newStock);
    toast.success(`Stock updated to ${newStock}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">
              Rs. {product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Stock: {product.stock}</span>
            {isShopOwner && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStockChange(false)}
                  disabled={product.stock === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{product.stock}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleStockChange(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
