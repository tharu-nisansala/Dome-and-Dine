import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface SocialButtonProps {
    provider: 'google' | 'facebook';
    isLoading: boolean;
    handleSocialRegister: (provider: 'google' | 'facebook') => Promise<void>;
}

// Mapping of providers to their respective icons
const providerIcons = {
    google: Icons.google,
    facebook: Icons.facebook,
};

const SocialButton = ({
                          provider,
                          isLoading,
                          handleSocialRegister,
                      }: SocialButtonProps) => {
    // Get the icon component based on the provider
    const Icon = providerIcons[provider];

    return (
        <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleSocialRegister(provider)}
            aria-label={`Register with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
        >
            {isLoading ? (
                <span className="loader" /> // Add a loading spinner here if needed
            ) : (
                <>
                    <Icon className="mr-2 h-4 w-4" />
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </>
            )}
        </Button>
    );
};

interface SocialButtonsProps {
    isLoading: boolean;
    handleSocialRegister: (provider: 'google' | 'facebook') => Promise<void>;
}

export const SocialButtons = ({ isLoading, handleSocialRegister }: SocialButtonsProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <SocialButton
                provider="google"
                isLoading={isLoading}
                handleSocialRegister={handleSocialRegister}
            />
            <SocialButton
                provider="facebook"
                isLoading={isLoading}
                handleSocialRegister={handleSocialRegister}
            />
        </div>
    );
};
