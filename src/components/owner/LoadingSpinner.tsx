import React from "react";
import { Icons } from "@/components/ui/icons";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
    );
};

export default LoadingSpinner;