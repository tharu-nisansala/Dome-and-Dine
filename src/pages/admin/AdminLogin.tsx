import { AdminAuthForm } from "@/components/admin/AdminAuthForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">Admin Login</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <AdminAuthForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}