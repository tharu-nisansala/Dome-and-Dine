import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { universities } from '@/utils/constants';

interface UniversityFilterProps {
  selectedUniversity: string;
  onUniversityChange: (value: string) => void;
  onReset: () => void;
}

export const UniversityFilter = ({
  selectedUniversity,
  onUniversityChange,
  onReset
}: UniversityFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in">
      <Select onValueChange={onUniversityChange} value={selectedUniversity}>
        <SelectTrigger className="w-full sm:w-[300px] bg-white">
          <SelectValue placeholder="Select University" />
        </SelectTrigger>
        <SelectContent>
          {universities.map(uni => (
            <SelectItem key={uni} value={uni}>{uni}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        onClick={onReset} 
        variant="outline"
        className="w-full sm:w-auto"
      >
        Reset Filter
      </Button>
    </div>
  );
};