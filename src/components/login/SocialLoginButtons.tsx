import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface SocialLoginButtonsProps {
  isLoading: boolean;
  handleSocialLogin: (provider: "google" | "facebook") => Promise<void>;
}

export const SocialLoginButtons = ({
  isLoading,
  handleSocialLogin,
}: SocialLoginButtonsProps) => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleSocialLogin("google")}
          className="w-full"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleSocialLogin("facebook")}
          className="w-full"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.facebook className="mr-2 h-4 w-4" />
          )}
          Facebook
        </Button>
      </div>
    </>
  );
};