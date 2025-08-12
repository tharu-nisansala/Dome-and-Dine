import { Badge } from "@/components/ui/badge";

interface UserTypeDisplayProps {
  userType: string | null;
  isLoading: boolean;
}

export const UserTypeDisplay = ({ userType, isLoading }: UserTypeDisplayProps) => {
  if (isLoading) {
    return <Badge variant="outline" className="animate-pulse">Checking...</Badge>;
  }

  if (!userType) {
    return null;
  }

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'student':
        return 'bg-blue-500';
      case 'shop_owner':
        return 'bg-green-500';
      case 'admin':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={`${getBadgeColor(userType)} text-white`}>
      {userType === 'shop_owner' ? 'Shop Owner' : userType.charAt(0).toUpperCase() + userType.slice(1)}
    </Badge>
  );
};