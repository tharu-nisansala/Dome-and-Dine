import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebaseConfig';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { FoodShop } from "../../types/FoodShop";
import { BoardingPlace } from "../../types/boardingPlaceTypes";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { SearchAndFilter } from "../../components/admin/shops/SearchAndFilter";
import { ShopCard } from "../../components/admin/shops/ShopCard";
import { DetailModal } from "../../components/admin/DetailModal";
import { EditShopModal } from "../../components/admin/shops/EditShopModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

export default function ManageShops() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'foodShops' | 'boardingPlaces' | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<(FoodShop | BoardingPlace) | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'foodShop' | 'boardingPlace'>('foodShop');
  const [detailType, setDetailType] = useState<'shops' | 'boardings'>('shops');
  const navigate = useNavigate();

  const { data: foodShops, isLoading: isLoadingFoodShops, refetch: refetchFoodShops } = useQuery({
    queryKey: ["admin-food-shops"],
    queryFn: async () => {
      const shopsSnapshot = await getDocs(collection(db, "foodShops"));
      return shopsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as FoodShop[];
    }
  });

  const { data: boardingPlaces, isLoading: isLoadingBoarding, refetch: refetchBoardingPlaces } = useQuery({
    queryKey: ["admin-boarding-places"],
    queryFn: async () => {
      const boardingSnapshot = await getDocs(collection(db, "boardingPlaces"));
      return boardingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as BoardingPlace[];
    }
  });

  const handleDelete = async () => {
    if (!deleteItemId || !deleteType) return;
    
    try {
      await deleteDoc(doc(db, deleteType, deleteItemId));
      toast.success(`${deleteType === 'foodShops' ? 'Food shop' : 'Boarding place'} deleted successfully`);
      if (deleteType === 'foodShops') {
        refetchFoodShops();
      } else {
        refetchBoardingPlaces();
      }
      setDeleteItemId(null);
      setDeleteType(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (item: FoodShop | BoardingPlace) => {
    setSelectedItem(item);
    setSelectedItemType('isOpen' in item ? 'foodShop' : 'boardingPlace');
    setIsEditModalOpen(true);
  };

  const handleView = (item: FoodShop | BoardingPlace) => {
    setSelectedItems([item]);
    setDetailType('isOpen' in item ? 'shops' : 'boardings');
    setIsDetailModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedItemType === 'foodShop') {
      refetchFoodShops();
    } else {
      refetchBoardingPlaces();
    }
  };

  const handleExport = () => {
    try {
      const data = {
        foodShops,
        boardingPlaces
      };
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'shops-data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const filteredFoodShops = foodShops?.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBoardingPlaces = boardingPlaces?.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingFoodShops || isLoadingBoarding) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-6 space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4 flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Shop & Boarding Management</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onExport={handleExport}
            />

            <Tabs defaultValue="foodshops" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="foodshops" className="flex items-center gap-2">
                  Food Shops ({filteredFoodShops?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="boarding" className="flex items-center gap-2">
                  Boarding Places ({filteredBoardingPlaces?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="foodshops" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFoodShops?.map((shop) => (
                    <ShopCard
                      key={shop.id}
                      item={shop}
                      type="foodShop"
                      onDelete={(id) => {
                        setDeleteItemId(id);
                        setDeleteType('foodShops');
                      }}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))}
                </div>
                {filteredFoodShops?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No food shops found</p>
                )}
              </TabsContent>

              <TabsContent value="boarding" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredBoardingPlaces?.map((place) => (
                    <ShopCard
                      key={place.id}
                      item={place}
                      type="boardingPlace"
                      onDelete={(id) => {
                        setDeleteItemId(id);
                        setDeleteType('boardingPlaces');
                      }}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))}
                </div>
                {filteredBoardingPlaces?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No boarding places found</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Footer />

      <DetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        type={detailType}
        data={selectedItems}
      />

      {selectedItem && (
        <EditShopModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          type={selectedItemType}
          onUpdate={handleUpdate}
        />
      )}

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteItemId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

