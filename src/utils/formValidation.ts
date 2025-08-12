import { RegisterFormData } from "../types/auth";

export const validateFormFields = (formData: RegisterFormData, userType: string): string[] => {
  const requiredFields = userType === 'shop_owner'
    ? ['fullName', 'address', 'telephone', 'email', 'password', 'shopName', 'businessRegistrationNumber', 'shopAddress', 'shopCategory']
    : userType === 'admin'
      ? ['fullName', 'address', 'telephone', 'email', 'password']
      : ['fullName', 'address', 'telephone', 'university', 'email', 'password'];

  return requiredFields.filter(field => !formData[field as keyof RegisterFormData]);
};