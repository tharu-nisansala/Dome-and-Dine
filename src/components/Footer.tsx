import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/lovable-uploads/4573185d-78c5-4719-a116-f9c7154feba9.png"
                alt="Dorm & Dine"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">Dorm & Dine</span>
            </Link>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              123 Student Street, Campus Area
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4" />
              +94 11 234 5678
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4" />
              info@dormdine.com
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/vision" className="text-gray-600 hover:text-primary">Vision</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/food" className="text-gray-600 hover:text-primary">Food Delivery</Link></li>
              <li><Link to="/boarding" className="text-gray-600 hover:text-primary">Boarding</Link></li>
              <li><Link to="/offers" className="text-gray-600 hover:text-primary">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/dormdine" aria-label="Facebook" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/dormdine" aria-label="Twitter" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/dormdine" aria-label="Instagram" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>© 2024 Dorm & Dine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;