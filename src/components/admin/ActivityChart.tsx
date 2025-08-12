import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";

export const ActivityChart = () => {
  const [activityData, setActivityData] = useState([
    { name: 'Jan', users: 0, orders: 0 },
    { name: 'Feb', users: 0, orders: 0 },
    { name: 'Mar', users: 0, orders: 0 },
    { name: 'Apr', users: 0, orders: 0 },
    { name: 'May', users: 0, orders: 0 },
    { name: 'Jun', users: 0, orders: 0 },
  ]);

  useEffect(() => {
    // Subscribe to real-time updates for activity data
    const activityQuery = query(
      collection(db, "activity_stats"),
      orderBy("timestamp", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(activityQuery, 
      (snapshot) => {
        const newData = snapshot.docs.map(doc => ({
          name: doc.data().month,
          users: doc.data().users || 0,
          orders: doc.data().orders || 0,
        }));
        
        if (newData.length > 0) {
          setActivityData(newData);
        }
      },
      (error) => {
        console.error("Error fetching activity data:", error);
        toast.error("Failed to load activity data");
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};