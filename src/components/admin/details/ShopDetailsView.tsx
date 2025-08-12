import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Mail, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ShopDetailsViewProps {
  shop: any;
}

export const ShopDetailsView = ({ shop }: ShopDetailsViewProps) => {
  return (
    <div className="p-6 space-y-6 bg-white rounded-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">{shop.name || 'No Name'}</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4 text-primary" />
            <span>{shop.contact?.email}</span>
          </div>
        </div>
        <Badge 
          variant={shop.isOpen ? "success" : "secondary"}
          className={`${
            shop.isOpen 
              ? "bg-green-100 text-green-800 hover:bg-green-200" 
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {shop.isOpen ? "Open" : "Closed"}
        </Badge>
      </div>

      <Separator />

      <div className="grid gap-4">
        {shop.contact?.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-gray-700">{shop.contact.phone}</span>
          </div>
        )}

        {shop.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-gray-700">
              {shop.location.address}
              {shop.location.city && `, ${shop.location.city}`}
            </span>
          </div>
        )}

        {shop.businessHours && (
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-gray-700">
              <span>{shop.businessHours.open} - {shop.businessHours.close}</span>
              {shop.businessHours.daysOpen && (
                <span className="block text-sm text-gray-500">
                  ({shop.businessHours.daysOpen.join(", ")})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {shop.description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-600 whitespace-pre-wrap">{shop.description}</p>
          </div>
        </>
      )}

      {shop.universities && shop.universities.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Universities Served</h4>
            <div className="flex flex-wrap gap-2">
              {shop.universities.map((university: string, index: number) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {university}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};