import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export const CartItem = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex gap-4">
        <div className="relative w-24 h-24 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <p className="text-primary font-medium text-lg">
            Rs. {price.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(id, quantity - 1)}
              className="h-8 w-8"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(id, quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onRemove(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};