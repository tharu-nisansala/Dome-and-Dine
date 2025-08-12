import { RegisterFormData } from "../../types/auth";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminFormFields } from "./AdminFormFields";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface RegisterFormFieldsProps {
  formData: RegisterFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  universities: string[];
}

export const RegisterFormFields = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleImageUpload,
  universities,
}: RegisterFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <Select
        value={formData.userType}
        onValueChange={(value) => handleSelectChange("userType", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select user type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="shop_owner">Shop Owner</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      {formData.userType === "admin" ? (
        <AdminFormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleImageUpload={handleImageUpload}
        />
      ) : formData.userType === "shop_owner" ? (
        <>
          <div className="space-y-2">
            <Input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="shopName"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="businessRegistrationNumber"
              placeholder="Business Registration Number"
              value={formData.businessRegistrationNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="shopAddress"
              placeholder="Shop Address"
              value={formData.shopAddress}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Input
              name="telephone"
              placeholder="Telephone"
              value={formData.telephone}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <div className="flex items-center gap-4">
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </label>
              {formData.profileUrl && (
                <div className="w-12 h-12 rounded-full overflow-hidden border">
                  <img
                    src={formData.profileUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Input
            name="telephone"
            placeholder="Telephone"
            value={formData.telephone}
            onChange={handleInputChange}
          />
          <Select
            value={formData.university}
            onValueChange={(value) => handleSelectChange("university", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select university" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((university) => (
                <SelectItem key={university} value={university}>
                  {university}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}

      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
    </div>
  );
};