import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthTabs from "../components/AuthTabs";

const Login = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <div className="container mx-auto px-4 py-8">
          <AuthTabs defaultTab="login" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;