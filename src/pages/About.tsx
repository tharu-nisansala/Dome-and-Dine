import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Building2, Users, Globe, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            About Dorm & Dine
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your ultimate companion in student living, making accommodation and dining easier than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Building2 className="h-7 w-7 text-[#22c55e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Housing</h3>
            <p className="text-gray-600">Find verified properties near your campus with our curated selection.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-[#22c55e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
            <p className="text-gray-600">Connect with fellow students and build lasting relationships.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Globe className="h-7 w-7 text-[#22c55e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility</h3>
            <p className="text-gray-600">Access everything you need with our user-friendly platform.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-[#22c55e]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Resources</h3>
            <p className="text-gray-600">Access helpful guides and support for your student journey.</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We understand the unique challenges of student life. That's why we've created a platform
              that seamlessly connects you with quality accommodation and dining options near your university.
              Our goal is to make your student life easier and more enjoyable.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-[#22c55e] rounded-3xl p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white">Join Our Community Today</h2>
            <p className="text-xl text-white/90">
              Whether you're looking for a comfortable place to stay or delicious meals nearby,
              we've got you covered.
            </p>
            <Button 
              className="bg-white text-[#22c55e] hover:bg-white/90 px-8 py-6 rounded-full text-lg font-semibold"
              onClick={() => window.location.href = '/signup'}
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;