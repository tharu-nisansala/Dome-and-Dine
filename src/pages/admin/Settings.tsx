import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SystemSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxOrdersPerDay: number;
  systemNotifications: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxOrdersPerDay: 100,
    systemNotifications: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "system_settings", "general"), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SystemSettings);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSettingChange = async (key: keyof SystemSettings, value: any) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      await setDoc(doc(db, "system_settings", "general"), updatedSettings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/admin/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Maintenance Mode</h3>
              <p className="text-sm text-muted-foreground">
                Enable maintenance mode to temporarily disable user access
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                handleSettingChange("maintenanceMode", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Allow New Registrations</h3>
              <p className="text-sm text-muted-foreground">
                Control whether new users can register on the platform
              </p>
            </div>
            <Switch
              checked={settings.allowNewRegistrations}
              onCheckedChange={(checked) =>
                handleSettingChange("allowNewRegistrations", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">Maximum Orders Per Day</h3>
            <p className="text-sm text-muted-foreground">
              Set the maximum number of orders allowed per day
            </p>
            <Input
              type="number"
              value={settings.maxOrdersPerDay}
              onChange={(e) =>
                handleSettingChange("maxOrdersPerDay", parseInt(e.target.value))
              }
              className="max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-medium">System Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Set system-wide notification message
            </p>
            <Input
              value={settings.systemNotifications}
              onChange={(e) =>
                handleSettingChange("systemNotifications", e.target.value)
              }
              placeholder="Enter system notification message"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;