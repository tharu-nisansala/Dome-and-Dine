import { Card, CardContent } from "../../../components/ui/card";
import { UserStats } from "../../../types/user";

interface UserStatsProps {
  stats: UserStats;
}

export const UserStatsCards = ({ stats }: UserStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-muted-foreground">Total Users</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.students}</div>
          <p className="text-muted-foreground">Students</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.shopOwners}</div>
          <p className="text-muted-foreground">Shop Owners</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.admins}</div>
          <p className="text-muted-foreground">Admins</p>
        </CardContent>
      </Card>
    </div>
  );
};