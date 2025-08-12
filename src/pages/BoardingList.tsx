import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoardingSection from "@/components/BoardingSection";

const BoardingList = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-16">
                <BoardingSection />
            </main>
            <Footer />
        </div>
    );
};

export default BoardingList;