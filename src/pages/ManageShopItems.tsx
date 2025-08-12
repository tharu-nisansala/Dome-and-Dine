import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Package2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShopItemForm } from "@/components/shop/ShopItemForm";
import { ManageShopItemCard } from "@/components/shop/ManageShopItemCard";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { ShopItem } from "@/types/ShopItem";

export default function ManageShopItems() {
  const { shopId } = useParams();
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!shopId || !user) return;

    const q = query(collection(db, "shopItems"), where("shopId", "==", shopId));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ShopItem[];
        setItems(itemsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching items:", error);
        toast.error("Failed to fetch items");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shopId, user]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopId) return;

    try {
      await addDoc(collection(db, "shopItems"), {
        ...newItem,
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock),
        shopId,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
      toast.success("Item added successfully");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "shopItems", itemId));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEditItem = async (itemId: string, updatedItem: Partial<ShopItem>) => {
    if (!user) return;
    
    try {
      const itemRef = doc(db, "shopItems", itemId);
      await updateDoc(itemRef, {
        ...updatedItem,
        updatedAt: serverTimestamp(),
      });
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <Package2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Manage Shop Items</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <ShopItemForm
                newItem={newItem}
                setNewItem={setNewItem}
                onSubmit={handleAddItem}
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ManageShopItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
            />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No items yet</h3>
              <p className="text-gray-500 mt-1">Start by adding your first shop item</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}