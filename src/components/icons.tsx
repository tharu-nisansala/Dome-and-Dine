// components/ui/icons.tsx
import { LucideProps, Loader2 } from "lucide-react";

type IconName = "spinner" | "utensils" | "home" | "arrowLeft"; // Define supported icon names

interface IconProps extends LucideProps {
    name: IconName;
    "aria-label"?: string; // Optional accessibility label
}

export const Icons = ({ name, "aria-label": ariaLabel, ...props }: IconProps) => {
    const iconMap: Record<IconName, JSX.Element> = {
        spinner: <Loader2 aria-label={ariaLabel} {...props} />,
        utensils: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label={ariaLabel}
                {...props}
            >
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
        ),
        home: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label={ariaLabel}
                {...props}
            >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        arrowLeft: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label={ariaLabel}
                {...props}
            >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
            </svg>
        ),
    };

    return iconMap[name] || null;
};