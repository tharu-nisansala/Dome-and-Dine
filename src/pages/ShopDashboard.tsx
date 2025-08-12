import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Icons } from "../components/icons";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ProfileUpdateDialog } from "../components/shop/ProfileUpdateDialog";
import { toast } from "sonner";
import { useBookedBoardings } from "@/hooks/useBookedBoardings";
import { DashboardHeader } from "@/components/shop/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/shop/dashboard/DashboardContent";
import type { ShopData } from "@/types/dashboard";
import type { FoodShop } from "@/types/FoodShop";
import type { BoardingPlace } from "@/types/boardingPlaceTypes";

const ShopDashboard = () => {
  const [user] = useAuthState(auth);
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [foodShops, setFoodShops] = useState<FoodShop[]>([]);
  const [boardingPlaces, setBoardingPlaces] = useState<BoardingPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { data: bookedBoardings = [] } = useBookedBoardings(user?.uid);

  const fetchShopData = async () => {
    if (!user) return;

    try {
      const shopOwnerQuery = query(
        collection(db, "shop_owners"),
        where("uid", "==", user.uid)
      );
      const shopOwnerSnapshot = await getDocs(shopOwnerQuery);

      if (!shopOwnerSnapshot.empty) {
        const data = shopOwnerSnapshot.docs[0].data() as ShopData;
        setShopData(data);
      }

      const foodShopsQuery = query(
        collection(db, "foodShops"),
        where("ownerId", "==", user.uid)
      );
      const foodShopsSnapshot = await getDocs(foodShopsQuery);
      const foodShopsData = foodShopsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FoodShop[];
      setFoodShops(foodShopsData);

      const boardingQuery = query(
        collection(db, "boardingPlaces"),
        where("ownerId", "==", user.uid)
      );
      const boardingSnapshot = await getDocs(boardingQuery);
      const boardingData = boardingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BoardingPlace[];
      setBoardingPlaces(boardingData);

    } catch (error) {
      console.error("Error fetching shop data:", error);
      toast.error("Failed to load shop data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [user]);

  const handleProfileUpdate = (newProfileUrl: string) => {
    if (shopData) {
      setShopData({
        ...shopData,
        profileUrl: newProfileUrl
      });
    }
  };

  const dashboardStats = {
    totalFoodShops: foodShops.length,
    totalBoardingPlaces: boardingPlaces.length,
    activeOrders: 0,
    bookedBoardings: bookedBoardings.length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Icons name="spinner" className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Shop Data Found</h2>
          <p className="text-gray-600">Please complete your shop registration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <DashboardHeader
          shopData={shopData}
          userPhotoURL={user?.photoURL}
          onProfileUpdate={() => setIsProfileDialogOpen(true)}
          foodShopsCount={foodShops.length}
          boardingPlacesCount={boardingPlaces.length}
          onNavigate={navigate}
        />

        <DashboardContent
          shopData={shopData}
          stats={dashboardStats}
          bookedBoardings={bookedBoardings}
          boardingPlacesCount={boardingPlaces.length}
          ownerId={user?.uid || ""}
        />

        <ProfileUpdateDialog
          open={isProfileDialogOpen}
          onClose={() => setIsProfileDialogOpen(false)}
          currentProfileUrl={shopData.profileUrl || user?.photoURL || ""}
          onProfileUpdate={handleProfileUpdate}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ShopDashboard;