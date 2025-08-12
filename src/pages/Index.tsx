import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { OrderStatusChecker } from "../components/order/OrderStatusChecker";
import { motion } from "framer-motion";

const Index = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const handleProtectedNavigation = (path: string) => {
        if (user) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    const handleOrderNowClick = () => {
        handleProtectedNavigation('/food-order');
    };

    const handleViewNowClick = () => {
        handleProtectedNavigation('/boarding-list');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white">
            <Navbar />

            <main className="flex-grow overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                >
                    {/* Mobile View */}
                    <div className="md:hidden space-y-12">
                        <HeroSection
                            title="Dive into Delights Of Delectable"
                            highlightedWord="Food"
                            description="Looking for the perfect food options near your university? We've got you covered! Explore hassle-free solutions to make your student life easier and more comfortable."
                            buttonText="Order Now"
                            imagePath="/lovable-uploads/ee5ca7a9-24a4-4f07-9308-ef679504006c.png"
                            imageAlt="Student enjoying food"
                            onButtonClick={handleOrderNowClick}
                            className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-6"
                        />

                        <OrderStatusChecker />

                        <HeroSection
                            title="Look For Real"
                            highlightedWord="Boarding"
                            description="Looking for the perfect boarding options near your university? We've got you covered! Explore hassle-free solutions to make your student life easier and more comfortable!"
                            buttonText="View Now"
                            imagePath="/lovable-uploads/2c576533-c665-4858-955f-d909a364d1fe.png"
                            imageAlt="Students with luggage"
                            onButtonClick={handleViewNowClick}
                            className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-6"
                        />
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block space-y-24">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <HeroSection
                                title="Dive into Delights Of Delectable"
                                highlightedWord="Food"
                                description="Looking for the perfect food options near your university? We've got you covered! Explore hassle-free solutions to make your student life easier and more comfortable."
                                buttonText="Order Now"
                                imagePath="/lovable-uploads/ee5ca7a9-24a4-4f07-9308-ef679504006c.png"
                                imageAlt="Student enjoying food"
                                onButtonClick={handleOrderNowClick}
                                className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-8"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <OrderStatusChecker />
                        </motion.div>

                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <HeroSection
                                title="Look For Real"
                                highlightedWord="Boarding"
                                description="Looking for the perfect boarding options near your university? We've got you covered! Explore hassle-free solutions to make your student life easier and more comfortable!"
                                buttonText="View Now"
                                imagePath="/lovable-uploads/2c576533-c665-4858-955f-d909a364d1fe.png"
                                imageAlt="Students with luggage"
                                reversed
                                onButtonClick={handleViewNowClick}
                                className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-8"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Index;