import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserProfile from "../components/dashboard/UserProfile";
import OrderHistory from "../components/dashboard/OrderHistory";
import AccountSettings from "../components/dashboard/AccountSettings";
import Spinner from "@/components/ui/Spinner"; // Import the Spinner component

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          if (!user) {
            navigate("/login");
          } else {
            setLoading(false); // Stop loading when auth state is determined
          }
        },
        (err) => {
          setError("An error occurred while checking authentication.");
          setLoading(false);
        }
    );

    return () => unsubscribe(); // Unsubscribe when the component unmounts
  }, [navigate]);

  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner /> {/* Display the spinner while loading */}
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UserProfile />
            <div className="md:col-span-2 space-y-6">
              <AccountSettings />
              <OrderHistory />
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default Dashboard;
