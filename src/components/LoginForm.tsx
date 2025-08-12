import { useState, useEffect } from "react";
import { LoginFormData, LoginFormProps } from "@/types/login";
import { LoginFormFields } from "./login/LoginFormFields";
import { LoginButton } from "./login/LoginButton";
import { SocialLoginButtons } from "./login/SocialLoginButtons";
import { handleSocialAuth } from "@/utils/socialAuth";
import { db } from "@/firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { UserTypeDisplay } from "./login/UserTypeDisplay";

export const LoginForm = ({ onSubmit, isLoading, showAdminCode }: LoginFormProps) => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    adminCode: "",
  });
  const [userType, setUserType] = useState<string | null>(null);
  const [checkingUserType, setCheckingUserType] = useState(false);

  const checkUserType = async (email: string) => {
    if (!email) {
      setUserType(null);
      return;
    }

    setCheckingUserType(true);
    try {
      const [adminDocs, shopOwnerDocs, userDocs] = await Promise.all([
        getDocs(query(collection(db, "admins"), where("email", "==", email))),
        getDocs(query(collection(db, "shop_owners"), where("email", "==", email))),
        getDocs(query(collection(db, "users"), where("email", "==", email)))
      ]);

      if (!adminDocs.empty) {
        setUserType("admin");
      } else if (!shopOwnerDocs.empty) {
        setUserType("shop_owner");
      } else if (!userDocs.empty) {
        const userData = userDocs.docs[0].data();
        setUserType(userData.userType || "student");
      } else {
        setUserType(null);
      }
    } catch (error) {
      console.error("Error checking user type:", error);
      setUserType(null);
    } finally {
      setCheckingUserType(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      checkUserType(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(loginData);
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const user = await handleSocialAuth(provider, false);
      if (user) {
        setLoginData({ email: "", password: "", adminCode: "" });
      }
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <LoginFormFields
          loginData={loginData}
          handleLoginInputChange={handleLoginInputChange}
          isLoading={isLoading}
          showAdminCode={showAdminCode}
          userType={userType}
          isCheckingUserType={checkingUserType}
        />
        <LoginButton isLoading={isLoading} />
      </form>

      <SocialLoginButtons
        isLoading={isLoading}
        handleSocialLogin={handleSocialLogin}
      />
    </div>
  );
};