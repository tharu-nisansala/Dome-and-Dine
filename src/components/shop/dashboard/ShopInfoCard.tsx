import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Store, Building2, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface ShopInfoCardProps {
  shopName: string;
  businessRegistrationNumber: string;
  shopCategory: string;
  shopAddress: string;
  telephone: string;
  email: string;
}

export const ShopInfoCard = ({
  shopName,
  businessRegistrationNumber,
  shopCategory,
  shopAddress,
  telephone,
  email,
}: ShopInfoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="h-full"
    >
      <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Shop Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <Store className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Shop Name</p>
                  <p className="text-sm text-gray-600 break-words">{shopName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Registration No</p>
                  <p className="text-sm text-gray-600 break-words">{businessRegistrationNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Store className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-sm text-gray-600 break-words">{shopCategory}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-600 break-words">{shopAddress}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-sm text-gray-600 break-words">{telephone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600 break-words">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};