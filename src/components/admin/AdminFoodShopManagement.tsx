import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodShopsList } from "@/components/admin/FoodShopsList";
import { FoodShop } from "@/types/FoodShop";
import { deleteDoc, doc, collection, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { toast } from 'sonner';
import { Store } from "lucide-react";

interface AdminFoodShopManagementProps {
  onFoodShopDeleted?: () => void;
}

export const AdminFoodShopManagement = ({ onFoodShopDeleted }: AdminFoodShopManagementProps) => {
  const [foodShops, setFoodShops] = useState<FoodShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
        collection(db, "foodShops"),
        (snapshot) => {
          const shopsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as FoodShop[];
          setFoodShops(shopsData);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching food shops:", error);
          toast.error("Failed to fetch food shops");
          setIsLoading(false);
        }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteFoodShop = async (id: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const user = auth.currentUser;

      if (!user) {
        throw new Error("You must be logged in to delete a food shop");
      }

      const docRef = doc(db, "foodShops", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Food shop not found");
      }

      const shopData = docSnap.data();

      // Check if user is owner or admin
      if (shopData.ownerId !== user.uid) {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
          throw new Error("You don't have permission to delete this food shop");
        }
      }

      await deleteDoc(docRef);
      toast.success("Food shop deleted successfully");

      if (onFoodShopDeleted) {
        onFoodShopDeleted();
      }
    } catch (error) {
      console.error("Error deleting food shop:", error);
      toast.error(`Failed to delete food shop: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
          <CardHeader className="border-b border-border/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Food Shops Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
    );
  }

  return (
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b border-border/20 bg-primary/5">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>Food Shops Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <FoodShopsList
              foodShops={foodShops}
              onDeleteClick={handleDeleteFoodShop}
              onEditClick={() => {}}
          />
        </CardContent>
      </Card>
  );
};