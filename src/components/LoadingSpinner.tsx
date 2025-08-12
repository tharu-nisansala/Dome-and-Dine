import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    message?: string;
    spinnerColor?: string;
    overlayColor?: string;
    size?: string;
    delay?: number;
    style?: React.CSSProperties;
}

const LoadingSpinner = ({
                            message = "Loading...",
                            spinnerColor = "text-primary",
                            overlayColor = "bg-black/50",
                            size = "h-12 w-12",
                            delay = 0,
                            style = {},
                        }: LoadingSpinnerProps) => {
    return (
        <div
            className={`${overlayColor} fixed inset-0 flex items-center justify-center z-50`}
            style={style}
            aria-live="assertive"
            role="status"
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-xl flex flex-col items-center justify-center opacity-0 animate-fade-in transition-opacity duration-500 delay-${delay}s`}
                style={{ animationDelay: `${delay}s` }}
            >
                <Loader2
                    className={`animate-spin ${size} ${spinnerColor} transition-all duration-300 transform`}
                />
                <p className="mt-4 text-sm text-gray-700">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
