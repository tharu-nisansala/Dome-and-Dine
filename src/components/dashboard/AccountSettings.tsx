import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, setDoc, Timestamp } from "firebase/firestore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

interface UserData {
  fullName: string;
  address: string;
  telephone: string;
  university: string;
  email: string;
}

const AccountSettings = () => {
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    address: "",
    telephone: "",
    university: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const universities = [
    "University of Colombo", "Eastern University", "University of Jaffna",
    "University of Kelaniya", "University of Moratuwa", "Open University",
    "University of Peradeniya", "Rajarata University", "University of Ruhuna",
    "Sabaragamuwa University", "South Eastern University", "University of Sri Jayewardenepura",
    "Uva Wellassa University", "University of the Visual and Performing Arts",
    "Wayamba University", "Gampaha Wickramarachchi University", "University of Vavuniya"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData({
          fullName: data.fullName || "",
          address: data.address || "",
          telephone: data.telephone || "",
          university: data.university || "",
          email: auth.currentUser?.email || "",
        });
      } else {
        setUserData(prev => ({
          ...prev,
          email: auth.currentUser?.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data", {
        description: "Please refresh and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Authentication Error", {
        description: "Please sign in to update your details.",
      });
      return;
    }

    if (!userData.fullName || !userData.address || !userData.telephone || !userData.university) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      const { fullName, address, telephone, university } = userData;
      const updatedData = {
        fullName,
        address,
        telephone,
        university,
        email: auth.currentUser.email,
        updatedAt: Timestamp.now(),
      };

      if (docSnap.exists()) {
        await updateDoc(userRef, updatedData);
      } else {
        await setDoc(userRef, {
          ...updatedData,
          createdAt: Timestamp.now(),
        });
      }

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update Failed", {
        description: "There was an error updating your profile. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
    );
  }

  if (!auth.currentUser) {
    return (
        <div className="p-6 text-center text-red-500 min-h-[400px] flex items-center justify-center">
          Please sign in to view account settings
        </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fullName">
              Full Name
            </label>
            <Input
                id="fullName"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full"
                disabled={isUpdating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">
              Address
            </label>
            <Input
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                className="w-full"
                disabled={isUpdating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="telephone">
              Telephone
            </label>
            <Input
                id="telephone"
                name="telephone"
                value={userData.telephone}
                onChange={handleChange}
                placeholder="Enter your telephone number"
                required
                className="w-full"
                disabled={isUpdating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="university">
              University
            </label>
            <select
                id="university"
                name="university"
                value={userData.university}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                disabled={isUpdating}
            >
              <option value="" disabled>Select your university</option>
              {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
              ))}
            </select>
          </div>

          <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white transition-colors"
              disabled={isUpdating}
          >
            {isUpdating ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </div>
            ) : (
                'Update Account'
            )}
          </Button>
        </form>
      </div>
  );
};

export default AccountSettings;
