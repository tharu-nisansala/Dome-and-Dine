import { Link, useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "firebase/auth";

interface UserMenuProps {
  user: User | null;
  userRole: 'student' | 'shop_owner' | 'admin' | null;
  isVerified: boolean;
  onSignOut: () => Promise<void>;
}

export const UserMenu = ({ user, userRole, isVerified, onSignOut }: UserMenuProps) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    switch (userRole) {
      case 'admin':
        return isVerified ? "/admin/dashboard" : "/dashboard";
      case 'shop_owner':
        return "/shop-dashboard";
      case 'student':
        return "/student-dashboard";
      default:
        return "/dashboard";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/signup">
          <Button variant="outline" className="rounded-full text-sm">Sign Up</Button>
        </Link>
        <Link to="/login">
          <Button className="rounded-full bg-primary hover:bg-primary/90 text-sm">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback>
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-red-600">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};