import React from "react";

const Spinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin border-t-blue-500"></div>
        </div>
    );
};

export default Spinner;
