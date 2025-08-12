import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShopItemImage } from "./ShopItemImage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

interface ShopItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    ownerId: string;
  };
}

export const ShopItemCard = ({ item }: ShopItemCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }

    if (item.stock <= 0) {
      toast.error("Item is out of stock");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Adding item to cart:", { userId: user.uid, itemId: item.id });

      // Check if item already exists in cart
      const cartQuery = query(
        collection(db, "cart_items"),
        where("userId", "==", user.uid),
        where("itemId", "==", item.id)
      );
      
      const cartSnapshot = await getDocs(cartQuery);
      
      if (!cartSnapshot.empty) {
        toast.error("Item already in cart");
        return;
      }

      // Create cart item with all required fields
      const cartItem = {
        userId: user.uid,
        itemId: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: 1,
        imageUrl: item.imageUrl || "",
        ownerId: item.ownerId,
        createdAt: new Date(),
      };

      console.log("Cart item to be added:", cartItem);

      // Add item to cart collection
      const docRef = await addDoc(collection(db, "cart_items"), cartItem);
      console.log("Document written with ID:", docRef.id);

      toast.success("Item added to cart!");
      navigate('/cart');
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
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

            <Button 
              className="w-full gap-2" 
              disabled={item.stock === 0 || isLoading}
              variant={item.stock === 0 ? "secondary" : "default"}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {isLoading ? 'Adding...' : item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};