export interface LoginFormData {
  email: string;
  password: string;
  adminCode?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  showAdminCode: boolean;
}

export interface LoginFormFieldsProps {
  loginData: LoginFormData;
  handleLoginInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  showAdminCode: boolean;
  userType: string | null;
  isCheckingUserType: boolean;
}