import { Input } from "@/components/ui/input";
import { LoginFormFieldsProps } from "@/types/login";
import { UserTypeDisplay } from "./UserTypeDisplay";

export const LoginFormFields = ({
  loginData,
  handleLoginInputChange,
  isLoading,
  showAdminCode,
  userType,
  isCheckingUserType,
}: LoginFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <UserTypeDisplay userType={userType} isLoading={isCheckingUserType} />
        </div>
        <Input
          id="email"
          name="email"
          type="email"
          value={loginData.email}
          onChange={handleLoginInputChange}
          placeholder="name@example.com"
          className="w-full"
          required
          disabled={isLoading}
          aria-label="Email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          value={loginData.password}
          onChange={handleLoginInputChange}
          placeholder="Enter your password"
          className="w-full"
          required
          disabled={isLoading}
          aria-label="Password"
        />
      </div>

      {showAdminCode && (
        <div className="space-y-2">
          <label htmlFor="adminCode" className="text-sm font-medium text-gray-700">Admin Code</label>
          <Input
            id="adminCode"
            name="adminCode"
            type="text"
            value={loginData.adminCode || ''}
            onChange={handleLoginInputChange}
            placeholder="Enter admin verification code"
            className="w-full"
            required
            disabled={isLoading}
            aria-label="Admin Code"
          />
        </div>
      )}
    </>
  );
};