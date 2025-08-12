import { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "../LoadingSpinner"; // Ensure correct import

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMGUR_CLIENT_ID = "0ffc4aed9929402";

const UserProfile = () => {
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [fullName, setFullName] = useState<string>(""); // State for full name
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfile(user.uid);
      } else {
        setLoading(false);
        setError("Please sign in to view your profile");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.profileUrl) {
          setProfileUrl(userData.profileUrl);
        }
        if (userData.displayName) {
          setFullName(userData.displayName); // Fetch the full name from Firestore
        } else {
          // Fallback to email if no display name is set
          setFullName(auth.currentUser?.email || "No name available");
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !auth.currentUser) return;

    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 5MB");
      return;
    }

    setLoading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const base64data = await convertFileToBase64(compressedFile);

      const imgurUrl = await uploadToImgur(base64data);
      await updateUserProfile(imgurUrl);

      setProfileUrl(imgurUrl);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const uploadToImgur = async (base64data: string): Promise<string> => {
    const formData = new FormData();
    formData.append("image", base64data.split(",")[1]);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const result = await response.json();
    return result.data.link;
  };

  const updateUserProfile = async (imgurUrl: string) => {
    if (!auth.currentUser) throw new Error("No authenticated user");

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      profileUrl: imgurUrl,
    });
  };

  if (loading) return <LoadingSpinner />; // If loading is true, show the spinner.

  if (error) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-red-500 text-center">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
    );
  }

  if (!auth.currentUser) {
    return (
        <div className="p-6 text-center text-red-500">
          Please sign in to view your profile
        </div>
    );
  }

  return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-fade-in">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={auth.currentUser?.photoURL || profileUrl} />
            <AvatarFallback>
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
            />
            <Button
                variant="outline"
                disabled={loading}
                className="cursor-pointer"
                onClick={handleButtonClick}
            >
              <Camera className="mr-2 h-4 w-4" />
              {loading ? "Uploading..." : "Update Picture"}
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{fullName}</h2> {/* Full name from Firestore */}
            <p className="text-sm text-gray-500">{auth.currentUser?.email}</p> {/* Email below full name */}
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
