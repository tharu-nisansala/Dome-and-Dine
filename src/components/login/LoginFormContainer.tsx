import { useState } from "react";
import { LoginForm } from "../LoginForm";
import { LoginFormData } from "@/types/login";
import { validateLoginFields } from "@/utils/loginValidation";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const LoginFormContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const navigate = useNavigate();

  const checkUserType = async (uid: string): Promise<string | null> => {
    try {
      console.log("Checking user type for:", uid);
      const [adminDocs, shopOwnerDocs, userDocs] = await Promise.all([
        getDocs(query(collection(db, "admins"), where("uid", "==", uid))),
        getDocs(query(collection(db, "shop_owners"), where("uid", "==", uid))),
        getDocs(query(collection(db, "users"), where("uid", "==", uid)))
      ]);

      if (!adminDocs.empty) {
        setShowAdminCode(true);
        return "admin";
      }
      if (!shopOwnerDocs.empty) return "shop_owner";
      if (!userDocs.empty) return userDocs.docs[0].data().userType;
      return null;
    } catch (error) {
      console.error("Error checking user type:", error);
      toast.error("Error verifying user type");
      return null;
    }
  };

  const verifyAdminCode = async (uid: string, adminCode: string): Promise<boolean> => {
    try {
      const adminDoc = await getDocs(
        query(
          collection(db, "admins"), 
          where("uid", "==", uid),
          where("verificationCode", "==", adminCode)
        )
      );
      return !adminDoc.empty;
    } catch (error) {
      console.error("Error verifying admin code:", error);
      toast.error("Error verifying admin code");
      return false;
    }
  };

  const handleLogin = async (loginData: LoginFormData) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Validate fields before attempting login
      const errors = validateLoginFields(loginData.email, loginData.password);
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      console.log("Attempting login with:", { email: loginData.email });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      if (!userCredential.user) {
        toast.error("User not found");
        return;
      }

      console.log("Login successful, checking user type...");
      const userType = await checkUserType(userCredential.user.uid);
      
      if (!userType) {
        toast.error("User type not found");
        return;
      }

      console.log("User type found:", userType);

      if (userType === "admin") {
        if (!loginData.adminCode) {
          setShowAdminCode(true);
          return;
        }
        
        const isValidCode = await verifyAdminCode(userCredential.user.uid, loginData.adminCode);
        if (!isValidCode) {
          toast.error("Invalid admin verification code");
          return;
        }
      }

      // Redirect based on user type
      switch (userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "shop_owner":
          navigate("/shop-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          navigate("/dashboard");
      }

      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Improved error handling with more specific messages
      if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email address");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email format");
      } else if (error.code === "auth/user-disabled") {
        toast.error("This account has been disabled");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginForm 
      onSubmit={handleLogin}
      isLoading={isLoading}
      showAdminCode={showAdminCode}
    />
  );
};