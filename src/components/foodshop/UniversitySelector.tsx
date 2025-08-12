import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { universities } from "@/utils/constants";

interface UniversitySelectorProps {
  selectedUniversities: string[];
  onUniversityToggle: (university: string) => void;
}

export const UniversitySelector = ({
  selectedUniversities,
  onUniversityToggle,
}: UniversitySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUniversities = universities.filter((uni) =>
    uni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Search Universities</Label>
        <Input
          placeholder="Search universities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedUniversities.map((uni) => (
          <Badge
            key={uni}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer px-3 py-1.5"
            onClick={() => onUniversityToggle(uni)}
          >
            {uni}
            <X className="w-3 h-3 ml-2 inline-block" />
          </Badge>
        ))}
      </div>

      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-4 space-y-2">
          {filteredUniversities.map((uni) => (
            <div
              key={uni}
              onClick={() => onUniversityToggle(uni)}
              className={`cursor-pointer p-2 rounded-md transition-colors ${
                selectedUniversities.includes(uni)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-gray-100"
              }`}
            >
              {uni}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};