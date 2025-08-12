import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { toast } from "sonner";

interface ActivityData {
  timestamp: Date;
  type: string;
  description: string;
}

interface SystemStatus {
  serverStatus: string;
  lastBackup: string;
  systemLoad: number;
}

const ViewReports = () => {
  const navigate = useNavigate();
  const [userActivityData, setUserActivityData] = useState<Array<{ name: string; value: number }>>([]);
  const [orderActivityData, setOrderActivityData] = useState<Array<{ name: string; value: number }>>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    serverStatus: "Online",
    lastBackup: "Loading...",
    systemLoad: 0
  });

  useEffect(() => {
    // Subscribe to user activity data
    const userActivityQuery = query(
      collection(db, "analytics_user_activity"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    console.log("Setting up user activity listener");
    const unsubscribeUsers = onSnapshot(userActivityQuery, 
      (snapshot) => {
        console.log("User activity data received:", snapshot.docs.map(doc => doc.data()));
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            name: docData.month || new Date(docData.timestamp.seconds * 1000).toLocaleDateString(),
            value: docData.count || 0
          };
        });
        setUserActivityData(data);
      },
      (error) => {
        console.error("Error fetching user activity:", error);
        toast.error("Failed to load user activity data");
      }
    );

    // Subscribe to order activity data
    const orderActivityQuery = query(
      collection(db, "analytics_order_activity"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    console.log("Setting up order activity listener");
    const unsubscribeOrders = onSnapshot(orderActivityQuery,
      (snapshot) => {
        console.log("Order activity data received:", snapshot.docs.map(doc => doc.data()));
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            name: docData.month || new Date(docData.timestamp.seconds * 1000).toLocaleDateString(),
            value: docData.count || 0
          };
        });
        setOrderActivityData(data);
      },
      (error) => {
        console.error("Error fetching order activity:", error);
        toast.error("Failed to load order activity data");
      }
    );

    // Subscribe to recent activities
    const recentActivitiesQuery = query(
      collection(db, "activities"),
      orderBy("timestamp", "desc"),
      limit(3)
    );

    console.log("Setting up recent activities listener");
    const unsubscribeActivities = onSnapshot(recentActivitiesQuery,
      (snapshot) => {
        console.log("Recent activities data received:", snapshot.docs.map(doc => doc.data()));
        const activities = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
            type: data.type || "unknown",
            description: data.description || "No description available"
          };
        });
        setRecentActivities(activities);
      },
      (error) => {
        console.error("Error fetching recent activities:", error);
        toast.error("Failed to load recent activities");
      }
    );

    // Subscribe to system status
    const systemStatusQuery = query(collection(db, "system_status"), limit(1));

    console.log("Setting up system status listener");
    const unsubscribeStatus = onSnapshot(systemStatusQuery,
      (snapshot) => {
        console.log("System status data received:", snapshot.docs.map(doc => doc.data()));
        if (!snapshot.empty) {
          const statusData = snapshot.docs[0].data();
          setSystemStatus({
            serverStatus: statusData.serverStatus || "Online",
            lastBackup: statusData.lastBackup || "N/A",
            systemLoad: statusData.systemLoad || 0
          });
        }
      },
      (error) => {
        console.error("Error fetching system status:", error);
        toast.error("Failed to load system status");
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
      unsubscribeActivities();
      unsubscribeStatus();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <AnalyticsCard
                title="User Activity"
                data={userActivityData}
                color="#4f46e5"
              />
              <AnalyticsCard
                title="Order Activity"
                data={orderActivityData}
                color="#10b981"
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activities</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Server Status</span>
                    <span className={`${systemStatus.serverStatus === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
                      {systemStatus.serverStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Backup</span>
                    <span>{systemStatus.lastBackup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Load</span>
                    <span>{systemStatus.systemLoad}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewReports;