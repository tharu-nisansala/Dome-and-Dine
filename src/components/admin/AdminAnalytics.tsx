import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useAdminData } from "@/hooks/useAdminData";

interface DataItem {
  name: string;
  users: number;
  orders: number;
}

export const AdminAnalytics = () => {
  const { users, orders, isLoading } = useAdminData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            Loading analytics...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for the chart
  const processData = () => {
    const data: DataItem[] = [];
    
    // Ensure we have arrays to work with
    const usersArray = Array.isArray(users) ? users : [];
    const ordersArray = Array.isArray(orders) ? orders : [];
    
    console.log("Processing data with users:", usersArray.length, "orders:", ordersArray.length);
    
    // Convert Firestore Timestamps to formatted dates and count by date
    const ordersByDate = ordersArray.reduce((acc: { [key: string]: number }, order) => {
      if (order.createdAt) {
        const date = format(order.createdAt.toDate(), 'MMM d');
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    const usersByDate = usersArray.reduce((acc: { [key: string]: number }, user) => {
      if (user.createdAt) {
        const date = format(user.createdAt.toDate(), 'MMM d');
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    // Combine all dates
    const allDates = [...new Set([...Object.keys(ordersByDate), ...Object.keys(usersByDate)])];
    
    // Create data points
    allDates.forEach(date => {
      data.push({
        name: date,
        orders: ordersByDate[date] || 0,
        users: usersByDate[date] || 0
      });
    });

    console.log("Processed chart data:", data);
    return data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  };

  const chartData = processData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};