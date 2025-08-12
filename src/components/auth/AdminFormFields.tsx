import { RegisterFormData } from "../../types/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, UserRound } from "lucide-react";

interface AdminFormFieldsProps {
  formData: RegisterFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdminFormFields = ({
  formData,
  handleInputChange,
  handleImageUpload,
}: AdminFormFieldsProps) => {
  return (
    <div className="space-y-4">
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
        type="tel"
        value={formData.telephone}
        onChange={handleInputChange}
      />

      <div className="space-y-2">
        <Label htmlFor="profilePicture" className="flex items-center gap-2">
          <UserRound className="w-4 h-4" />
          Profile Picture
        </Label>
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
    </div>
  );
};