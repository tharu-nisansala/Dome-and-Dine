export interface RegisterFormProps {
  onSuccess?: () => void;
}

export interface RegisterFormData {
  fullName: string;
  address: string;
  telephone: string;
  university: string;
  email: string;
  password: string;
  userType: "student" | "shop_owner" | "admin";
  shopName: string;
  businessRegistrationNumber: string;
  shopAddress: string;
  shopCategory?: string;
  adminCode: string;
  profileUrl: string;
}