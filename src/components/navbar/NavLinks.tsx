import { Link } from "react-router-dom";
import { Home, Info, Phone, UtensilsCrossed, Building, ShoppingCart, Home as HomeIcon } from "lucide-react";

interface NavLinksProps {
  userRole: 'student' | 'shop_owner' | 'admin' | null;
  isVerified: boolean;
}

export const NavLinks = ({ userRole, isVerified }: NavLinksProps) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-gray-700 hover:text-primary flex items-center gap-2">
        <Home className="w-4 h-4" />
        Home
      </Link>
      {userRole === 'student' && (
        <>
          <Link to="/food-order" className="text-gray-700 hover:text-primary flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Order Food
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-primary flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart
          </Link>
        </>
      )}
      {userRole === 'shop_owner' && (
        <>
          <Link to="/manage-food-shops" className="text-gray-700 hover:text-primary flex items-center gap-2">
            <Building className="w-4 h-4" />
            Manage Shops
          </Link>
          <Link to="/manage-boarding-rooms" className="text-gray-700 hover:text-primary flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Manage Boarding Rooms
          </Link>
        </>
      )}
      {userRole === 'admin' && isVerified && (
        <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary flex items-center gap-2">
          <Building className="w-4 h-4" />
          Admin Dashboard
        </Link>
      )}
      <Link to="/about" className="text-gray-700 hover:text-primary flex items-center gap-2">
        <Info className="w-4 h-4" />
        About Us
      </Link>
      <Link to="/contact" className="text-gray-700 hover:text-primary flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Contact Us
      </Link>
    </div>
  );
};