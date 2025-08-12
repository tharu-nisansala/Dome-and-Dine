import React, { useEffect, useState, memo } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, School, UtensilsCrossed, Building2, Gift, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Order } from "@/types/order";
import { Booking } from "@/types/booking";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Timestamp } from 'firebase/firestore';

interface StudentData {
    fullName: string;
    email: string;
    university: string;
    telephone: string;
}

const ProfileCard = memo(({ studentData }: { studentData: StudentData }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
    >
        <Card className="h-full bg-white/80 backdrop-blur-sm border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-[#22c55e] text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="w-5 h-5" />
                    Profile Information
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-4 p-3 sm:p-6">
                <div className="space-y-3">
                    {[
                        { icon: User, label: "Full Name", value: studentData?.fullName },
                        { icon: Mail, label: "Email", value: studentData?.email },
                        { icon: School, label: "University", value: studentData?.university },
                        { icon: Phone, label: "Phone", value: studentData?.telephone }
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-green-50 transition-colors">
                            <item.icon className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                                <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

const QuickActionsCard = memo(({ navigate }: { navigate: (path: string) => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="h-full"
    >
        <Card className="h-full bg-white/80 backdrop-blur-sm border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-[#22c55e] text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Gift className="w-5 h-5" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-3 sm:space-y-4 p-3 sm:p-6">
                {[
                    { icon: UtensilsCrossed, label: "Order Food", path: "/food-order", color: "from-green-600 to-[#22c55e]" },
                    { icon: Building2, label: "Find Boarding", path: "/boarding-list", color: "from-[#22c55e] to-green-500" },
                    { icon: Gift, label: "View Offers", path: "/offers", color: "from-green-500 to-green-600" }
                ].map((action, index) => (
                    <Button
                        key={index}
                        className={`w-full bg-gradient-to-r ${action.color} hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 py-4 sm:py-6 text-sm sm:text-base`}
                        onClick={() => navigate(action.path)}
                    >
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                    </Button>
                ))}
            </CardContent>
        </Card>
    </motion.div>
));

const ActivityOverviewCard = memo(({ onViewOrders, onViewBookings }: { 
    onViewOrders: () => void;
    onViewBookings: () => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="h-full"
    >
        <Card className="h-full bg-white/80 backdrop-blur-sm border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-600 to-[#22c55e] text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Clock className="w-5 h-5" />
                    Activity Overview
                </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-3 sm:space-y-4 p-3 sm:p-6">
                <div
                    onClick={onViewOrders}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-300 cursor-pointer"
                >
                    <Calendar className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">Recent Orders</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">View your order history</p>
                    </div>
                </div>
                <div
                    onClick={onViewBookings}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-300 cursor-pointer"
                >
                    <Calendar className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">Recent Bookings</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">View your booking history</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

export default function StudentDashboard() {
    const [user] = useAuthState(auth);
    const [studentData, setStudentData] = useState<StudentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showOrdersDialog, setShowOrdersDialog] = useState(false);
    const [showBookingsDialog, setShowBookingsDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "users"),
                    where("uid", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data() as StudentData;
                    setStudentData(data);
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            // Remove the orderBy clause temporarily until index is created
            const ordersQuery = query(
                collection(db, "food_orders"),
                where("userId", "==", user.uid)
            );
            const querySnapshot = await getDocs(ordersQuery);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            
            // Sort orders client-side instead
            ordersData.sort((a, b) => {
                const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toDate() : new Date(a.orderDate);
                const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toDate() : new Date(b.orderDate);
                return dateB.getTime() - dateA.getTime();
            });
            
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders. Please try again later.");
        }
    };

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const bookingsQuery = query(
                collection(db, "bookings"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(bookingsQuery);
            const bookingsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Booking[];
            setBookings(bookingsData);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load bookings");
        }
    };

    const handleViewOrders = async () => {
        await fetchOrders();
        setShowOrdersDialog(true);
    };

    const handleViewBookings = async () => {
        await fetchBookings();
        setShowBookingsDialog(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Icons.spinner className="h-8 w-8 animate-spin text-[#22c55e]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col space-y-2"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Student Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-500">Welcome back, {studentData?.fullName}</p>
                </motion.div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ProfileCard studentData={studentData!} />
                    <QuickActionsCard navigate={navigate} />
                    <ActivityOverviewCard 
                        onViewOrders={handleViewOrders}
                        onViewBookings={handleViewBookings}
                    />
                </div>
            </div>

            {/* Orders Dialog */}
            <Dialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Recent Orders</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No orders found</p>
                        ) : (
                            orders.map((order) => (
                                <Card key={order.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.orderDate instanceof Timestamp ? order.orderDate.toDate() : order.orderDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">Total: Rs. {order.totalAmount}</p>
                                        </div>
                                        <Badge variant={order.status === 'completed' ? 'success' : 'default'}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bookings Dialog */}
            <Dialog open={showBookingsDialog} onOpenChange={setShowBookingsDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Recent Bookings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {bookings.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">No bookings found</p>
                        ) : (
                            bookings.map((booking) => (
                                <Card key={booking.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{booking.boardingPlace.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">Total: Rs. {booking.totalAmount}</p>
                                        </div>
                                        <Badge variant={booking.status === 'confirmed' ? 'success' : 'default'}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Footer />
        </div>
    );
}
