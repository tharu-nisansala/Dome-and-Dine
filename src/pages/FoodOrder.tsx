import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodOrderSection from "@/components/FoodOrderSection";

const FoodOrder = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <FoodOrderSection />
      </main>
      <Footer />
    </div>
  );
};

export default FoodOrder;