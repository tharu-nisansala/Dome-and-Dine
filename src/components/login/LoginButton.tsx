import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface LoginButtonProps {
  isLoading: boolean;
}

export const LoginButton = ({ isLoading }: LoginButtonProps) => {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90"
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
};