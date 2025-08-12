import { Button } from "@/components/ui/button";
import { Plus, Store } from "lucide-react";

interface FoodShopHeaderProps {
    onAddNew: () => void;
}

export const FoodShopHeader = ({ onAddNew }: FoodShopHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Food Shops</h1>
                </div>
                <p className="text-gray-500">Add, edit, and manage your food shop listings</p>
            </div>
            <Button 
                onClick={onAddNew} 
                className="bg-primary hover:bg-primary/90 text-white shadow-sm transition-all duration-200"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add New Shop
            </Button>
        </div>
    );
};