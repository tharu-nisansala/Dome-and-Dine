import { Button } from "./ui/button";

interface HeroSectionProps {
    title: string;
    highlightedWord: string;
    description: string;
    buttonText: string;
    imagePath: string;
    imageAlt: string;
    reversed?: boolean;
    onButtonClick?: () => void;
    className?: string;
    loading?: boolean;
}

const HeroSection = ({
                         title,
                         highlightedWord,
                         description,
                         buttonText,
                         imagePath,
                         imageAlt,
                         reversed = false,
                         onButtonClick,
                         className,
                         loading = false
                     }: HeroSectionProps) => {
    return (
        <div className={`py-8 md:py-16 px-4 md:px-6 ${className}`}>
            <div className={`max-w-7xl mx-auto flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}>
                <div className="flex-1 text-center md:text-left animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
                        {title}{" "}
                        <span className="text-primary">{highlightedWord}</span>
                    </h2>
                    <p className="text-gray-600 mb-6 md:mb-8 text-base sm:text-lg max-w-xl mx-auto md:mx-0">
                        {description}
                    </p>
                    <Button
                        className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto"
                        onClick={onButtonClick}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : buttonText}
                    </Button>
                </div>
                <div className="flex-1 mt-8 md:mt-0">
                    <div className="relative w-full aspect-square max-w-[400px] md:max-w-[500px] mx-auto">
                        <div
                            className="absolute inset-0 bg-primary/20 rounded-full blur-2xl md:blur-3xl transform scale-110 md:scale-125"></div>
                        <div className="absolute inset-4 bg-primary/10 rounded-full hidden md:block"></div>
                        <div className="absolute inset-8 bg-primary/5 rounded-full hidden md:block"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src={imagePath}
                                alt={imageAlt}
                                title={imageAlt}
                                className="relative z-10 w-full h-auto max-w-[95%] md:max-w-[90%] animate-slide-in"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
