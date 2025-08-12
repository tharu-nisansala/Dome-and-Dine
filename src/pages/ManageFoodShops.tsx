import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Icons } from "@/components/ui/icons";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import AddFoodShopModal from "@/components/foodshop/AddFoodShopModal";
import EditFoodShopModal from "@/components/foodshop/EditFoodShopModal";
import { FoodShopsList } from "@/components/admin/FoodShopsList";
import { FoodShopHeader } from "@/components/foodshop/FoodShopHeader";
import type { FoodShop } from "@/types/FoodShop";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageFoodShops() {
  const [user] = useAuthState(auth);
  const [shops, setShops] = useState<FoodShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<FoodShop | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "foodShops"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shopsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodShop[];
      setShops(shopsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching shops:", error);
      toast.error("Failed to fetch shops");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddShop = async (shopData: FoodShop) => {
    if (!user) return;
    try {
      setShops(prev => [...prev, shopData]);
      toast.success("Shop added successfully");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding shop:", error);
      toast.error("Failed to add shop");
    }
  };

  const handleUpdateShop = async (updatedShop: FoodShop) => {
    try {
      setShops(prev => 
        prev.map(shop => 
          shop.id === updatedShop.id ? updatedShop : shop
        )
      );
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Failed to update shop");
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    try {
      await deleteDoc(doc(db, "foodShops", shopId));
      toast.success("Shop deleted successfully");
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast.error("Failed to delete shop");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/shop-dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          <FoodShopHeader onAddNew={() => setIsAddModalOpen(true)} />
          
          <div className="mt-8">
            <FoodShopsList 
              foodShops={shops} 
              onDeleteClick={handleDeleteShop}
              onEditClick={(shop) => {
                setSelectedShop(shop);
                setIsEditModalOpen(true);
              }}
            />
          </div>

          <AddFoodShopModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddShop}
          />

          {selectedShop && (
            <EditFoodShopModal
              open={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedShop(null);
              }}
              onUpdate={handleUpdateShop}
              foodShop={selectedShop}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
