import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UniversitySelector } from "./UniversitySelector";
import { motion } from "framer-motion";

interface EditFoodShopFormProps {
  formData: {
    name: string;
    description: string;
    image: string;
    rating: string;
    universities: string[];
    isOpen: boolean;
    location: {
      address: string;
      city: string;
    };
    contact: {
      phone: string;
      email: string;
      website: string;
    };
    businessHours: {
      open: string;
      close: string;
      daysOpen: string[];
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const EditFoodShopForm = ({ formData, setFormData }: EditFoodShopFormProps) => {
  const handleUniversityToggle = (university: string) => {
    setFormData(prev => ({
      ...prev,
      universities: prev.universities.includes(university)
        ? prev.universities.filter(u => u !== university)
        : [...prev.universities, university]
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Shop Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter shop name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter shop description"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            min="0"
            max="5"
            step="0.1"
            required
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="isOpen">Shop Status</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="isOpen"
              checked={formData.isOpen}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOpen: checked }))}
            />
            <span className={formData.isOpen ? 'text-green-600' : 'text-red-600'}>
              {formData.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Universities</Label>
          <UniversitySelector
            selectedUniversities={formData.universities}
            onUniversityToggle={handleUniversityToggle}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <Label>Location</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Street address"
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))}
                placeholder="City"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <Label>Contact</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.contact.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value }
                }))}
                placeholder="Phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value }
                }))}
                placeholder="Email address"
                required
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="space-y-4">
          <Label>Business Hours</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="openTime">Opening Time</Label>
              <Input
                id="openTime"
                type="time"
                value={formData.businessHours.open}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  businessHours: { ...prev.businessHours, open: e.target.value }
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="closeTime">Closing Time</Label>
              <Input
                id="closeTime"
                type="time"
                value={formData.businessHours.close}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  businessHours: { ...prev.businessHours, close: e.target.value }
                }))}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};