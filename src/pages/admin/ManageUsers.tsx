import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import LoadingSpinner from "../../components/LoadingSpinner";
import { FileDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { User, UserStats } from "../../types/user";
import { UserStatsCards } from "../../components/admin/users/UserStats";
import { UserTable } from "../../components/admin/users/UserTable";
import { exportToPDF } from "../../utils/exportUtils";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const [usersSnapshot, shopOwnersSnapshot] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "shop_owners"))
        ]);

        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || 'active'
        })) as User[];

        const shopOwnersData = shopOwnersSnapshot.docs.map((doc) => ({
          id: doc.id,
          userType: 'shop_owner' as const,
          ...doc.data(),
          status: doc.data().status || 'active'
        })) as User[];

        return [...usersData, ...shopOwnersData];
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        throw error;
      }
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await deleteDoc(doc(db, "users", userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'inactive' | 'suspended' }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await updateUserStatusMutation.mutateAsync({ userId, status });
    } catch (error) {
      console.error("Error in handleUpdateUserStatus:", error);
    }
  };

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && user.userType === selectedTab;
  });

  const userStats: UserStats = users?.reduce(
    (acc, user) => {
      acc.total++;
      if (user.userType === "student") acc.students++;
      if (user.userType === "shop_owner") acc.shopOwners++;
      if (user.userType === "admin") acc.admins++;
      return acc;
    },
    { total: 0, students: 0, shopOwners: 0, admins: 0 }
  ) ?? { total: 0, students: 0, shopOwners: 0, admins: 0 };

  if (isLoading) {
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
            <div className="flex justify-between items-center">
              <CardTitle>User Management</CardTitle>
              <Button onClick={() => exportToPDF(filteredUsers || [])} variant="outline" className="flex gap-2">
                <FileDown className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UserStatsCards stats={userStats} />

            <div className="flex items-center space-x-2 mb-6">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <UserTable 
              users={filteredUsers || []} 
              onDeleteUser={handleDeleteUser}
              onUpdateUserStatus={handleUpdateUserStatus}
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}