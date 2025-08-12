// pages/shop/settings.tsx
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ShopLayout } from "@/components/layouts/ShopLayout";

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

export default function Settings() {
    const [user] = useAuthState(auth);
    const [settings, setSettings] = useState<ShopSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchShopSettings = async () => {
            if (!user) return;

            try {
                const docRef = doc(db, "shop_owners", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSettings(docSnap.data() as ShopSettings);
                } else {
                    toast({
                        title: "Shop not found",
                        description: "Please complete your shop registration",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast({
                    title: "Error fetching settings",
                    description: "Please try again later",
                    variant: "destructive"
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopSettings();
    }, [user]);

    const handleInputChange = (field: keyof ShopSettings, value: string) => {
        if (settings) {
            setSettings({ ...settings, [field]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !settings) return;

        setIsSaving(true);
        try {
            const docRef = doc(db, "shop_owners", user.uid);
            const updateData = {
                shopName: settings.shopName,
                businessRegistrationNumber: settings.businessRegistrationNumber,
                shopAddress: settings.shopAddress,
                shopCategory: settings.shopCategory,
                telephone: settings.telephone,
                email: settings.email,
                description: settings.description,
                openingHours: settings.openingHours
            };

            await updateDoc(docRef, updateData);
            toast({
                title: "Settings updated successfully",
                variant: "default"
            });
        } catch (error) {
            console.error("Update error:", error);
            toast({
                title: "Error updating settings",
                description: "Please try again later",
                variant: "destructive"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">No Shop Data Found</h2>
                    <p className="text-muted-foreground">Please complete your shop registration</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto p-6 flex-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Shop Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
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

                            <Button
                                type="submit"
                                className="w-full"
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
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}