import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { toast } from "sonner";
import { handleSocialAuth } from "../utils/socialAuth";
import { RegisterFormFields } from "./auth/RegisterFormFields";
import { SocialButtons } from "./auth/SocialButtons";
import { RegisterFormProps, RegisterFormData } from "../types/auth";
import { validateFormFields } from "../utils/formValidation";
import imageCompression from 'browser-image-compression';
import { handleAdminRegistration } from "./auth/AdminRegistration";
import { handleStudentRegistration } from "./auth/StudentRegistration";
import { handleShopOwnerRegistration } from "./auth/ShopOwnerRegistration";
import { Timestamp } from "firebase/firestore";
import { universities } from "@/utils/constants";

const IMGUR_CLIENT_ID = "0ffc4aed9929402";

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    address: "",
    telephone: "",
    university: "",
    email: "",
    password: "",
    userType: "student",
    shopName: "",
    businessRegistrationNumber: "",
    shopAddress: "",
    adminCode: "",
    profileUrl: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setIsLoading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 500,
      };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const formData = new FormData();
        formData.append('image', base64data.split(',')[1]);
        
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          setFormData(prev => ({ ...prev, profileUrl: result.data.link }));
          toast.success('Profile picture uploaded successfully!');
        } else {
          throw new Error('Failed to upload image');
        }
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const user = await handleSocialAuth(provider, true);
      if (user) {
        setFormData({
          fullName: "",
          address: "",
          telephone: "",
          university: "",
          email: "",
          password: "",
          userType: "student",
          shopName: "",
          businessRegistrationNumber: "",
          shopAddress: "",
          adminCode: "",
          profileUrl: ""
        });
        toast.success("Registration successful! Please log in.");
        onSuccess?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const missingFields = validateFormFields(formData, formData.userType);

      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      ).catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('This email is already registered. Please use a different email or try logging in.');
          throw new Error('Email already exists');
        }
        throw error;
      });

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        userType: formData.userType,
        createdAt: Timestamp.now(),
        provider: 'email',
        profileUrl: formData.profileUrl,
        address: formData.address,
        telephone: formData.telephone,
        university: formData.userType === 'student' ? formData.university : null,
        shopName: formData.shopName,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        shopAddress: formData.shopAddress,
        shopCategory: formData.userType === 'shop_owner' ? "Food & Beverages" : null
      };

      switch (formData.userType) {
        case 'admin':
          await handleAdminRegistration(userData, user.uid);
          break;
        case 'shop_owner':
          await handleShopOwnerRegistration(userData, user.uid);
          break;
        default:
          await handleStudentRegistration(userData, user.uid);
      }

      await auth.signOut();
      
      toast.success("Registration successful! Please log in.");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating user or adding to Firestore: ", error);
      if (error.message === 'Email already exists') {
        return;
      }
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">Enter your details to get started</p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <RegisterFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleImageUpload={handleImageUpload}
          universities={universities}
        />

        <Button
          className="w-full bg-primary hover:bg-primary/90"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or register with</span>
          </div>
        </div>

        <SocialButtons
          isLoading={isLoading}
          handleSocialRegister={handleSocialRegister}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
