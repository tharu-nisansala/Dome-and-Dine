import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
    Home,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopData {
    shopName: string;
    isVerified: boolean;
}

export function ShopLayout({ children }: { children: React.ReactNode }) {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [shopData, setShopData] = useState<ShopData | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const fetchShopData = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const docRef = doc(db, "shop_owners", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setShopData({
                        shopName: docSnap.data().shopName,
                        isVerified: docSnap.data().isVerified
                    });
                } else {
                    toast({
                        title: "Shop not found",
                        description: "Please complete your shop registration",
                        variant: "destructive",
                    });
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
                toast({
                    title: "Error",
                    description: "Failed to load shop data",
                    variant: "destructive",
                });
            }
        };

        fetchShopData();
    }, [user, navigate]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
            toast({
                title: "Error",
                description: "Failed to sign out",
                variant: "destructive",
            });
        }
    };

    const navigationItems = [
        { path: '/shop-dashboard', label: 'Dashboard', icon: Home },
        { path: '/shop/products', label: 'Products', icon: Package },
        { path: '/shop/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/shop/settings', label: 'Settings', icon: Settings },
    ];

    const isCurrentPath = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-xl font-bold text-gray-900">{shopData?.shopName || 'Shop Dashboard'}</h1>
                            {shopData?.isVerified && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                </span>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar Navigation */}
                <nav className={cn(
                    "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
                    {
                        "translate-x-0": isMenuOpen,
                        "-translate-x-full": !isMenuOpen
                    }
                )}>
                    <div className="p-4 space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const active = isCurrentPath(item.path);
                            return (
                                <Button
                                    key={item.path}
                                    variant={active ? "default" : "ghost"}
                                    className={cn(
                                        "w-full justify-start text-sm font-medium transition-colors",
                                        active ? "bg-primary text-primary-foreground" : "hover:bg-gray-100",
                                        "group flex items-center px-3 py-2 rounded-lg"
                                    )}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <Icon className={cn(
                                        "mr-3 h-4 w-4",
                                        active ? "text-primary-foreground" : "text-gray-500 group-hover:text-gray-900"
                                    )} />
                                    {item.label}
                                    {active && <ChevronRight className="ml-auto h-4 w-4" />}
                                </Button>
                            );
                        })}
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 mt-4"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </nav>

                {/* Main Content */}
                <main className={cn(
                    "flex-1 p-6 transition-all duration-200",
                    {
                        "md:ml-64": !isMenuOpen
                    }
                )}>
                    <div className="container mx-auto max-w-7xl">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}