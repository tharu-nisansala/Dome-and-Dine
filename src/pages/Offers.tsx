import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Offers = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-12">Special Offers</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Food Offer Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <img
                  src="/lovable-uploads/ee5ca7a9-24a4-4f07-9308-ef679504006c.png"
                  alt="Student Meal Deal - Get 20% off on your first food order!"
                  className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Student Meal Deal</h3>
                <p className="text-gray-600 mb-4">
                  Get 20% off on your first food order! Perfect for those busy study days.
                </p>
                <Button
                    onClick={() => navigate('/food-order')}
                    className="w-full hover:bg-blue-700 transition-colors"
                >
                  Order Now
                </Button>
              </div>
            </div>

            {/* Accommodation Offer Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <img
                  src="/lovable-uploads/2c576533-c665-4858-955f-d909a364d1fe.png"
                  alt="Early Bird Booking - Book your accommodation early!"
                  className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Early Bird Booking</h3>
                <p className="text-gray-600 mb-4">
                  Book your accommodation early and get 10% off on your first month's rent!
                </p>
                <Button
                    onClick={() => navigate('/booking')}
                    className="w-full hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Special Package Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <img
                  src="/lovable-uploads/ce3fb8ea-fc63-40ef-9da5-b73cfefa80e8.png"
                  alt="Complete Package - Bundle your accommodation and meal plan"
                  className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Complete Package</h3>
                <p className="text-gray-600 mb-4">
                  Bundle your accommodation and meal plan for extra savings!
                </p>
                <Button
                    onClick={() => navigate('/booking')}
                    className="w-full hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default Offers;
