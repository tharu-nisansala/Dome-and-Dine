import React, { Suspense, useState, useEffect } from "react";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "./components/ui/sonner";
import ManageBoardingRooms from "./pages/ManageBoardingRooms";
import ShopItemsPage from "./pages/ShopItemsPage";
import Cart from "./pages/Cart";
import BoardingCheckout from "./pages/BoardingCheckout";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageShops from "./pages/admin/ManageShops";
import ViewReports from "./pages/admin/ViewReports";
import Settings from "./pages/admin/Settings";

const Index = React.lazy(() => import("./pages/Index"));
const Login = React.lazy(() => import("./pages/Login"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const FoodOrder = React.lazy(() => import("./pages/FoodOrder"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));
const ShopDashboard = React.lazy(() => import("./pages/ShopDashboard"));
const BookingPage = React.lazy(() => import("./pages/BookingPage"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const About = React.lazy(() => import("./pages/About"));
const Offers = React.lazy(() => import("./pages/Offers"));
const Contact = React.lazy(() => import("./pages/Contact"));
const BoardingList = React.lazy(() => import("./pages/BoardingList"));
const OwnerDashboard = React.lazy(() => import("./pages/OwnerDashboard"));
const ManageProducts = React.lazy(() => import("./pages/ManageProducts"));
const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const ManageFoodShops = React.lazy(() => import("./pages/ManageFoodShops"));
const ManageShopItems = React.lazy(() => import("./pages/ManageShopItems"));

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedUserTypes?: string[];
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
    const [user, loading] = useAuthState(auth);
    const [userType, setUserType] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserType = async () => {
            if (!user) {
                setIsChecking(false);
                return;
            }

            try {
                const [adminDoc, shopOwnerDoc, userDoc] = await Promise.all([
                    getDocs(query(collection(db, "admins"), where("uid", "==", user.uid))),
                    getDocs(query(collection(db, "shop_owners"), where("uid", "==", user.uid))),
                    getDocs(query(collection(db, "users"), where("uid", "==", user.uid)))
                ]);

                if (!adminDoc.empty) {
                    setUserType("admin");
                } else if (!shopOwnerDoc.empty) {
                    setUserType("shop_owner");
                } else if (!userDoc.empty) {
                    setUserType(userDoc.docs[0].data().userType);
                }
            } catch (error) {
                console.error("Error checking user type:", error);
            } finally {
                setIsChecking(false);
            }
        };

        if (user) {
            checkUserType();
        }
    }, [user]);

    useEffect(() => {
        if (!isChecking && userType) {
            if (window.location.pathname === '/dashboard') {
                switch (userType) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'shop_owner':
                        navigate('/shop-dashboard');
                        break;
                    case 'student':
                        navigate('/student-dashboard');
                        break;
                    default:
                        break;
                }
            }
        }
    }, [userType, isChecking, navigate]);

    if (loading || isChecking) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedUserTypes && userType && !allowedUserTypes.includes(userType)) {
        switch (userType) {
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            case 'shop_owner':
                return <Navigate to="/shop-dashboard" />;
            case 'student':
                return <Navigate to="/student-dashboard" />;
            default:
                return <Navigate to="/dashboard" />;
        }
    }

    return <>{children}</>;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <h1 className="text-center text-red-500">
                        Something went wrong. Please try again later.
                    </h1>
                </div>
            );
        }

        return this.props.children;
    }
}

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <BrowserRouter>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route
                                path="/manage-food-shops"
                                element={
                                    <ProtectedRoute allowedUserTypes={["shop_owner"]}>
                                        <ManageFoodShops />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/cart" element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            } />
                            <Route
                                path="/admin/manage-users"
                                element={
                                    <ProtectedRoute allowedUserTypes={["admin"]}>
                                        <ManageUsers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/manage-shops"
                                element={
                                    <ProtectedRoute allowedUserTypes={["admin"]}>
                                        <ManageShops />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/view-reports"
                                element={
                                    <ProtectedRoute allowedUserTypes={["admin"]}>
                                        <ViewReports />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/admin/settings" element={
                                <ProtectedRoute allowedUserTypes={["admin"]}>
                                    <Settings />
                                </ProtectedRoute>
                            } />
                            <Route path="/" element={<Index />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route
                                path="/student-dashboard"
                                element={
                                    <ProtectedRoute allowedUserTypes={["student"]}>
                                        <StudentDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/shop-dashboard"
                                element={
                                    <ProtectedRoute allowedUserTypes={["shop_owner"]}>
                                        <ShopDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manage-products"
                                element={
                                    <ProtectedRoute allowedUserTypes={["shop_owner"]}>
                                        <ManageProducts />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/manage-boarding-rooms"
                                element={
                                    <ProtectedRoute allowedUserTypes={["shop_owner"]}>
                                        <ManageBoardingRooms />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/food-order"
                                element={
                                    <ProtectedRoute>
                                        <FoodOrder />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/booking"
                                element={
                                    <ProtectedRoute>
                                        <BookingPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <Checkout />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/offers"
                                element={
                                    <ProtectedRoute>
                                        <Offers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/boarding-list"
                                element={
                                    <ProtectedRoute>
                                        <BoardingList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/owner-dashboard"
                                element={
                                    <ProtectedRoute>
                                        <OwnerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute allowedUserTypes={["admin"]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/shop/:id/items"
                                element={
                                    <ProtectedRoute>
                                        <ShopItemsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/shop/:shopId/manage-items"
                                element={
                                    <ProtectedRoute allowedUserTypes={["shop_owner"]}>
                                        <ManageShopItems />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/boarding-checkout"
                                element={
                                    <ProtectedRoute>
                                        <BoardingCheckout />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </ErrorBoundary>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
