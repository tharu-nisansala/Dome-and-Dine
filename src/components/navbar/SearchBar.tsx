import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange, onSubmit }: SearchBarProps) => {
  return (
    <form onSubmit={onSubmit} className="hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary"
        />
      </div>
    </form>
  );
};