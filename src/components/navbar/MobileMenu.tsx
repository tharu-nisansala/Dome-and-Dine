import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  userRole: 'student' | 'shop_owner' | 'admin' | null;
  isVerified: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, userRole, isVerified, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 p-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col space-y-4 mt-16">
          <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
          {userRole === 'student' && (
            <>
              <Link to="/food-order" className="text-gray-700 hover:text-primary">Order Food</Link>
              <Link to="/cart" className="text-gray-700 hover:text-primary">Cart</Link>
            </>
          )}
          {userRole === 'shop_owner' && (
            <>
              <Link to="/manage-food-shops" className="text-gray-700 hover:text-primary">Manage Shops</Link>
              <Link to="/manage-boarding-rooms" className="text-gray-700 hover:text-primary">Manage Boarding Rooms</Link>
            </>
          )}
          {userRole === 'admin' && isVerified && (
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary">Admin Dashboard</Link>
          )}
          <Link to="/about" className="text-gray-700 hover:text-primary">About Us</Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};