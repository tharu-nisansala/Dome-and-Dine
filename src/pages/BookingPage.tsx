import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebaseConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingForm } from "@/components/booking/BookingForm";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { BoardingPlace } from "@/types/boardingPlaceTypes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const boardingPlace = location.state?.boardingPlace as BoardingPlace;
  const [date, setDate] = useState<Date>();
  
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    price: boardingPlace?.price ? Number(boardingPlace.price) : 0,
    serviceFee: 1000,
    checkInDate: new Date(),
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!boardingPlace) {
      toast.error("No boarding place selected");
      navigate('/boarding-list');
    }
  }, [boardingPlace, navigate]);

  if (!boardingPlace) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!bookingDetails.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!bookingDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(bookingDetails.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!bookingDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!date) {
      newErrors.checkInDate = "Check-in date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to make a booking");
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setBookingDetails(prev => ({
      ...prev,
      checkInDate: date || new Date(),
    }));

    // Navigate to checkout with booking details
    navigate('/boarding-checkout', {
      state: {
        boardingPlace,
        bookingDetails: {
          ...bookingDetails,
          checkInDate: date || new Date(),
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Boarding Places
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">Book Your Stay</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Boarding Place Details */}
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={boardingPlace.image}
                  alt={boardingPlace.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{boardingPlace.name}</h2>
              <p className="text-gray-600">{boardingPlace.description}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Location:</span>
                <span>{boardingPlace.location || "Location not specified"}</span>
              </div>
              <div className="text-lg font-semibold text-primary">
                Rs. {typeof boardingPlace.price === 'string' 
                  ? parseFloat(boardingPlace.price).toFixed(2) 
                  : boardingPlace.price.toFixed(2)}
                <span className="text-sm text-gray-600">/month</span>
              </div>
            </Card>

            {/* Booking Form */}
            <div className="space-y-6">
              <BookingForm
                bookingDetails={bookingDetails}
                handleChange={handleChange}
                date={date}
                setDate={setDate}
                errors={errors}
                onSubmit={handleSubmit}
                boardingPlace={boardingPlace}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
