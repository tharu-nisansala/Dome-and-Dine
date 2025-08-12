import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Store, ShoppingCart, Package2, Info } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShopItemCard } from "@/components/shop/ShopItemCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  ownerId: string;
}

export default function ShopItemsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const shopData = location.state || { shopId: null, shopName: "Shop" };
  const { shopId, shopName } = shopData;

  useEffect(() => {
    const fetchItems = async () => {
      if (!shopId) {
        navigate("/food-order");
        return;
      }

      try {
        const q = query(collection(db, "shopItems"), where("shopId", "==", shopId));
        const querySnapshot = await getDocs(q);
        const itemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ShopItem[];
        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching items:", error);
        toast.error("Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [shopId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Store className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{shopName}</h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    <Package2 className="h-4 w-4" />
                    Browse our delicious menu items
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 hover:bg-primary/5"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-primary hover:bg-primary/5"
                onClick={() => toast.info("Shop information coming soon!")}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ShopItemCard key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No items available</h3>
              <p className="text-gray-500 mt-1">This shop hasn't added any items yet</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}