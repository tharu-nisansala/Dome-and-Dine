import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ShopSettings {
  shopName: string;
  businessRegistrationNumber: string;
  shopAddress: string;
  shopCategory: string;
  telephone: string;
  email: string;
  description: string;
  openingHours: string;
}

interface ShopSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShopSettingsDialog = ({ open, onOpenChange }: ShopSettingsDialogProps) => {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && auth.currentUser) {
      fetchShopSettings();
    }
  }, [open]);

  const fetchShopSettings = async () => {
    if (!auth.currentUser) return;

    try {
      const docRef = doc(db, "shop_owners", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          shopName: data.shopName || '',
          businessRegistrationNumber: data.businessRegistrationNumber || '',
          shopAddress: data.shopAddress || '',
          shopCategory: data.shopCategory || '',
          telephone: data.telephone || '',
          email: data.email || '',
          description: data.description || '',
          openingHours: data.openingHours || ''
        });
      } else {
        toast.error("Shop not found. Please complete your registration.");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load shop settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShopSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !settings) return;

    setIsSaving(true);
    try {
      const docRef = doc(db, "shop_owners", auth.currentUser.uid);
      const updateData = {
        ...settings
      };

      await updateDoc(docRef, updateData);
      toast.success("Settings updated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shop Settings</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!settings) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shop Settings</DialogTitle>
          </DialogHeader>
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">No Shop Data Found</h2>
            <p className="text-muted-foreground">Please complete your shop registration</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Shop Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={settings.shopName}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessRegistrationNumber">Registration Number</Label>
              <Input
                id="businessRegistrationNumber"
                value={settings.businessRegistrationNumber}
                onChange={(e) => handleInputChange("businessRegistrationNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopCategory">Category</Label>
              <Input
                id="shopCategory"
                value={settings.shopCategory}
                onChange={(e) => handleInputChange("shopCategory", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Telephone</Label>
              <Input
                id="telephone"
                value={settings.telephone}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">Opening Hours</Label>
              <Input
                id="openingHours"
                value={settings.openingHours}
                onChange={(e) => handleInputChange("openingHours", e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="shopAddress">Address</Label>
              <Textarea
                id="shopAddress"
                value={settings.shopAddress}
                onChange={(e) => handleInputChange("shopAddress", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};