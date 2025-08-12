import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FoodShop } from "@/types/FoodShop";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ManageProducts: React.FC = () => {
    const [user] = useAuthState(auth);
    const [foodShops, setFoodShops] = useState<FoodShop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteFoodShopId, setDeleteFoodShopId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

const handleAddProduct = async (newProduct: any) => {
    try {
      const productData = {
        ...newProduct,
        name: newProduct.name,
        description: newProduct.description,
        image: newProduct.image,
        rating: "0",
        universities: [],
        isOpen: true,
        ownerId: auth.currentUser?.uid
      } as FoodShop;

      setFoodShops([...foodShops, productData]);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

    const fetchFoodShops = async () => {
        if (!user) return;
        try {
            console.log('Fetching food shops for user:', user.uid);
            const q = query(
                collection(db, "foodShops"),
                where("ownerId", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const foodShopsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            } as FoodShop));
            console.log('Fetched food shops:', foodShopsData);
            setFoodShops(foodShopsData);
        } catch (error) {
            console.error("Error fetching food shops:", error);
            toast.error("Failed to fetch food shops");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFoodShop = async () => {
        if (!deleteFoodShopId) return;
        
        try {
            console.log('Deleting food shop:', deleteFoodShopId);
            await deleteDoc(doc(db, "foodShops", deleteFoodShopId));
            await fetchFoodShops();
            setIsDeleteOpen(false);
            setDeleteFoodShopId(null);
            toast.success("Food shop deleted successfully");
        } catch (error) {
            console.error("Error deleting food shop:", error);
            toast.error("Failed to delete food shop");
        }
    };

    useEffect(() => {
        fetchFoodShops();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Food Shops</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foodShops.map((foodShop) => (
                        <div key={foodShop.id} className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold">{foodShop.name}</h2>
                            <p className="text-gray-600 mt-2">{foodShop.description}</p>
                            <img 
                                src={foodShop.image} 
                                alt={foodShop.name} 
                                className="w-full h-40 object-cover mt-2 rounded"
                            />
                            <div className="mt-4">
                                <p className="font-medium">Rating: {foodShop.rating}/5</p>
                                <div className="mt-2">
                                    <p className="font-medium mb-2">Universities:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {foodShop.universities.map((university, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary"
                                                className="bg-primary/10 text-primary hover:bg-primary/20"
                                            >
                                                {university}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        setDeleteFoodShopId(foodShop.id);
                                        setIsDeleteOpen(true);
                                    }}
                                    className="w-full"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this food shop?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex justify-end space-x-4">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteFoodShop}>Delete</AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <Footer />
        </div>
    );
};

export default ManageProducts;
