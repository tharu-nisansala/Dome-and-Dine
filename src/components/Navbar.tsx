import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { auth, db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { NavLinks } from "./navbar/NavLinks";
import { MobileMenu } from "./navbar/MobileMenu";
import { SearchBar } from "./navbar/SearchBar";
import { UserMenu } from "./navbar/UserMenu";

interface UserData {
  role: 'student' | 'shop_owner';
  isVerified?: boolean;
}

const Navbar = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [userRole, setUserRole] = useState<'student' | 'shop_owner' | 'admin' | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          // Check admin collection first
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            setUserRole('admin');
            setIsVerified(adminData.isVerified || false);
            return;
          }

          // Check other collections if not admin
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const shopOwnerDoc = await getDoc(doc(db, 'shop_owners', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUserRole(userData.role);
          } else if (shopOwnerDoc.exists()) {
            setUserRole('shop_owner');
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
        setIsVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/4573185d-78c5-4719-a116-f9c7154feba9.png"
            alt="Dorm & Dine"
            className="h-12 w-auto"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Navigation Links */}
        <NavLinks userRole={userRole} isVerified={isVerified} />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          userRole={userRole}
          isVerified={isVerified}
          onClose={() => setIsMenuOpen(false)}
        />

        {/* Search and Auth Section */}
        <div className="flex items-center space-x-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearch}
          />
          <UserMenu
            user={user}
            userRole={userRole}
            isVerified={isVerified}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;