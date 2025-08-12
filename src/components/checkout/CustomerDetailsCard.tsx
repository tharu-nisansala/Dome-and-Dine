import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface CustomerDetailsCardProps {
  fullName: string;
  telephone: string;
  email: string;
  address: string;
  orderType: string;
  onInputChange: (field: string, value: string) => void;
}

export const CustomerDetailsCard = ({
  fullName,
  telephone,
  email,
  address,
  orderType,
  onInputChange,
}: CustomerDetailsCardProps) => {
  return (
    <Card className="p-6 space-y-6 shadow-lg bg-gray-50">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Customer Details
        </h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => onInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Telephone Number
            </Label>
            <Input
              id="telephone"
              value={telephone}
              onChange={(e) => onInputChange("telephone", e.target.value)}
              placeholder="Enter your telephone number"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              type="email"
              className="bg-white"
            />
          </div>

          {orderType === "delivery" && (
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Delivery Address
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="Enter your delivery address"
                className="bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};