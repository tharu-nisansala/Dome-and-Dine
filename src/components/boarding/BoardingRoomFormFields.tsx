import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { UniversitySelector } from "./UniversitySelector";
import { Card, CardContent } from "../../components/ui/card";
import { ImageIcon, School } from "lucide-react";

interface BoardingRoomFormFieldsProps {
  formData: {
    name: string;
    description: string;
    image: string;
    price: string;
    universities: string[];
    rating: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    image: string;
    price: string;
    universities: string[];
    rating: string;
  }>>;
}

export const BoardingRoomFormFields = ({
  formData,
  setFormData,
}: BoardingRoomFormFieldsProps) => {
  const handleUniversityToggle = (university: string) => {
    setFormData(prev => ({
      ...prev,
      universities: prev.universities.includes(university)
        ? prev.universities.filter(u => u !== university)
        : [...prev.universities, university]
    }));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">Room Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter room name"
            className="h-11"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your boarding room"
            className="min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="text-base font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Image URL
          </Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            placeholder="Enter image URL"
            className="h-11"
            required
          />
          {formData.image && (
            <div className="mt-2 rounded-lg overflow-hidden border">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-medium">Price (Rs./month)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Enter monthly price"
            className="h-11"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating" className="text-base font-medium">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            placeholder="Enter rating"
            className="h-11"
            min="0"
            max="5"
            step="0.1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium flex items-center gap-2">
            <School className="w-4 h-4" />
            Universities
          </Label>
          <UniversitySelector
            selectedUniversities={formData.universities}
            onUniversityToggle={handleUniversityToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};