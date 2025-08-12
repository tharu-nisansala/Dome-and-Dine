import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/types/Product';

export interface ProductCardProps {
  product: Product;
  quantity: number;
  selected?: boolean;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onSelect: () => void;
  onUpdate: (updatedData: Partial<Product>) => void;
  onDelete: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  selected,
  onQuantityChange,
  onAddToCart,
  onSelect,
  onUpdate,
  onDelete
}) => {
  return (
    <Card className={`relative ${selected ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-primary font-bold">${product.price}</p>
          </div>
          
          <p className="text-sm text-gray-500">{product.description}</p>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded"
            />
            <Button onClick={onAddToCart} variant="default" size="sm">
              Add to Cart
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSelect} variant="outline" size="sm">
              {selected ? 'Deselect' : 'Select'}
            </Button>
            <Button onClick={onDelete} variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};