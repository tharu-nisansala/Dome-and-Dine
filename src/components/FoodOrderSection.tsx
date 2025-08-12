import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Store } from "lucide-react";
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { FoodShop } from "@/types/FoodShop";
import { FoodShopCard } from "./food/FoodShopCard";
import { UniversityFilter } from "./food/UniversityFilter";
import { motion } from "framer-motion";

const FoodOrderSection = () => {
  const [foodShops, setFoodShops] = useState<FoodShop[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchFoodShops = async (loadMore: boolean = false) => {
    setLoading(true);
    try {
      let foodShopsQuery = query(
        collection(db, 'foodShops'),
        orderBy('name'),
        limit(6)
      );

      if (loadMore && lastVisible) {
        foodShopsQuery = query(foodShopsQuery, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(foodShopsQuery);
      
      if (!querySnapshot.empty) {
        const newShops = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as FoodShop)
        }));
        
        setFoodShops(prev => loadMore ? [...prev, ...newShops] : newShops);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 6);
      } else {
        setHasMore(false);
        if (!loadMore) {
          setFoodShops([]);
        }
      }
    } catch (error) {
      console.error('Error fetching food shops:', error);
      toast.error("Failed to fetch food shops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodShops();
  }, []);

  const handleOrderNow = (shop: FoodShop) => {
    navigate(`/shop/${shop.id}/items`, { 
      state: { 
        shopId: shop.id, 
        shopName: shop.name 
      } 
    });
  };

  const handleReset = () => {
    setSelectedUniversity('');
  };

  const filteredShops = selectedUniversity
    ? foodShops.filter(shop => shop.universities.includes(selectedUniversity))
    : foodShops;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4 bg-white/50 backdrop-blur-sm p-3 rounded-full shadow-sm">
            <Store className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 md:text-5xl">
              Food Shops
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover and order from the best local food shops near your campus
          </p>
          
          <UniversityFilter
            selectedUniversity={selectedUniversity}
            onUniversityChange={setSelectedUniversity}
            onReset={handleReset}
          />
        </motion.div>

        {loading && !foodShops.length && (
          <div className="flex justify-center py-8">
            <ClipLoader size={50} color="#3498db" />
          </div>
        )}

        {filteredShops.length === 0 && !loading ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-32 bg-white/50 rounded-2xl backdrop-blur-sm border border-gray-100 shadow-xl"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                <Store className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-gray-500 text-lg">
                {selectedUniversity 
                  ? `No food shops available for ${selectedUniversity}.`
                  : 'No food shops available.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <FoodShopCard
                key={shop.id}
                shop={shop}
                onOrderClick={handleOrderNow}
                isOrderEnabled={!!selectedUniversity}
              />
            ))}
          </div>
        )}

        {hasMore && filteredShops.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={() => fetchFoodShops(true)}
              variant="outline"
              className="animate-fade-in"
              disabled={loading}
            >
              {loading ? 'Loading more...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodOrderSection;