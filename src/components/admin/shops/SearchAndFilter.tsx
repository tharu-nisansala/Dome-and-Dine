import { Input } from "../../../components/ui/input";
import { FileDown } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
}

export const SearchAndFilter = ({ searchTerm, onSearchChange, onExport }: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <Input
        placeholder="Search shops..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Button 
        onClick={onExport} 
        variant="outline" 
        className="flex gap-2"
      >
        <FileDown className="h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
};