import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, GraduationCap, Calendar, Store } from "lucide-react";
import { format } from "date-fns";

interface UserDetailsViewProps {
  user: any;
}

export const UserDetailsView = ({ user }: UserDetailsViewProps) => {
  return (
    <div key={user.uid} className="p-6 border-b last:border-0 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{user.fullName || 'No Name'}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4 text-primary" />
            <span>{user.email}</span>
          </div>
        </div>
        <Badge 
          variant={user.userType === 'shop_owner' ? 'secondary' : 'default'}
          className={user.userType === 'shop_owner' ? 'bg-orange-100 text-orange-800' : 'bg-primary/10 text-primary'}
        >
          {user.userType === 'shop_owner' ? 'Shop Owner' : user.userType}
        </Badge>
      </div>

      <div className="grid gap-3">
        {user.telephone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 text-primary" />
            <span>{user.telephone}</span>
          </div>
        )}

        {user.address && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{user.address}</span>
          </div>
        )}

        {user.university && (
          <div className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>{user.university}</span>
          </div>
        )}

        {user.shopName && (
          <div className="flex items-center gap-2 text-gray-600">
            <Store className="h-4 w-4 text-primary" />
            <span>{user.shopName}</span>
          </div>
        )}

        {user.createdAt && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Joined: {format(new Date(user.createdAt.toDate()), 'PPp')}</span>
          </div>
        )}
      </div>

      {user.provider && (
        <div className="mt-4">
          <Badge variant="outline">
            Sign in with {user.provider}
          </Badge>
        </div>
      )}
    </div>
  );
};