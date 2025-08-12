import { useState, useRef } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface ProfileUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  currentProfileUrl: string;
  onProfileUpdate?: (newUrl: string) => void;
}

const IMGUR_CLIENT_ID = "0ffc4aed9929402";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ProfileUpdateDialog = ({ open, onClose, currentProfileUrl, onProfileUpdate }: ProfileUpdateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Note: We can't delete old Imgur images with Client ID only
      // Would need OAuth token with delete scope for that
      console.log('Previous profile URL:', currentProfileUrl);

      // Check if document exists
      const userDocRef = doc(db, "shop_owners", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userDocRef, {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          profileUrl: imgurUrl,
          createdAt: new Date()
        });
      } else {
        // Update existing document
        await updateDoc(userDocRef, {
          profileUrl: imgurUrl,
        });
      }

      // Update auth profile
      await updateProfile(auth.currentUser, { photoURL: imgurUrl });

      // Notify parent component about the update
      onProfileUpdate?.(imgurUrl);

      toast.success("Profile picture updated successfully!");
      onClose();
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a new profile picture to update your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={currentProfileUrl} />
            <AvatarFallback>
              {auth.currentUser?.email?.charAt(0).toUpperCase()}
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
              {loading ? "Uploading..." : "Change Picture"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};